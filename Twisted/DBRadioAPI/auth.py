#!/usr/bin/env python

import util
from httpclient import Request
from twisted.internet import defer

URL_LOGIN = 'https://www.douban.com/accounts/login'
URL_LOGOUT = 'http://www.douban.com/accounts/logout?source=radio'

def login(reactor, email, password):
    if not reactor:
        raise Exception('Reactor is required.')

    client = Request(reactor, URL_LOGIN, 'post')
    client.updateBody({
        'form_email': email,
        'form_password': password,
        'source': 'radio'
    })

    d = defer.Deferred()
        
    def loginResponseOK(result):
        headers = result['response'].headers
        cookies = util.fromRawCookie(headers.getRawHeaders('Set-Cookie'))
        if 'ue' in cookies and 'dbcl2' in cookies:
            d.callback(cookies)
        else:
            d.errback(Exception('login failed.'))

    client.addCallbacks(loginResponseOK)
    client.start()

    return d

def logout(reactor, cookies):
    if not reactor:
        raise Exception('Reactor is required.')

    cookies = util.toRawCookie(cookies)

    if cookies:
        client = RequestURL(reactor, URL_LOGOUT)
        client.updateHeader({
            'Cookie': [cookies]
        })

        d = defer.Deferred()

        def logoutResponseOK(result):
            response = result['response']
            if response.code >= 200 and response.code < 400:
                d.callback(None)
            else:
                d.errback(Exception('logout failed.'))

        client.defer.addCallback(logoutResponseOK)

        client.startRequest()

    else:
        d = defer.fail(Exception('no cookie found.'))

    return d
