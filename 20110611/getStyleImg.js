var http = require('http'), url = require('url'), fs = require('fs');

var stylePath = process.argv[2];

var styleData = fs.readFileSync(stylePath, 'utf-8');

var REG_IMAGE_SRC_GLOBAL = /url\(\s*"?(.+?)"?\s*\)/gm, REG_IMAGE_SRC = /url\(\s*"?(.+?)"?\s*\)/;

if (!fs.statSync('./img').isDirectory()) {
    fs.mkdirSync('./img', '0777');
}
var allImages = styleData.match(REG_IMAGE_SRC_GLOBAL), allSources = [], allSourcesCount = 0, current = 0;

allImages = allImages.map(function(img) {
    return img.match(REG_IMAGE_SRC)[1];
});

allImages.forEach(function(img) {
    if (allSources.indexOf(img) < 0) {
        allSources.push(img);
    }
});

allSourcesCount = allSources.length;

console.log('Process Start...');
allSources.forEach(function(src) {
    getImage(src);
});

function getImage(src) {
    src = url.parse(src);

    var pathName = src.pathname, lastSlashPos = pathName.lastIndexOf('/'), fileName = pathName.substring(lastSlashPos + 1),
        file = fs.openSync('./img/' + fileName, 'w');

    http.get({
        host: src.hostname,
        port: src.port || '80',
        path: pathName
    }, function(res) {
        res.on('data', function(chunk) {
            console.log('Finished: ' + ++current + ' Of ' + allSourcesCount);
            fs.writeSync(file, chunk, 0, chunk.length, 0);
        });
    }).on('error', function(e) {
        console.log('Got error: ' + e.message);
    });
}
