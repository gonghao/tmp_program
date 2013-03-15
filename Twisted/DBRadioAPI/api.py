#!/usr/bin/env python

import json, util, auth
from twisted.internet import reactor, defer
from twisted.internet.protocol import Protocol, Factory
from httpclient import Request

class Server(Protocol):

    def dataReceived(self, data):
        try:
            data = json.loads(data)

            if 'action' in data:
                action = data['action']

                params = None
                if 'params' in data:
                    params = data['params']

                self.request(action, params)

            else:
                self.flushResult(-1, 'Invaild parameters: lacking of "action" parameter.')

        except Exception as error:
            self.flushResult(-1, '%s found in %s' % ('Invaild json string', data))

    def request(self, action, params=None):
        if hasattr(ACTION_TOKEN, action):
            try:
                d = getattr(ACTION_TOKEN, action)(params)
                d.addCallback(self.responseSucceed)
                d.addErrback(self.responseFailed)

            except Exception as error:
                self.flushResult(-1, 'Internal error: %s' % str(error))
        else:
            self.flushResult(-1, 'Invaild parameters: "action" parameter is invaild.')

    def responseSucceed(self, cookies):
        self.flushResult(0, cookies)

    def responseFailed(self, error):
        self.flushResult(-1, error.getErrorMessage())

    def flushResult(self, err, result):
        output = {
            'err': err,
            'result': result
        }

        self.transport.write('%s\n' % json.dumps(output))

class ACTION_TOKEN(object):

    @staticmethod
    def login(params):
        if 'username' in params and 'password' in params:
            return auth.login(reactor, params['username'], params['password'])
        else:
            raise Exception('Invaild parameters for login.')

    @staticmethod
    def getList(params):
        '''
        Get the playlist of one channel
        @param chennel: the channel id of playlist
        @param cookie[opt]: if the channel_id == 0, then you should provide the user cookie to get the playlist
        @return Deferred object
        '''
        pass

def startServer(port=9559):
    '''
    Start API server
    @param port: The port which is listening for the request
    @return void
    '''
    try: 
        factory = Factory()
        factory.protocol = Server

        reactor.listenTCP(port, factory)

        reactor.run()

        return 0

    except Exception as error:
        util.errorHandler(error)
        return -1


def stopServer():
    '''
    Stop API server
    @return void
    '''
    try:
        reactor.stop()
        return 0

    except Exception as error:
        util.errorHandler(error)
        return -1

if __name__ == '__main__':
    startServer()
