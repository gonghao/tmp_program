/**
 * @fileoverview Trade Platform, Based on KISSY 1.2+.
 * @author 承玉<yiminghe@gmail.com>, 文河<wenhe@taobao.com>
 */

(function(S, undefined) {

    var TC_EVENT_CENTER = S.mix({}, S.EventTarget),
        oldRequire = S.onRequire;

    // Comments Just for JSDoc {{{
    /**
     * @name EventCallback
     * @function
     * @param {Object} event.target 事件触发目标对象.
     * @param {String} event.type 事件类型.
     */

    /**
     * @class 事件对象.
     * @name EventTarget
     */

    /**
     * 触发事件
     * @name fire
     * @function
     * @memberOf EventTarget
     * @param {String} event 事件名称.
     * @param {Object} [object] 事件触发时传出的对象.
     */

    /**
     * 监听事件
     * @name on
     * @function
     * @memberOf EventTarget
     * @param {String} event 事件名称.
     * @param {EventCallback} function 监听方法.
     */

    /**
     * 取消事件监听
     * @name detach
     * @function
     * @memberOf EventTarget
     * @param {String} event 事件名称.
     * @param {EventCallback} function 监听方法.
     */

    /**
     * KISSY Selector
     * @name Selector
     * @type {String}
     */
    // }}}

    // KISSY seed overwrite for module factory {{{
    var groupEvent = function(events, groups) {
        if (!events) return;

        var evts = [];
        events = events.split(/\s+/);

        S.each(events, function(e) {
            S.each(groups, function(g) {
                evts.push(g + ':' + e);
            });
        });
        return evts.join(' ');
    };

    /**
     * @class 全局事件中心.
     * @name MIXED
     * @private
     */
    var MIXED = {};

    /**
     * 全局监听
     * @param {String} event 事件名称.
     * @param {EventCallback} function 监听方法.
     */
    MIXED.listen = function(evt, fn, groups) {
        TC_EVENT_CENTER.on(groupEvent(evt, groups || this.groups), fn);
    };

    /**
     * 全局广播
     * @param {String} event 事件名称.
     * @param {Object} [object] 广播时推送的数据.
     */
    MIXED.broadcast = function(evt, o, groups) {
        return TC_EVENT_CENTER.fire(
            groupEvent(evt, groups || this.groups), S.mix(o, {
                target: this
            }));
    };

    /**
     * 删除事件
     * @param {String} event 事件名称，如果不提供方法参数，则全部删除.
     * @param {EventCallback} [function] 监听方法.
     */
    MIXED.removeListener = function(evt, fn, groups) {
        TC_EVENT_CENTER.detach(groupEvent(evt, groups), fn);
    };

    var ALERT_ED = false;

    S.onRequire = function(mod) {
        if (!mod) return;

        var moduleName = mod.name;
        var value = oldRequire && oldRequire(mod);
        if (value === undefined) value = mod.value;
        if (moduleName.match(/^tc\/(mods|cart)/) &&
                value && !S.isFunction(value)) {

            /**
             * @class 模块基类，重写KISSY require工厂方法.
             *
             * @name ModuleBase
             * @private
             *
             * @param {Object} config 模块初始配置.
             *
             * @property {Object} config 模块配置.
             * @property {String} moduleName 模块名称.
             *
             * @borrows MIXED.listen as #listen
             * @borrows MIXED.broadcast as #broadcast
             * @borrows MIXED.removeListener as #removeListener
             *
             * @borrows EventTarget.on as #on
             * @borrows EventTarget.fire as #fire
             * @borrows EventTarget.detach as #detach
             */
            var m = function(cfg) {

                this.config = S.merge(this.config, cfg);
                this.moduleName = moduleName;
                this.groups = this.config.groups || ['global'];

                this._init && this._init();

                // add monitor init script for all carts
                if (moduleName.match(/^tc\/cart/)) {
                    KISSY.use('tc/core/monitor', function(S, Monitor) {
                        Monitor.init({
                            api: 'http://www.atpanel.com/tpfe_perf.gif',
                            pageId: moduleName.replace(/^tc\/cart\//, '')
                        });
                    });
                }
            };

            // FIXME
            // 如何自动解决Base的依赖问题
            // 暂时使用1.6.0的命名空间方案
            if (moduleName.match(/^tc\/mods/))
                S.extend(m, S.Base);

            S.augment(m, S.EventTarget, MIXED, value);

            mod.value = m;
        }
        return mod.value;
    };
    // }}}


    // overwrite global console {{{
    //
    // chrome 的 console 不能转移this，即不能call或者apply到其他分组上
    // http://code.google.com/p/chromium/issues/detail?id=48662
    // http://stackoverflow.com/questions/5133649/alias-to-chrome-console-log
    //
    // firefox 不能覆写console，只定义了Getter，直接抄写所有成员
    //
    // 注意有些方法不完全兼容
    // 比如console.profile/profileEnd在IE的表现跟
    // Webkit DevTools/Firebug的表现不一致
    // 所以后续有一次try/catch
    //
    // http://twitter.com/yyfrankyy/status/65769142648717312
    var _cslCache = [],
        global = this,
        origin_csl = global.console || {},
        global_csl = {},
        bind = Function.prototype.bind,
        _csl = {};

    if ((S.UA.ie && S.UA.ie < 8)) {
        global.console = {};
    }

    // copy all console function into a new object
    S.each(origin_csl, function(method, i) {
        var log = [i, method];
        _cslCache.push(log);
        global_csl[log[0]] = log[1];
    });

    // reset for all console methods;
    S.each(['assert', 'count', 'debug', 'dir', 'dirxml', 'error',
        'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'memory', 'profile', 'profileEnd',
        'profiles', 'time', 'timeEnd', 'trace', 'warn'], function(method) {

        // just pass for console.log
        if (S.UA.ie && S.UA.ie < 8) {
            _csl[method] = !S.isEmptyObject(origin_csl) ?
                origin_csl.log : function() {/* ignore */};
            return;
        }

        _csl[method] = function() {
            var args = [].slice.call(arguments),
                trace = '',
                prefix = '';

            // IE9 在不开启控制台下的 bind 有问题
            if (!(global.console && TC.Debug) || (S.UA.ie && S.UA.ie === 9) || !bind) return args[0];

            if (!(method in global_csl)) {
                prefix = '[' + method.toUpperCase() + '] ';
                method = 'log';
                args[0] = prefix + args[0];
            }

            if ('fire' in this &&
                this.fire(method, {args: args}) === false) {
                return args[0];
            }

            // IE F12, wierd console.profile
            try {
                return bind.call(
                    global_csl[method],
                    origin_csl
                ).apply(origin_csl, args);
            } catch (e) {}
        };
    });

    S.mix(_csl, S.EventTarget);
    S.mix(_csl, {
        // firebug可以用css
        decorate: function(args, key, style) {
            if (S.UA.firefox) {
                if (!(new RegExp('\\[' + key + '\\]').test(args[0])))
                    return false;
                var lc = '%c' + args.shift();
                args.unshift(lc, style);
                return true;
            }
        }
    });

    // chrome下可以直接覆盖console
    // firebug下不能直接覆盖，抄写所有成员
    //if (!S.UA.ie) {
        S.each(_csl, function(fn, i) {
            origin_csl && (origin_csl[i] = fn);
        });
    //}
    global.console = _csl;

    // 默认过滤掉loader已经加载完成的东西
    console.on('log info', function(e) {
        return !(/(loaded\.)$/.test(e.args[0]) ||
            /^(standard)/.test(e.args[0]));
    });
    // }}}

    // Trade Center {{{
    var TC = {

        /**
         * 是否开启调试.
         */
        Debug: '@DEBUG',

        /**
         * 交易平台版本.
         * @version 4.0
         */
        Version: '4.0',

        /**
         * 配置时间戳
         * @param {String} timestamp 当前时间戳.
         * @param {String} cdn 当前所在CDN，daily or 线上.
         * @param {String} tag 当前tag.
         * @return {KISSY} 返回KISSY做链式调用.
         */
        setTimeStamp: function(timestamp, cdn, tag) {
            if (!timestamp || S.Config.debug) {
                timestamp = '4.0';
            }

            // 存入tc版本，作为全局并存
            TC.Version = timestamp;

            var isDaily = document.domain.indexOf('daily.') > -1;
            cdn = cdn || (isDaily ?
                    'http://assets.daily.taobao.net' : 'http://a.tbcdn.cn');
            S.config({packages: [{
                name: 'tc',
                path: cdn + '/apps/tradeface/' + timestamp + '/',
                tag: tag || timestamp,
                //path: '../',
                charset: 'gbk'
            }]});
            return S;
        }
    };

    S.TC = TC;
    S.mix(S.TC, MIXED);
    // }}}

})(KISSY);
