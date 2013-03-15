var http = require('http'), url = require('url'), fs = require('fs'),

    REG_IMAGE_SRC_GLOBAL = /url\(\s*"?(.+?)"?\s*\)/gm, REG_IMAGE_SRC = /url\(\s*"?(.+?)"?\s*\)/,
    REG_HTML_LINK = /<link[\s\S]+?\/*>/gm, REG_LINK_HREF = /href="([^"]+?)"/im, REG_LINK_REL = /rel="([^"]+?)"/im,
    REG_STYLESHEET = /\bstylesheet\b/i, REG_CSS_POSTFIX = /\.css\b/i;

function getSource(src, dest, callback) {
    src = url.parse(src);

    var pathName = src.pathname, lastSlashPos = pathName.lastIndexOf('/'),
        fileName = pathName.substring(lastSlashPos + 1),
        file = fs.openSync(dest + ('/' === dest.substr(-1) ? '' : '/') + fileName, 'w'),
        callee = arguments.callee;

    if (undefined === callee.total) {
        callee.total = 0;
    }
    callee.total++;

    if (undefined === callee.counter) {
        callee.counter = 0;
    }

    console.log('get src');
    http.get({
        host: src.hostname,
        port: src.port || '80',
        path: pathName
    }, function(res) {
        res.on('data', function(chunk) {
            //console.log('Finised ' + ++callee.counter + ' Of ' + callee.total);
            //fs.writeSync(file, chunk, 0, chunk.length, 0);
            console.log('on data');
            
            callback && callback(file);
        });
    }).on('error', function(e) {
        console.log('Error: ' + e.message);
    });
}

function getStyleLinkFromHtml(html) {
    var links = html.match(REG_HTML_LINK), styleLinks = [];

    links.forEach(function(link) {
        var href = link.match(REG_LINK_HREF)[1], rel = link.match(REG_LINK_REL)[1];
        
        if (REG_STYLESHEET.test(rel) && REG_CSS_POSTFIX.test(href)) {
            //styleLinks.push(href);
            getSource(href, './', function(data) {
                console.log(data);
            });
        }
    });
}

exports.getStyleData = function(html) {
    getStyleLinkFromHtml(html);
};

exports.getImgsFromStyle = function(style, destPath) {
    if ('[object Array]' === Object.prototype.toString(style)) {
        style.forEach(function(style) {
            return arguments.callee(style, destPath);
        });
    }

    var allImages = style.match(REG_IMAGE_SRC_GLOBAL), allSources = [], allSourcesCount = 0, current = 0;

    allImages = allImages.map(function(img) {
        return img.match(REG_IMAGE_SRC)[1];
    });

    allImages.forEach(function(img) {
        if (allSources.indexOf(img) < 0) {
            allSources.push(img);
        }
    });

    allSourcesCount = allSources.length;

    console.log('Start get images...');
    allSources.forEach(function(src) {
        getSource(src, destPath);
    });

};
