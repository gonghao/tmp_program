var exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    child, hg, img, express = require('express');

hg = spawn('hg', ['cat', '-r3233', '/data/diandian-static-dss/staticEx/src/img/app/reblog-tip.png'], {
    cwd: '/data/diandian-static-dss/staticEx'
});

//hg.stdout.setEncoding('ascii');
hg.stdout.on('data', function(data) {
    img = data;
});

hg.stderr.setEncoding('utf-8');
hg.stderr.on('data', function(data) {
    console.log(data);
});

var app = express.createServer();

app.get('/', function(req, res){
    res.contentType('image/png');
    res.send(img);
});

app.listen(3000);
