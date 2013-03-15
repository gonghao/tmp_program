#!/usr/bin/env python

import time
from datetime import datetime

start = time.time()

def insertionSort(array):
    l = len(array)
    for j in range(1, l):
        key = array[j]
        i = j - 1 

        while i >= 0 and array[i]['datetime'] < key['datetime']:
            array[i + 1] = array[i]
            i -= 1

        array[i + 1] = key 
        
        print '%.2f%%' % ((j + 1.0) / l * 100)

def partition(array, p, r):
    x = array[r]
    i = p - 1
    for j in range(p, r):
        if array[j]['datetime'] <= x['datetime']:
            i = i + 1
            tmp = array[i]
            array[i] = array[j]
            array[j] = tmp

    # exchange
    (array[r], array[i + 1]) = (array[i + 1], array[r])

    return i + 1

def quickSort(array, p=0, r=0):
    if r == 0:
        r = len(array) - 1

    q = partition(array, p, r)
    s = []

    if q >= p:
        if q + 1 < r:
            s.append({
                'p': q + 1,
                'r': r
            })
        if q - 1 > p:
            s.append({
                'p': p,
                'r': q - 1
            })

    while len(s) > 0:
        data = s.pop()

        q1 = partition(array, data['p'], data['r'])
        if q1 >= data['p']:
            if q1 + 1 < data['r']:
                s.append({
                    'p': q1 + 1,
                    'r': data['r']
                })
            if q1 - 1 > data['p']:
                s.append({
                    'p': data['p'],
                    'r': q1 - 1
                })


example = open('example', 'r')
result = open('result', 'w')

datas = []

for line in example:
    parts = line.split('|')
    datas.append({
        'raw': line,
        'datetime': datetime.strptime(parts[2], '%Y-%m-%d %H:%M:%S')
    })

example.close()

#insertionSort(datas)
quickSort(datas)

for data in datas:
    result.write(data['raw'])

result.close()

print 'Duration: %ss' % (time.time() - start)
