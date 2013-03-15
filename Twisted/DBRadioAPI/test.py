#!/usr/bin/python

import auth, pickle, twisted.internet.reactor as reactor

f = open('cookie.pkl', 'rb')
c = pickle.load(f)
f.close()

def succ(ignored):
    print 'success'

def fail(error):
    print error

d = Auth.logout(c)
d.addCallbacks(succ, fail)

reactor.run()
