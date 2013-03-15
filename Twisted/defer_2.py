#!/usr/bin/python

import sys
from twisted.internet import defer, reactor

class Getter:

    def gotResults(self, x):
        if x % 2 == 0:
            self.d.callback(x * 3)
        else:
            #pass
            self.d.errback(ValueError("You need an odd number!"))

    def _toHTML(self, r):
        #return "Result: %s" % r
        return r

    def getDummyData(self, n):
        self.d = defer.Deferred()
        reactor.callLater(2, self.gotResults, n)
        self.d.addCallback(self._toHTML)
        return self.d

def printData(d):
    print "First callback %s" % d
    if d / 3 == 10:
        raise ValueError("The number can not be TEN!")
    return d

def printDataEx(d):
    print "Second callback %s" % d

def printError(err):
    sys.stderr.write(str(err))
    return err
    #print "First errback"

# g = Getter()
# d = g.getDummyData(5)
# d.addCallback(printData)
# d.addCallback(printDataEx)
# d.addErrback(printError)

g = Getter()
d = g.getDummyData(10)
d.addCallback(printData)
d.addCallback(printDataEx)
d.addErrback(printError)

reactor.callLater(4, reactor.stop)
reactor.run()