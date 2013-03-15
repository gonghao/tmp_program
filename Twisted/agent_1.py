#!/usr/bin/python

from zope.interface import implements

from twisted.internet import reactor, defer
from twisted.internet.protocol import Protocol
from twisted.internet.ssl import ClientContextFactory
from twisted.web.client import Agent
from twisted.web.http_headers import Headers
from twisted.web.iweb import IBodyProducer

class WebClientContextFactory(ClientContextFactory):
    def getContext(self, hostname, port):
        return ClientContextFactory.getContext(self)

class BodyProducer(object):
    implements(IBodyProducer)

    def __init__(self, body):
        self.body = body
        self.length = len(body)

    def startProducing(self, consumer):
        consumer.write(self.body)
        return defer.succeed(None)
    
    def pauseProducing(self):
        pass

    def stopProducing(self):
        pass

class BodyConsumer(Protocol):
    def __init__(self, finished):
        self.finished = finished
        self.remaining = 1024 * 10

    def dataReceived(self, data):
        if self.remaining:
            display = data[:self.remaining]
            print display
            self.remaining -= len(display)

    def connectionLost(self, reason):
        #print 'Connection lost because of %s' % reason.getErrorMessage()
        return self.finished.callback(None)

context = WebClientContextFactory()
agent = Agent(reactor, context)
body = BodyProducer('form_email=gonghao@ghsky.com&form_password=gh820812&source=radio')
header = Headers({
    'User-Agent': ['Douban FM API by ghSky.com'],
    'Accept': ['text/html, */*; q=0.01'],
    'Content-Type': ['application/x-www-form-urlencoded; charset=utf-8']
})

d = agent.request(
    'POST',
    'https://www.douban.com/accounts/login',
    #'http://www.douban.com/j/app/login',
    #'http://js.ghsky.com',
    header, body)

def cbResponse(response):
    if response.code >= 200 and response.code < 400:
        cookies = response.headers.getRawHeaders('Set-Cookie')
        finished = defer.Deferred()
        response.deliverBody(BodyConsumer(finished))
        return finished
d.addCallback(cbResponse)

def cbError(error):
    print error
d.addErrback(cbError)

def cbShutdown(ignored):
    #print 'Agent shutdown!'
    reactor.stop()
d.addBoth(cbShutdown)

reactor.run()