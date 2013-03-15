#!/usr/bin/python

import re

REG_COOKIE = re.compile(r'(\w+)="([^"]*)"')

def fromRawCookie(rawCookies):
    cookies = {}
    for cookie in rawCookies:
        cookie = REG_COOKIE.match(cookie).groups()
        cookies[cookie[0]] = cookie[1]

    return cookies

def toRawCookie(cookies):
    result = None

    if cookies:
        raw = ['%s=%s' % (name, cookies[name]) for name in cookies]
        result = '; '.join(raw)
    
    return result

def errorHandler(error):
    print error