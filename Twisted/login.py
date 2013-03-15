#!/usr/bin/python

from httpClient import RequestURL
import re, pickle

REG_COOKIE = re.compile(r'(\w+)="([^"]*)"')

client = RequestURL('post', 'https://www.douban.com/accounts/login')
client.updateBody({
    'form_email': 'gonghao@ghsky.com',
    'form_password': 'gh820812',
    'source': 'radio'
})

def rawCookieParser(rawCookies):
    cookies = {}
    for cookie in rawCookies:
        cookie = REG_COOKIE.match(cookie).groups()
        cookies[cookie[0]] = cookie[1]

    return cookies

def loginResponseOK(result):
    headers = result['response'].headers
    cookies = rawCookieParser(headers.getRawHeaders('Set-Cookie'))
    if 'ue' in cookies and 'dbcl2' in cookies:
        cookieFile = open('cookie.pkl', 'wb')
        pickle.dump(cookies, cookieFile)
        cookieFile.close()

client.defer.addCallback(loginResponseOK)

client.startRequest()