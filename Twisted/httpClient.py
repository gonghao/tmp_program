#!/usr/bin/python

from urlparse import urlparse
import urllib
from zope.interface import implements

from twisted.internet import reactor, defer
from twisted.internet.protocol import Protocol
from twisted.internet.ssl import ClientContextFactory
from twisted.web.client import Agent, ResponseDone
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
    def __init__(self, finished, response):
        self.finished = finished
        self.response = response
        self.data = ''

    def dataReceived(self, data):
        self.data += data

    def connectionLost(self, reason):
        # shutdown reactor
        reactor.stop()

        return self.finished.callback({
            'data': self.data,
            'reason': reason
        })

class RequestURL(object):
    def __init__(self, method, url):
        _url = urlparse(url, 'http')
        self.isHttps = _url.scheme == 'https'
        self.header = {
            'User-Agent': ['Douban FM API by ghSky.com'],
            'Accept': ['*/*; q=0.01'],
            'Content-Type': ['application/x-www-form-urlencoded; charset=utf-8']
        }
        self.method = method.upper()
        self.url = url
        self.body = None

        self.defer = defer.Deferred()

    def updateHeader(self, header):
        if isinstance(header, dict):
            self.header.update(header)

    def updateBody(self, body):
        if not isinstance(body, str):
            body = urllib.urlencode(body)

        self.body = body

    def handleResponse(self, response):
        finished = defer.Deferred()
        response.deliverBody(BodyConsumer(finished, response))
        self.response = response
        finished.addCallback(self.dispatchResponse)

    def handleError(self, error):
        reacotr.stop()
        print error

    def dispatchResponse(self, result):
        # Response Done
        if result['reason'].type == ResponseDone:
            self.defer.callback({
                'response': self.response,
                'data': result['data']
            })

    def startRequest(self):
        if self.isHttps:
            agent = Agent(reactor, WebClientContextFactory())
        else:
            agent = Agent(reactor)

        d = agent.request(self.method, self.url, self.header and Headers(self.header), self.body and BodyProducer(self.body))
        d.addCallbacks(self.handleResponse, self.handleError)

        self.agent = agent

        reactor.run()
