#!/usr/bin/python
from twisted.internet import defer

def printResult(result):
    for (success, value) in result:
        if success:
            print 'Success: %s' % value
        else:
            print 'Failure: %s' % value.getErrorMessage()

deferred1 = defer.Deferred()
deferred2 = defer.Deferred()
deferred3 = defer.Deferred()

d1 = defer.DeferredList([deferred1, deferred2, deferred3], consumeErrors=True)

d1.addCallback(printResult)

deferred1.callback('One')
deferred2.errback(Exception('Bang!!'))
deferred3.callback('Three')
