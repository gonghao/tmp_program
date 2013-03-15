var tumblrThemeFilePath = process.argv[2],
    fs = require('fs'),
    core = require('./core.js'),
    resource = require('./resource.js'),
    templateData;

if (!tumblrThemeFilePath) {
    process.stderr.write('You must point the path of the Tumblr theme file!\n');
    return;
} else {
    console.log('Start read tumblr theme file...');
    templateData = fs.readFileSync(tumblrThemeFilePath, 'utf-8');

    templateData = core.convertTheme(templateData);

    console.log('Finally writes to file...');
    fs.writeFileSync(tumblrThemeFilePath.replace(/(\.\w+$)/, '_mod$1'), templateData, encoding='utf8');

    //resource.getStyleData(templateData);
}
