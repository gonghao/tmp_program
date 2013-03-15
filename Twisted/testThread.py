#!/usr/bin/env python

import thread, time, threading

def timer(no, interval):
    while True:
        print 'Thread(%d) Time: %s' % (no, time.ctime())
        time.sleep(interval)

def test1():
    thread.start_new_thread(timer, (1, 2))
    thread.start_new_thread(timer, (2, 3))
    time.sleep(10)

class Timer(threading.Thread):
    def __init__(self, no, interval):
        threading.Thread.__init__(self)
        self.no = no
        self.interval = interval

    def run(self):
        while True:
            print 'Thread(%d) Time: %s' % (self.no, time.ctime())
            time.sleep(self.interval)

def test2():
    threadOne = Timer(1, 2)
    threadTwo = Timer(2, 3)

    threadOne.start()
    threadTwo.start()

if __name__ == '__main__':
    test2()
