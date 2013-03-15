var express = require('express');
var app = express.createServer();

app.use(express.cookieParser());

app.get('/', function(req, res) {
    var origin;

    if (req.cookies) {
        console.log('cookie tastes well.');
    }
    if (origin = req.header('Origin')) {
        console.log('Request Origin: ' + origin);
        if ('http://js.ghsky.com' === origin) {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Credentials', true);
            console.log('Set Crossdomain Header Done.');
        }
    }
    res.send('Hello World~');
});

app.listen(5555);
