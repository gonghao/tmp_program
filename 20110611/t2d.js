var fs = require('fs');

var templateFilePath = 'id_25.html';

var templateData = fs.readFileSync(templateFilePath, 'utf-8');

var globalVariableMap = {
    'RSS': '$rss', // {RSS} -> {$rss}
    'Title': '$title',
    'Permalink': '$post_url'
};

var blockIdentifierMap = {
    'Posts': 'loop:posts',
    'Text': 'text',
    'Photo': 'photos',
    'Audio': 'audio',
    'Video': 'video',
    'Link': 'link',
    'Description': '$desc',
    'HighRes': '',
    'Date': '',
    'RebloggedFrom': 'reblog',
    'NoteCount': 'notes',
    'HasTags': 'tags',
    'Tags': 'loop:tags',
    'Pagination': 'pagination',
    'PreviousPage': 'page_prev',
    'NextPage': 'page_next',
    'PermalinkPage': 'view_post'
};

var blockVariableMap = {
    'Description': {
        'Description': '$desc',
        'MetaDescription': '$meta_desc'
    },
    'PostTitle': '$title',
    'Posts': {
        'Text': {
            'Title': '$text_title',
            'Body': '$text_content'
        },
        'Photo': {
            'Caption': '$photos_title',
            'PhotoAlt': '$photo_desc|nohtml'
            'LinkURL': '$post_url',
            'PhotoURL-500': '$photo_500',
            'HighRes': {
                'PhotoURL-HighRes': '$photo_1280'
            }
        },
        'Link': {
            'URL': '$link_url',
            'Name': '$link_title',
            'Description': '$link_desc'
        },
        'Audio': {
            'Caption': '$audio_desc',
            'AudioPlayer': '$audio_player',
            'AudioPlayerWhite': '$audio_player',
            'AudioPlayerGrey': '$audio_player',
            'AudioPlayerBlack': '$audio_player',
            'AlbumArt': {
                'AlbumArtURL': '$audio_cover'
            },
            'Artist': '$audio_artist',
            'Album': '$audio_album',
            'TrackName': '$audio_song'
        },
        'Video': {
            'Caption': '$video_desc',
            'Video-500': '$video_player',
            'Video-400': '$video_player',
            'Video-250': '$video_player'
        },
        'Date': {
            'DayOfMonth': '$post_date|date_format:"day_of_month"',
            'DayOfMonthWithZero': '$post_date|date_format:"day_of_month_with_zero"',
            'DayOfMonthSuffix': '$post_date|date_format:"day_of_month_suffix_en"',
            'DayOfWeek': '$post_date|date_format:"day_of_week"',
            'ShortDayOfWeek': '$post_date|date_format:"short_day_of_week_en"',
            'Month': '$post_date|date_format:"month"',
            'ShortMonth': '$post_date|date_format:"short_month_en"',
            'MonthNumber': '$post_date|date_format:"month_number"',
            'MonthNumberWithZero': '$post_date|date_format:"month_number_zero"',
            'Year': '$post_date|date_format:"year"',
            'ShortYear': '$post_date|date_format:"short_year"',
            'AmPm': '$post_date|date_format:"am_pm"',
            'CapitalAmPm': '$post_date|date_format:"am_pm"',
            '12Hour': '$post_date|date_format:"12_hour"',
            '12HourWithZero': '$post_date|date_format:"12_hour_with_zero"',
            '24Hour': '$post_date|date_format:"24_hour"',
            '24HourWithZero': '$post_date|date_format:"24_hour_with_zero"',
            'Minutes': '$post_date|date_format:"minutes"',
            'Seconds': '$post_date|date_format:"seconds"',
            'Timestamp': '$post_date|date_format:"timestamp"'
        },
        'RebloggedFrom': {
            'ReblogParentName': '$reblog_blog_name',
            'ReblogParentTitle': '$reblog_blog_name',
            'ReblogParentURL': '$reblog_post_url',
            'ReblogParentPortraitURL-24': '$reblog_avatar_24',
            'ReblogParentPortraitURL-30': '$reblog_avatar_64',
            'ReblogParentPortraitURL-40': '$reblog_avatar_64',
            'ReblogParentPortraitURL-48': '$reblog_avatar_64',
            'ReblogParentPortraitURL-64': '$reblog_avatar_64',
            'ReblogParentPortraitURL-96': '$reblog_avatar_200',
            'ReblogParentPortraitURL-128': '$reblog_avatar_200'

        },
        'NoteCount': {
            'NoteCount': '$post_notes_count',
            'NoteCountWithLabel': '$post_notes_count'
        },
        'HasTags': {
            'Tags': {
                'Tag': '$tag_name',
                'URLSafeTag': '$tag_url',
                'TagURL': '$tag_url',
                'TagURLChrono': '$tag_url'
            }
        }
    },
    'Pagination': {
        'PreviousPage': '$page_prev_url',
        'NextPage': '$page_next_url'
    }
};

var BLOCK_BLACK_LIST = [
        'Quote', 'Answer', 'Chat', 'Photoset', 'TagPage', 'SearchPage', 'NoSearchResults', 'HasPages', 'AskEnabled',
        'IfDisqusShortname', 'IfGoogleAnalytics', 'PermalinkPagination', 'PostSummary', 'PostNotes', 'ContentSource',
        'Permalink'
    ];

var EXIST_ESTIMATION_BLACK_LIST = [
        'PreviousPage', 'NextPage', 'NoteCount'
    ];

// Uid builder
var guid = (function() {
    var id = 0;
    return function() {
        return id++;
    };
})();

// Block Class
function Block(name, id) {
    this.uid = id;
    this.name = name;
    this.variables = [];
    this.context = [];
    this.parentContext = null;
    this.source = '';
}

function Variable(name, id) {
    this.uid = id;
    this.name = name;
    this.context = null;
}

var REG_BLOCK = /{block:(\w+?)}[\s\S]*?{\/block:\1}/gm,
    REG_BLOCK_VARIABLE = /{([\w-]+)}/g,
    BLOCK_PREFIX = '!!DD_BLOCK!!-', VARIABLE_PREFIX = '!!DD_VARIABLE!!-',
    REG_BLOCK_PREFIX = new RegExp(BLOCK_PREFIX + '(\\d+)', 'gm'),
    REG_VARIABLE_PREFIX = new RegExp(VARIABLE_PREFIX + '(\\d+)', 'gm');

function blockParser(source, parent) {
    var ret = {}, topLevel = [];

    source = source.replace(REG_BLOCK, function(src, name) {
        var id = guid(), block, ret;

        if (BLOCK_BLACK_LIST.indexOf(name) >= 0) {
            ret = '';
        } else {
            block = blockBuilder(src, name, id, parent);

            !parent && topLevel.push(block);

            ret = BLOCK_PREFIX + id;
        }

        return ret;
    });

    ret.source = source;

    if (topLevel.length > 0) {
        ret.topLevel = topLevel;
    }

    return ret;
}

function blockBuilder(source, name, id, parent) {
    var block, keywordLength, start = '', end = '';

    if (!name) return;

    keywordLength = name.length;
    block = new Block(name, id);

    if (parent instanceof Block) {
        block.parentContext = parent;
        parent.context.push(block);
    }

    start = source.substring(0, 8 + keywordLength);
    end = source.substring(source.length - (9 + keywordLength));

    block.source = start + blockParser(source.substring(8 + keywordLength, source.length - (9 + keywordLength)), block).source + end;

    return block;
}

function variableBuilder(block) {
    var context = block.context, callee = arguments.callee;

    // recursion
    context.forEach(function(block) {
        callee(block);
    });

    var source = block.source;

    source = source.replace(REG_BLOCK_VARIABLE, function(src, name) {
        var id = guid(), variable = new Variable(name, id);

        variable.context = block;

        block.variables.push(variable);

        return VARIABLE_PREFIX + id;
    });

    block.source = source;
}

function getAllBlocks(topBlock) {
    var ret = {};

    function recursion(blocks) {
        var callee = arguments.callee;

        blocks.forEach(function(block) {
            var context;

            ret[block.uid] = block;

            if ((context = block.context) && context.length > 0) {
                callee(context);
            }
        });
    }

    recursion(topBlock);

    return ret;
}

function getAllVariables(topBlock) {
    var ret = {};

    function recursion(blocks) {
        var callee = arguments.callee;

        blocks.forEach(function(block) {
            var context;
            
            block.variables.forEach(function(variable) {
                ret[variable.uid] = variable;
            });

            if ((context = block.context) && context.length > 0) {
                callee(context);
            }
        });
    }

    recursion(topBlock);

    return ret;
}

function variableMatcher(variable) {
    var name = variable.name, parent = variable.context, scopeChain = [], parentName, currentMap;

    while (parent) {
        parentName = parent.name;
        parent = parent.parentContext;

        if (name !== parentName || (scopeChain.length === 0 && !parent)) {
            scopeChain.push(parentName);
        }

    }

    if (scopeChain.length > 1) {
        scopeChain = scopeChain.reverse();

        scopeChain.forEach(function(block) {
            currentMap = currentMap ? currentMap[block] : blockVariableMap[block];
        });
    } else {
        currentMap = blockVariableMap[scopeChain[0]];
        currentMap = 'object' === typeof currentMap ? currentMap : blockVariableMap;
    }

    return currentMap ? currentMap[name] : null;
}

function ddBuilder(template, blocks, variables) {
    var existEstimateQueue = [], existEstimateUIDQueue = [], callee = arguments.callee;

    while (template.indexOf(BLOCK_PREFIX) >= 0) {
        template = template.replace(REG_BLOCK_PREFIX, function(name, uid) {
            var block = blocks[uid], n = block.name, vs = block.variables, source = block.source, ret = source;

            vs.forEach(function(v) {
                if (v.name === n && EXIST_ESTIMATION_BLACK_LIST.indexOf(n) < 0) {
                    existEstimateQueue.push(source);
                    existEstimateUIDQueue.push(uid);
                    ret = '~tmp~' + uid;
                }
            });

            return ret;
        });
    }

    // handle for the exist estimation
    existEstimateQueue = existEstimateQueue.map(function(src) {
        var src = callee(src, blocks, variables);
        return src;
    });
    existEstimateUIDQueue.forEach(function(uid, index) {
        var b = blocks[uid], n = b.name, vs = b.variables, variable, src = existEstimateQueue[index];
        vs.forEach(function(v) {
            if (v.name === n) {
                variable = v;
            }
        });

        src = src.replace(new RegExp('(/?)block:' + n, 'gm'), function(m, a) {
            var prefix = a || '?';
            return prefix + variableMatcher(variable);
        });

        template = template.replace('~tmp~' + uid, src);
    });

    template = template.replace(REG_VARIABLE_PREFIX, function(name, uid) {
        var variable = variables[uid];
        return '{' + (variableMatcher(variable) || variable.name) + '}';
    });

    return template;
}

function blockIdentifierReplacer(template, map) {
    for (id in map) {
        template = template.replace(new RegExp('{(/?)block:' + id + '}', 'gm'), function(m, a) {
            var prefix = a || '?', r = map[id], ret;
            ret = r !== '' ? '{' + prefix + map[id] + '}' : '';
            return ret;
        });
    }

    return template;
}

var result = blockParser(templateData), topLevel, allBlocks, allVariables;

templateData = result.source;
topLevel = result.topLevel;

topLevel.forEach(function(block) {
    variableBuilder(block);
});

allBlocks = getAllBlocks(topLevel);
allVariables = getAllVariables(topLevel);

templateData = ddBuilder(templateData, allBlocks, allVariables);

templateData = blockIdentifierReplacer(templateData, blockIdentifierMap);

templateData = replaceVariable(templateData, globalVariableMap);

function replaceVariable(data, map) {
    var reg, key, tmp = [];

    if (!data) return;

    for (key in map) {
        if (map.hasOwnProperty(key)) {
            tmp.push(key);
        }
    }

    if (tmp.length) {
        reg = new RegExp('{' + tmp.join('}|{') + '}', 'gm');
    }

    if (reg) {
        data = data.replace(reg, function(all) {
            var key = all.substring(1, all.length - 1);
            return '{' + map[key] + '}';
        });
    }

    return data;
}

fs.writeFileSync('modified.html', templateData, encoding='utf8');

