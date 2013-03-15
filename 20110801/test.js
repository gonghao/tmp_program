var args = process.argv;
var util = require('util'), events = require('events');

function MyObject(name) {
    this.name = name;
}

util.inherits(MyObject, events.EventEmitter);

MyObject.prototype.run = function() {
    this.emit('run', { speed: '80km/h' });
};

var spawn = require('child_process').spawn,
    command = spawn(args[2], args.slice(3));

command.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
});

command.stderr.on('data', function(data) {
    console.log('stderr: ' + data);
});

command.on('exit', function(code) {
    console.log('child process return code: ' + code);
});

var dog = new MyObject('Dog');

dog.on('run', function(obj) {
    console.log(this.name + ' start running at ' + obj.speed);
});

dog.run();
