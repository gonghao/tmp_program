new Async(obj)
    .wait(objOne, type, function() {})
    .wait(objTwo, type, function() {})
    .wait(type, function() {});

function Async(obj) {
    this.callbacks = [];
    this.__previous = obj;
}

Async.prototype.__callback = function() {
    var fn = this.callbacks[0];

    while (fn && true === fn.__ready) {
        fn();
        this.callbacks.shift();
    }
};

Async.prototype.wait = function(obj, type, fn) {
    var that = this;

    if ('string' === typeof obj) {
        fn = type;
        type = obj;
        obj = this.__previous;
    }

    fn.__ready = false;
    this.callbacks.push(fn);

    obj.on(type, function() {
        fn.__ready = true;
        that.__callback();
    });
};
