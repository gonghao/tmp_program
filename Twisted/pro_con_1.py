#!/usr/bin/python

import random

from zope.interface import implements
from twisted.internet import reactor, interfaces
from twisted.internet.protocol import Factory
from twisted.protocols.basic import LineReceiver

class Producer(object):
    implements(interfaces.IPushProducer)

    _proto = None
    _goal = 0
    _produced = 0
    _paused = False

    def __init__(self, proto, cnt):
        self._proto = proto
        self._goal = cnt

    def pauseProducing(self):
        self._paused = True
        print 'Pausuing connection from %s' % self._proto.transport.getPeer()

    def resumeProducing(self):
        self._paused = False
        while not self._paused and self._produced < self._goal:
            next_int = random.randint(0, 10000)
            self._proto.transport.write('%d\n' % next_int)
            self._produced += 1
        if self._produced == self._goal:
            self._proto.transport.unregisterProducer()
            self._proto.transport.loseConnection()

    def stopProducing(self):
        pass

class ServerRandom(LineReceiver):
    def connectionMade(self):
        print 'Connection made from %s' % self.transport.getPeer()
        self.transport.write('How many random integers do you want?\n')

    def lineReceived(self, line):
        cnt = int(line.strip())
        producer = Producer(self, cnt)
        self.transport.registerProducer(producer, True)
        producer.resumeProducing()

    def connectionLost(self, reason):
        print 'Connection lost from %s because of %s' % (self.transport.getPeer(), str(reason))

factory = Factory()
factory.protocol = ServerRandom
reactor.listenTCP(1234, factory)
print 'Listening on 1234...'
reactor.run()
