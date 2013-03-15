#!/usr/bin/python

#import Auth, twisted.internet.reactor as reactor, pickle
#from List import MusicList
from httpclient import Request

def main():

    #loginDeferred = Auth.login('gonghao@ghsky.com', 'gh820812')

    def logoutSuccess(ignored):
        print 'Logout success.'

    def logoutFailure(error):
        print error

    def loginSuccess(cookies):
        print 'Login success.'
        cookieFile = open('cookie.pkl', 'wb')
        pickle.dump(cookies, cookieFile)
        cookieFile.close()
        logoutDeferred = Auth.logout(cookies)
        logoutDeferred.addCallbacks(logoutSuccess, logoutFailure)

    def loginFailure(error):
        print error

    #loginDeferred.addCallbacks(loginSuccess, loginFailure)

    #logoutDeferred = Auth.logout(None)

    #reactor.run()

    def handler(result):
        print 'Channel: %s' % playList.channel
        #print result
        if len(playList.musics) > 0 and playList.channel != 2:
            playList.updateList(2)

    #playList = MusicList()
    #playList.updateList(1)
    #playList.addUpdateListCallbacks(handler, both=True)

    client = Request('get', 'http://node.ghsky.com?hello=world')
    client.start()
    print 'Start OK'

if __name__ == '__main__':
    main()