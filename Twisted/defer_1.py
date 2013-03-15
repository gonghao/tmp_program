#!/usr/bin/python

from twisted.internet import defer, reactor

def getDummyData(x):
    d = defer.Deferred()
    reactor.callLater(2, d.callback, x * 3)
    return d

def printData(d):
    print d

class MyClass(object):
    _inner = 'Hello'
    def printData(self, d):
        self.d = d
        print self._inner
        print self.d

obj = MyClass()
d = getDummyData(5)
d.addCallback(obj.printData)

reactor.callLater(4, reactor.stop)
reactor.run()
