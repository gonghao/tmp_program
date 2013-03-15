fs = require('fs');

json_string = fs.readFileSync('test_json.json', 'utf-8');

JSON.parse(json_string);

