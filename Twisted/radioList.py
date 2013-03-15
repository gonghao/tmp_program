#!/usr/bin/python

from httpClient import RequestURL
import json, pickle, urllib

client = RequestURL('get', 'http://douban.fm/j/mine/playlist?type=n&channel=0')
#client = RequestURL('get', 'http://node.ghsky.com')
cookieFile = open('cookie.pkl', 'rb')
cookies = pickle.load(cookieFile) or ''
cookieFile.close()

def rawCookieFormater(cookies):
    raw = ['%s=%s' % (name, cookies[name]) for name in cookies]
    return '; '.join(raw)

rawCookies = rawCookieFormater(cookies)

client.updateHeader({
    'Accept': ['application/json, text/javascript, */*; q=0.01'],
    'Cookie': [rawCookies or '']
})

def requestOK(result):
    print json.loads(result['data'])

client.defer.addCallback(requestOK)

client.startRequest()