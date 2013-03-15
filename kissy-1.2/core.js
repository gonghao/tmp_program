/**
 * @fileoverview Trade Platform, Based on KISSY 1.2+.
 * @author ����<yiminghe@gmail.com>, �ĺ�<wenhe@taobao.com>
 */

(function(S, undefined) {

    var TC_EVENT_CENTER = S.mix({}, S.EventTarget),
        oldRequire = S.onRequire;

    // Comments Just for JSDoc {{{
    /**
     * @name EventCallback
     * @function
     * @param {Object} event.target �¼�����Ŀ�����.
     * @param {String} event.type �¼�����.
     */

    /**
     * @class �¼�����.
     * @name EventTarget
     */

    /**
     * �����¼�
     * @name fire
     * @function
     * @memberOf EventTarget
     * @param {String} event �¼�����.
     * @param {Object} [object] �¼�����ʱ�����Ķ���.
     */

    /**
     * �����¼�
     * @name on
     * @function
     * @memberOf EventTarget
     * @param {String} event �¼�����.
     * @param {EventCallback} function ��������.
     */

    /**
     * ȡ���¼�����
     * @name detach
     * @function
     * @memberOf EventTarget
     * @param {String} event �¼�����.
     * @param {EventCallback} function ��������.
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
     * @class ȫ���¼�����.
     * @name MIXED
     * @private
     */
    var MIXED = {};

    /**
     * ȫ�ּ���
     * @param {String} event �¼�����.
     * @param {EventCallback} function ��������.
     */
    MIXED.listen = function(evt, fn, groups) {
        TC_EVENT_CENTER.on(groupEvent(evt, groups || this.groups), fn);
    };

    /**
     * ȫ�ֹ㲥
     * @param {String} event �¼�����.
     * @param {Object} [object] �㲥ʱ���͵�����.
     */
    MIXED.broadcast = function(evt, o, groups) {
        return TC_EVENT_CENTER.fire(
            groupEvent(evt, groups || this.groups), S.mix(o, {
                target: this
            }));
    };

    /**
     * ɾ���¼�
     * @param {String} event �¼����ƣ�������ṩ������������ȫ��ɾ��.
     * @param {EventCallback} [function] ��������.
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
             * @class ģ����࣬��дKISSY require��������.
             *
             * @name ModuleBase
             * @private
             *
             * @param {Object} config ģ���ʼ����.
             *
             * @property {Object} config ģ������.
             * @property {String} moduleName ģ������.
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
            // ����Զ����Base����������
            // ��ʱʹ��1.6.0�������ռ䷽��
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
    // chrome �� console ����ת��this��������call����apply������������
    // http://code.google.com/p/chromium/issues/detail?id=48662
    // http://stackoverflow.com/questions/5133649/alias-to-chrome-console-log
    //
    // firefox ���ܸ�дconsole��ֻ������Getter��ֱ�ӳ�д���г�Ա
    //
    // ע����Щ��������ȫ����
    // ����console.profile/profileEnd��IE�ı��ָ�
    // Webkit DevTools/Firebug�ı��ֲ�һ��
    // ���Ժ�����һ��try/catch
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

            // IE9 �ڲ���������̨�µ� bind ������
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
        // firebug������css
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

    // chrome�¿���ֱ�Ӹ���console
    // firebug�²���ֱ�Ӹ��ǣ���д���г�Ա
    //if (!S.UA.ie) {
        S.each(_csl, function(fn, i) {
            origin_csl && (origin_csl[i] = fn);
        });
    //}
    global.console = _csl;

    // Ĭ�Ϲ��˵�loader�Ѿ�������ɵĶ���
    console.on('log info', function(e) {
        return !(/(loaded\.)$/.test(e.args[0]) ||
            /^(standard)/.test(e.args[0]));
    });
    // }}}

    // Trade Center {{{
    var TC = {

        /**
         * �Ƿ�������.
         */
        Debug: '@DEBUG',

        /**
         * ����ƽ̨�汾.
         * @version 4.0
         */
        Version: '4.0',

        /**
         * ����ʱ���
         * @param {String} timestamp ��ǰʱ���.
         * @param {String} cdn ��ǰ����CDN��daily or ����.
         * @param {String} tag ��ǰtag.
         * @return {KISSY} ����KISSY����ʽ����.
         */
        setTimeStamp: function(timestamp, cdn, tag) {
            if (!timestamp || S.Config.debug) {
                timestamp = '4.0';
            }

            // ����tc�汾����Ϊȫ�ֲ���
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
