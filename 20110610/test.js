var dict = ["getElementById", "offsetHeight", "tips", "height", "style", "px", "174", "className", "rocker", "active", "start", "random", "ceil", "f2(", ")", "f3(", "f1(", " ", "split", "backgroundPosition", "fruit1", "center -34px", "center ", "stop", "fruit2", "fruit3", "star", "", "fail", "竟然中了3个【谢谢参与】...囧rz", "star3", "win", "Bingo! 恭喜你转到3个相同的水果图案！意外的好运随时可能从天而降哦！", "star2", "o(∩_∩)o 就差一点了，再来一次！", "star1", "o(︶︿︶)o 唉，再来一次吧！", "src", "bgsound", "getElementsByTagName", "sound/", ".mp3", "audio", ".ogg"];

function $(id) {
    return document[dict[0]](id)

};

var s = 0,
r1,
r2,
r3;
function t() {
    if ($(dict[2])[dict[1]] == 20) {
        var timer = setInterval(function() {
            if ($(dict[2])[dict[1]] < 174) {
                $(dict[2])[dict[4]][dict[3]] = parseInt($(dict[2])[dict[1]]) + 2 + dict[5]

            } else {
                if ($(dict[2])[dict[1]] = 174) {
                    clearInterval(timer)

                }

            }

        },
        1)

    } else {
        if ($(dict[2])[dict[1]] == dict[6]) {
            var timer = setInterval(function() {
                if ($(dict[2])[dict[1]] > 20) {
                    $(dict[2])[dict[4]][dict[3]] = parseInt($(dict[2])[dict[1]]) - 2 + dict[5]

                } else {
                    if ($(dict[2])[dict[1]] = 20) {
                        clearInterval(timer)

                    }

                }

            },
            1)

        }

    }

};
function g() {
    if (s == 0) {
        s = 1;
        $(dict[8])[dict[7]] = dict[9];
        p(dict[10]);
        r1 = Math[dict[12]](Math[dict[11]](10) * 10) * 80 + 8000;
        r2 = Math[dict[12]](Math[dict[11]](10) * 10) * 80 + 8000;
        r3 = Math[dict[12]](Math[dict[11]](10) * 10) * 80 + 8000;
        f1(r1);
        setTimeout(dict[13] + r2 + dict[14], 1000);
        setTimeout(dict[15] + r3 + dict[14], 2000)

    }

};
function f1(param) {
    var t = dict[16] + param + dict[14];
    if (parseInt($(dict[20])[dict[4]][dict[19]][dict[18]](dict[17])[1]) == -834) {
        $(dict[20])[dict[4]][dict[19]] = dict[21]

    };
    $(dict[20])[dict[4]][dict[19]] = dict[22] + (parseInt($(dict[20])[dict[4]][dict[19]][dict[18]](dict[17])[1]) - 10) + dict[5];
    r1 -= 10;
    if (r1 == 0) {
        p(dict[23])

    } else {
        if (r1 >= param - 320) {
            setTimeout(t, (r1 - param + 320) / 4)

        } else {
            if (r1 < param - 320 && r1 > 320) {
                setTimeout(t, 1)

            } else {
                if (r1 <= 320 && r1 > 0) {
                    setTimeout(t, (320 - r1) / 2)

                }

            }

        }

    }

};
function f2(param) {
    var t = dict[13] + param + dict[14];
    if (parseInt($(dict[24])[dict[4]][dict[19]][dict[18]](dict[17])[1]) == -834) {
        $(dict[24])[dict[4]][dict[19]] = dict[21]

    };
    $(dict[24])[dict[4]][dict[19]] = dict[22] + (parseInt($(dict[24])[dict[4]][dict[19]][dict[18]](dict[17])[1]) - 10) + dict[5];
    r2 -= 10;
    if (r2 == 0) {
        p(dict[23])

    } else {
        if (r2 >= param - 320) {
            setTimeout(t, (r2 - param + 320) / 4)

        } else {
            if (r2 < param - 320 && r2 > 320) {
                setTimeout(t, 1)

            } else {
                if (r2 <= 320 && r2 > 0) {
                    setTimeout(t, (320 - r2) / 2)

                }

            }

        }

    }

};
function f3(param) {
    var t = dict[15] + param + dict[14];
    if (parseInt($(dict[25])[dict[4]][dict[19]][dict[18]](dict[17])[1]) == -834) {
        $(dict[25])[dict[4]][dict[19]] = dict[21]

    };
    $(dict[25])[dict[4]][dict[19]] = dict[22] + (parseInt($(dict[25])[dict[4]][dict[19]][dict[18]](dict[17])[1]) - 10) + dict[5];
    r3 -= 10;
    if (r3 == 0) {
        p(dict[23]);
        setTimeout(r, 500)

    } else {
        if (r3 >= param - 320) {
            setTimeout(t, (r3 - param + 320) / 4)

        } else {
            if (r3 < param - 320 && r3 > 320) {
                setTimeout(t, 1)

            } else {
                if (r3 <= 320 && r3 > 0) {
                    setTimeout(t, (320 - r3) / 2)

                }

            }

        }

    }

};
function r() {
    var f1 = parseInt($(dict[20])[dict[4]][dict[19]][dict[18]](dict[17])[1]);
    var f2 = parseInt($(dict[24])[dict[4]][dict[19]][dict[18]](dict[17])[1]);
    var f3 = parseInt($(dict[25])[dict[4]][dict[19]][dict[18]](dict[17])[1]);
    if (f1 == f2 && f2 == f3) {
        if (f1 == -754) {
            $(dict[26])[dict[7]] = dict[27];
            p(dict[28]);
            alert(dict[29])

        } else {
            $(dict[26])[dict[7]] = dict[30];
            p(dict[31]);
            alert(dict[32])

        }

    } else {
        if (f1 == f2 || f2 == f3 || f1 == f3) {
            $(dict[26])[dict[7]] = dict[33];
            p(dict[28]);
            alert(dict[34])

        } else {
            $(dict[26])[dict[7]] = dict[35];
            p(dict[28]);
            alert(dict[36])

        }

    };
    s = 0;
    $(dict[8])[dict[7]] = dict[27]

};
function p(param) {
    document[dict[39]](dict[38])[0][dict[37]] = dict[40] + param + dict[41];
    document[dict[39]](dict[42])[0][dict[37]] = dict[40] + param + dict[43]

}

