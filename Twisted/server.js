var express = require('express'),
    app = express.createServer();

app.use(express.bodyParser());
app.post('/', function(req, res) {
    console.log(req.headers);
    //console.log(req.body);
    //var data = JSON.stringify(req.body);
    //res.header('Content-Length', data.length);
    //res.contentType('json');
    //res.send(data);
    res.json(req.body);
});
app.get('/j/mine/playlist', function(req, res) {
    console.log(req.headers);
    var data = { r: 0, song: [ { sid: '123456' } ] };
    data = JSON.stringify(data);
    res.header('Content-Length', data.length);
    res.contentType('json');
    res.send(data);
});
app.get('/', function(req, res) {
    console.log(req.query);
    res.send('');
});

app.listen(5555);
