#!/usr/bin/python

import re

js = open('test.js', 'r')
newJs = open('test_modified.js', 'w')
code = js.read()

match = re.match(r'var\s+dict\s+=\s+\[(.+)\];', code)
elements = match.group(1)
elements = re.split(r',', elements)
elements = map(lambda ele: ele.strip(), elements)

def arrayReplace(matchObj):
    if matchObj and matchObj.group(1).isdigit():
        index = int(matchObj.group(1))
        return elements[index]

newCode = re.sub(r'dict\[(\d+)\]', arrayReplace, code)

newJs.write(newCode)

js.close()
newJs.close()
