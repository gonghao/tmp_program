#!/usr/bin/python
# coding: utf-8

import json, urllib, types
from httpclient import Request
from twisted.internet import defer

CATEGORY_LIST = [
    { 'name': '私人兆赫', 'id': 'personal' },
    { 'name': '公共兆赫', 'id': 'public' }
]

CHANNEL_LIST = [
    { 'name': '私人', 'id': 0, 'category': 'personal' },
    { 'name': '华语', 'id': 1, 'category': 'public' },
    { 'name': '欧美', 'id': 2, 'category': 'public' },
    { 'name': '粤语', 'id': 6, 'category': 'public' },
    { 'name': '法语', 'id': 22, 'category': 'public' },
    { 'name': '日语', 'id': 17, 'category': 'public' },
    { 'name': '韩语', 'id': 18, 'category': 'public' },
    { 'name': '民谣', 'id': 8, 'category': 'public' },
    { 'name': '摇滚', 'id': 7, 'category': 'public' },
    { 'name': '爵士', 'id': 13, 'category': 'public' },
    { 'name': '古典', 'id': 27, 'category': 'public' },
    { 'name': '轻音乐', 'id': 9, 'category': 'public' },
    { 'name': '电子', 'id': 14, 'category': 'public' },
    { 'name': 'R&B', 'id': 16, 'category': 'public' },
    { 'name': '说唱', 'id': 15, 'category': 'public' },
    { 'name': '电影原声', 'id': 10, 'category': 'public' },
    { 'name': '七零', 'id': 3, 'category': 'public' },
    { 'name': '八零', 'id': 4, 'category': 'public' },
    { 'name': '九零', 'id': 5, 'category': 'public' },
    { 'name': '豆瓣音乐人', 'id': 26, 'category': 'public' },
    { 'name': 'Who\'s Next?!', 'id': 48, 'category': 'public' },
    { 'name': '女声', 'id': 20, 'category': 'public' },
    { 'name': '动漫', 'id': 28, 'category': 'public' },
    { 'name': '咖啡', 'id': 32, 'category': 'public' },
    { 'name': '中国原创盛典', 'id': 50, 'category': 'public' },
    { 'name': 'K5经典乐赏', 'id': 51, 'category': 'public' },
    { 'name': '乐混翻唱', 'id': 52, 'category': 'public' }
]

REQUEST_DEFAULT_PARAMS = [ 'sid', 'channel', 'h' ]

REQUEST_TYPE_MAP = {
    'skip': { 'name': 's' },
    'change_channel': { 'name': 's' },
    'play_to_end': { 'name': 'e', 'params': [ 'sid', 'channel' ] },
    'like': { 'name': 'r' },
    'unlike': { 'name': 'u' },
    'block': { 'name': 'b' },
    'init': { 'name': 'n', 'params': [ 'channel' ] },
    'update': { 'name': 'p' } 
}

MAX_RECENT_NUM = 20
#API_MUSIC_LIST = 'http://douban.fm/j/mine/playlist?'
API_MUSIC_LIST = 'http://node.ghsky.com/j/mine/playlist?'

class Music(object):
    def __init__(self, data):
        self.data = data
        self.sid = data['sid']
        self.flag = None

    def action(self, name):
        flag = None

        if name == 'block':
            flag = 'b'
        elif name == 'skip':
            flag = 's'
        elif name == 'end':
            flag = 'e'
        elif name == 'rate':
            flag = 'r'
        elif name == 'unrate':
            flag = 'u'

        self.flag = flag

class MusicList(object):
    def __init__(self, reactor):
        self.musics = []
        self.recents = []
        self.channel = None
        self.isPlaying = False
        self.defers = {}
        self._reactor = reactor

    def buildParam(self, t):
        requestInfo = REQUEST_TYPE_MAP[t]
        if requestInfo:
            params = { 'type': requestInfo['name'] }
            requestParams = requestInfo['params'] or REQUEST_DEFAULT_PARAMS
            for param in requestParams:
                if param == 'sid':
                    currentMusic = self.musics[0]
                    if currentMusic:
                        params[param] = currentMusic.sid
                    else:
                        raise Exception('There is no music in list.')
                elif param == 'channel':
                    if self.channel:
                        params[param] = self.channel
                    else:
                        raise Exception('No channel selected.')
                elif param == 'h':
                    params[param] = self.buildHistoryParam()
                else:
                    raise Exception('Invalid request param.')

            # return the encoded params
            return urllib.urlencode(params)

        else:
            raise Exception('Unkownen type request.')

    def buildHistoryParam(self):
        result = ''
        if len(self.recents) > 0:
            for music in self.recents:
                if music.sid and music.flag:
                    result += '|{0}:{1}'.format(music.sid, music.flag)

        return result

    def updateRecent(self, music):
        if not music in self.recents:
            self.recents.append(music)
            # Store the most recent item
            self.recents = self.recents[-MAX_RECENT_NUM:]

    def onListGot(self, result):
        data = json.loads(result['data'])
        defer = self.defers['updateList']

        if data['r'] == 0:
            songs = data['song']
            for song in songs:
                self.musics.append(Music(song))

            # callback
            defer.callback(songs)
        else:
            # errback
            defer.errback(Exception('List data got an error: %s' % data['err']))

    def onListLost(self, error):
        self.updateListDefer.errback(error)

    def updateList(self, channelId, cookie=None):
        # store current channelId
        self.channel = channelId

        # setup defer
        if not 'updateList' in self.defers:
            self.defers['updateList'] = defer.Deferred()

        if len(self.musics) > 0 and self.isPlaying:
            currentMusic = self.musics[0]
            # Switch playlist when palying music, flag the current music to "skip"
            currentMusic.action('skip')
            self.updateRecent(currentMusic)
            #TODO
        else:
            try:
                requestParams = self.buildParam('init')
            except Exception as error:
                self.updateListDefer.errback(error)

            requestUrl = API_MUSIC_LIST + requestParams

        client = Request(self._reactor, requestUrl)
        if cookie:
            client.updateHeader({
                'Cookie': [ cookie ]
            })
        client.addCallbacks(self.onListGot, self.onListLost)
        client.start()

    def addUpdateListCallbacks(self, success=None, failure=None, both=False):
        if 'updateList' in self.defers:
            defer = self.defers['updateList']

            if not both:
                if isinstance(success, types.FunctionType):
                    defer.addCallback(success)

                if isinstance(failure, types.FunctionType):
                    defer.addErrback(failure)

            else:
                if isinstance(success, types.FunctionType):
                    defer.addBoth(success)
