/**
 combined files : 

d:\Work\code\tf_latest\assets\4.0\tc\core\monitor.js
d:\Work\code\tf_latest\assets\4.0\tc\core\rule.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\promotions\promotion.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\promotions\vir-ui.js
d:\Work\code\tf_latest\assets\4.0\tc\core\common.js
d:\Work\code\tf_latest\assets\4.0\tc\core\form.js
d:\Work\code\tf_latest\assets\4.0\tc\form\point.js
d:\Work\code\tf_latest\assets\4.0\tc\form\compareNum.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\point\point.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\point\ui.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\winPoints\showWinPoints.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\winPoints\showWinPoint-ui.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\winPoints\winPoints.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\winPoints\winPoint-ui.js
d:\Work\code\tf_latest\assets\4.0\tc\form\birth.js
d:\Work\code\tf_latest\assets\4.0\tc\form\id.js
d:\Work\code\tf_latest\assets\4.0\tc\form\notNull.js
d:\Work\code\tf_latest\assets\4.0\tc\form\18.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\authentication\logic.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\authentication\ui.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\warning-popup\ui.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\itemInfo\item.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\itemInfo\ui.js
d:\Work\code\tf_latest\assets\4.0\tc\form\number.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\quantity\quantity.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\quantity\normal-ui.js
d:\Work\code\tf_latest\assets\4.0\tc\form\mobile.js
d:\Work\code\tf_latest\assets\4.0\tc\form\length.js
d:\Work\code\tf_latest\assets\4.0\tc\form\repeat.js
d:\Work\code\tf_latest\assets\4.0\tc\form\identityCard.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\generQRCode\generQRCode.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\generQRCode\ui.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\memo\memo.js
d:\Work\code\tf_latest\assets\4.0\tc\core\widget.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\memo\ui.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\payForAnother\payForAnother.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\payForAnother\ui.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\realPay\realPay.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\realPay\ui.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\submit\submit.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\submit\ui.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\checkCode\checkCode.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\checkCode\ui.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\totalFee\totalFee.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\totalFee\ui.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\point\fullPointPay-ui.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\totalPointPay\totalPointPay.js
d:\Work\code\tf_latest\assets\4.0\tc\mods\totalPointPay\ui.js
d:\Work\code\tf_latest\assets\4.0\tc\cart\qrCodeOrder.js
**/

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/core/monitor", function(S, E, UA, undefined) {
  var re = {};
  S.mix(re, {init:function(cfg) {
    var self = this;
    S.mix(self.config, cfg);
    if(!self.config.api) {
      console.warn("[monitor]: please use your custom api.");
      return
    }
    self.timer.cancel();
    self.timer = S.later(function() {
      self.send()
    }, self.config.interval, true);
    E.on(window, "unload", function() {
      self.send(true)
    });
    self.started = true
  }, config:{pageId:"", interval:1E3, max:100}, started:false, cache:{}, __cache:{}, statCache:[], toBeSend:{}, timer:S.later(function() {
  }, 0), start:function(key) {
    if(!key) {
      return
    }
    this.__cache[key] = this.__cache[key] || [];
    this.cache[key] = this.cache[key] || [];
    this.__cache[key].push({start:new Date})
  }, end:function(key) {
    if(!(key in this.cache)) {
      return
    }
    var cur = this.__cache[key][this.__cache[key].length - 1];
    S.mix(cur, {end:new Date});
    this.cache[key].push(cur.end - cur.start);
    this.send()
  }, getBaseInfo:function() {
    this.toBeSend.pageId = this.config.pageId;
    var ua = [UA.core, UA.shell, UA[UA.shell]], ie = "ie";
    if(UA.core === "trident" && ua.shell != ie) {
      ua.push(ie, UA[ie]);
      if(document.documentMode) {
        ua.push(document.documentMode)
      }
    }
    this.toBeSend.ua = ua.join(",");
    this.toBeSend.os = this.getOSInfo();
    this.toBeSend.version = S.TC.Version
  }, getOSInfo:function() {
    var token = [["Windows NT 5.1", "WinXP"], ["Windows NT 6.0", "WinVista"], ["Windows NT 6.1", "Win7"], ["Windows NT 5.2", "Win2003"], ["Windows NT 5.0", "Win2000"], ["Macintosh", "Macintosh"], ["Windows", "WinOther"], ["Ubuntu", "Ubuntu"], ["Linux", "Linux"]], ua = navigator.userAgent;
    for(var i = 0, len = token.length;i < len;++i) {
      if(ua.indexOf(token[i][0]) != -1) {
        return token[i][1]
      }
    }
    return"Other"
  }, __send:function() {
    if(S.isEmptyObject(this.toBeSend)) {
      return
    }
    var self = this, o = [], uri = self.config.api || "";
    self.getBaseInfo();
    S.each(self.toBeSend, function(v, k) {
      o.push(k + "=" + v)
    });
    uri += (uri.indexOf("?") === -1 ? "?" : "&") + o.join("&");
    self.statCache.push(new Image);
    self.statCache[self.statCache.length - 1].src = uri;
    console.log("[monitor]: sent a monitor request:");
    console.log("[monitor]: %s", uri)
  }, send:function(now) {
    if(!this.started) {
      return
    }
    var len = 0, l = 0, counter = 0, preSend = [], self = this;
    S.each(self.cache, function(m, i) {
      len++
    });
    S.each(self.cache, function(m, i) {
      l++;
      counter += self.cache[i].length;
      preSend.push(i);
      if(now && len === l || counter > self.config.max) {
        var str = [];
        S.each(preSend, function(send) {
          if(self.cache[send].length !== 0) {
            self.toBeSend[send] = self.cache[send].join(",")
          }
          self.clear(send)
        });
        self.__send();
        self.send(now);
        return
      }
    })
  }, clear:function(key) {
    if(key) {
      delete this.cache[key]
    }else {
      this.cache = {}
    }
  }});
  console.on("log", function(e) {
    this.decorate(e.args, "monitor", "color: #0c2d75")
  });
  return re
}, {requires:["event", "ua"]});

KISSY.add("tc/core/rule", function(S, E, Base, Monitor, undefined) {
  var DONE_EVT = "done", SELF_UPDATE = "selfUpdate", PARENT_UPDATE = "parentUpdate";
  var defaultConfig = {groups:["global"], parents:[]};
  var GROUPS = {};
  var EMPTY_CALC = function() {
    return 0
  };
  var ruleBase = function(name, calc, cfg) {
    var self = this;
    var updates = [];
    var groups = [];
    self.name = S.isString(name) ? name : "";
    self.calc = calc;
    self.id = S.guid();
    self.__cache = [];
    self.__parents = {};
    cfg = S.merge(cfg, {vars:[S.merge({}, cfg && cfg.vars)]});
    S.each(cfg.groups || groups, function(group) {
      if(group) {
        groups.push(group)
      }
    });
    cfg.groups = groups.length === 0 ? defaultConfig.groups : groups;
    S.mix(self, S.merge(defaultConfig, cfg));
    for(var i = self.parents.length;i > 0;i--) {
      self.vars.unshift(0);
      self.__parents[self.parents[i]] = {}
    }
    S.each(self.groups, function(group) {
      if(group) {
        updates.push(group + "/update");
        if(GROUPS[group] === undefined) {
          GROUPS[group] = []
        }
        GROUPS[group].push(self)
      }
    });
    ruleBase.on(updates.join(" "), function(e) {
      bind.call(self, e)
    });
    self.detach(DONE_EVT).on(DONE_EVT, function(e) {
      if(self.__cache[1] !== self.result) {
        self.result = self.__cache[1];
        S.each(self.groups, function(group) {
          ruleBase.fire(group + "/update", {target:self, result:self.result})
        })
      }
      self.fire(SELF_UPDATE, {result:self.result})
    })
  };
  S.augment(ruleBase, S.EventTarget, {result:0, update:function(o, fn) {
    var self = this;
    if(S.isFunction(o)) {
      fn = o;
      o = {}
    }
    S.mix(self.vars[self.vars.length - 1], o);
    if(self.__cache[0] !== self.vars || self.__cache[1] === undefined) {
      self.__cache[1] = self.calc.apply(self, self.vars) || 0
    }
    fn && self.detach(SELF_UPDATE).on(SELF_UPDATE, function(e) {
      fn(e.result)
    });
    self.fire(DONE_EVT, o);
    return self
  }});
  var bind = function(e) {
    var self = this;
    if(S.inArray(e.target.name, self.parents)) {
      if(e.target === self) {
        return
      }
      console.log("[rule]: %s(%s) => %s. |%s|", e.target.name, e.result, self.name, e.type.replace("/update", ""));
      self.__parents[e.target.name] = self.__parents[e.target.name] || {};
      self.__parents[e.target.name][e.target.id] = e.result;
      var result = self.fire(PARENT_UPDATE, {name:e.target.name, parent:self.__parents[e.target.name]}) || e.result;
      self.vars[S.indexOf(e.target.name, self.parents)] = result;
      self.update()
    }
  };
  S.mix(ruleBase, S.EventTarget);
  ruleBase.add = function(name, calc, cfg) {
    console.log("[rule add]: %s | %s", name, cfg.groups.join(","));
    return new ruleBase(name, calc || EMPTY_CALC, cfg)
  };
  ruleBase.groups = GROUPS;
  ruleBase.sum = function(obj) {
    var r = 0;
    for(var i in obj) {
      r += obj[i]
    }
    return r
  };
  ruleBase.cache = {};
  return ruleBase
}, {requires:["event", "tc/core/monitor"]});

KISSY.add("tc/mods/promotions/promotion", function(S, Ajax, JSON, Rule, undefined) {
  var base = function(name) {
    return function(groups) {
      var self = this;
      self.groups = groups;
      self.disabled = false;
      self.rule = new Rule(name || "promotion", function(o) {
        if(self.disabled) {
          return 0
        }
        return-parseInt(o.discount, 10) / 100
      }, {vars:{discount:0}, groups:self.groups})
    }
  };
  var data = {promos:{}, orders:{}, relation:{}};
  var meta = {cross:"cross_id"};
  var blacklist = window.blacklist = [];
  var config = {};
  var deleteBlackList = function(sellerId, promo) {
    if(blacklist[sellerId] && S.inArray(promo, blacklist[sellerId])) {
      var index = S.indexOf(promo, blacklist[sellerId]);
      blacklist[sellerId].splice(index, 1)
    }
  };
  var updateOrder = function(order, selected) {
    var oid;
    if(S.isString(order)) {
      oid = order;
      order = data.orders[oid]
    }else {
      console.error("[promo]: Invalid OrderName(String): %s", order);
      return
    }
    if(!S.isObject(order)) {
      console.error("[promo]: Invalid Order Object: ", order);
      return
    }
    cleanUp();
    console.log("[promo]: Updating Order: %s", oid);
    var oldBundle = order.bundle;
    if(oldBundle) {
      S.each(oldBundle.split(";"), function(promo) {
        deleteBlackList(order.sellerId, promo)
      })
    }
    order.bundle = selected || null;
    S.each(order.bundles[oldBundle] && order.bundles[oldBundle].promos, function(p) {
      updateUnusedPromo(p)
    });
    order.couple = [];
    var oncePromo = [];
    if(order.bundles[order.bundle]) {
      S.each(order.bundles[order.bundle].promos, function(p) {
        order.couple.push(updateUsedPromo(p));
        if(data.promos[p] && data.promos[p].once && data.promos[p].unused.length === 0) {
          oncePromo.push(p)
        }
      })
    }else {
    }
    if(order.parent && oncePromo.length) {
      S.each(data.relation[order.parent], function(subOrder) {
        updateUniquePromo(data.orders[subOrder], oncePromo, selected)
      })
    }
  };
  var cleanUp = function() {
    S.each(data.promos, function(p) {
      p.unused = p.unused || [];
      p.used = p.used || []
    });
    S.each(data.orders, function(o) {
      o.couple = o.couple || [];
      o.bundles = o.bundles || {};
      if(S.isEmptyObject(o.bundles)) {
        o.bundle = null
      }
      if(!("isBundleItem" in o)) {
        o.isBundleItem = false
      }
      if(!o.cross && !o.parent) {
        o.parent = meta.cross
      }
    });
    data.orders[meta.cross] = data.orders[meta.cross] || {}
  };
  var merge = function(newData) {
    var oldData = data;
    if(newData.promos) {
      S.mix(oldData.promos, newData.promos, false)
    }
    if(newData.orders) {
      if(S.isEmptyObject(oldData.orders)) {
        S.mix(oldData.orders, newData.orders)
      }else {
        S.each(newData.orders, function(order, oid) {
          S.mix(oldData.orders[oid], order, true, ["bundles", "averageSum", "divisionCode"]);
          for(var k in oldData.orders[oid].bundles) {
            var kk = k.split(";");
            S.each(kk, function(item) {
              if(!oldData.promos[item]) {
                console.warn("delete: %s", k);
                delete oldData.orders[oid].bundles[k]
              }
            })
          }
          if(order.bundle) {
            updateOrder(oid, order.bundle)
          }
        })
      }
    }
    if(newData.relation) {
      S.mix(oldData.relation, newData.relation)
    }
    cleanUp()
  };
  var updateUsedPromo = function(promo) {
    if(S.isString(promo)) {
      promo = data.promos[promo]
    }
    if(!S.isObject(promo)) {
      console.error("[promo]: Invalid Object");
      return
    }
    if(promo.once) {
      var p = promo.unused.pop();
      if(p) {
        promo.used.push(p)
      }else {
        console.warn("[promo]: Not Enough Promotion")
      }
    }else {
      promo.used.push(promo.unused[0])
    }
    return promo.used[promo.used.length - 1]
  };
  var updateUnusedPromo = function(promo) {
    if(S.isString(promo)) {
      promo = data.promos[promo]
    }
    if(!S.isObject(promo)) {
      console.error("[promo]: Invalid Object");
      return
    }
    if(promo.once) {
      var p = promo.used.pop();
      if(p) {
        promo.unused.push(p)
      }else {
        console.log("[promo]: Not Use this Promotion")
      }
    }else {
      promo.used.pop()
    }
    return promo.used[promo.used.length - 1]
  };
  var updateUniquePromo = function(order, oncePromo, bundle) {
    if(!order.sellerId) {
      return
    }
    blacklist[order.sellerId] = blacklist[order.sellerId] || [];
    S.each(order.bundles, function(b) {
      S.each(b.promos, function(p) {
        if(S.inArray(p, oncePromo) && !S.inArray(p, blacklist[order.sellerId])) {
          blacklist[order.sellerId].push(p)
        }
      })
    })
  };
  var getBundles = function(oid) {
    var order = data.orders[oid];
    if(!(order.sellerId in blacklist)) {
      return order.bundles
    }
    var bl = [];
    var selected = order.bundle ? order.bundle.split(";") : [];
    S.each(blacklist[order.sellerId], function(item) {
      if(!S.inArray(item, selected)) {
        bl.push(item)
      }
    });
    var bundles = {};
    for(var k in order.bundles) {
      var kk = k.split(";");
      var add = true;
      S.each(kk, function(item) {
        if(S.inArray(item, bl)) {
          add = false
        }
      });
      if(add) {
        bundles[k] = order.bundles[k]
      }
    }
    return bundles
  };
  var getDiscount = function(oid, bundle) {
    var order = data.orders[oid];
    if(!order) {
      return 0
    }
    if(bundle) {
      updateOrder(oid, bundle)
    }
    return order.bundle in order.bundles ? order.bundles[order.bundle].discount : 0
  };
  var updateAmount = function(order, amount) {
    var o = data.orders[order];
    if(!o || !amount) {
      return
    }
    o.amount = amount
  };
  var tempOrders = {};
  var resetAll = function() {
    var orders = data.orders;
    S.each(data.orders, function(order, idx) {
      if(!S.isEmptyObject(order.bundles)) {
        tempOrders[idx] = tempOrders[idx] || {};
        tempOrders[idx].bundles = S.clone(order.bundles);
        tempOrders[idx].bundle = order.bundle;
        order.bundles = {};
        order.bundle = null;
        updateOrder(idx, order.bundle)
      }
    })
  };
  var getCouples = function(oid) {
    if(S.isEmptyObject(data.orders)) {
      return""
    }else {
      return data.orders[oid].couple.join(";")
    }
  };
  var getDesc = function(oid) {
    if(S.isEmptyObject(data.orders) || !data.orders[oid] || !data.orders[oid].bundle) {
      return""
    }else {
      var order = data.orders[oid];
      return order.bundles[order.bundle].desc
    }
  };
  var getGift = function(oid) {
    if(S.isEmptyObject(data.orders) || !data.orders[oid] || !data.orders[oid].bundle) {
      return""
    }else {
      var order = data.orders[oid];
      return order.bundles[order.bundle].gift
    }
  };
  var re = S.merge({_init:function() {
    S.mix(config, this.config.config);
    S.mix(data, this.config.data);
    S.mix(meta, this.config.meta)
  }, merge:merge, resetAll:resetAll, updateOrder:updateOrder, updateAmount:updateAmount, data:data, blacklist:blacklist, tempOrders:tempOrders, config:config, meta:meta, base:base, getCouples:getCouples, getDiscount:getDiscount, getDesc:getDesc, getGift:getGift, getBundles:getBundles}, S.EventTarget);
  return re
}, {requires:["ajax", "json", "tc/core/rule"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/mods/promotions/vir-ui", function(S, D, E, Promo, Template, JSON, Monitor, undefined) {
  var renderer = Template(['<select name="{{name}}">', "{{#if bundles && !KISSY.isEmptyObject(bundles)}}", '<option value="0">\u65e0\u4f18\u60e0</option>', "{{/if}}", "{{#each bundles}}", "<option {{#if bundle==_ks_index}} selected{{/if}}", ' bundle-data="{{_ks_index}}"', " value=\"{{(typeof couple == 'undefined' ?", " []: couple).join('; ')}}\">", "{{_ks_value.title}}", "</option>", "{{/each}}", "</select>", "{{#if bundles && !KISSY.isEmptyObject(bundles)", " && bundles[bundle] &&", " !KISSY.isEmptyObject(bundles[bundle])}}", 
  "{{bundles[bundle].gift}}", "{{/if}}"].join("")).render;
  var re = {_init:function() {
    var self = this;
    S.mix(this, self.config);
    var AMOUNTCHANGE = "changeamount";
    var BUNDLECHANGE = "changebundle";
    var itemPromoEl = D.get(self.itemPromo || "#J_ItemPromo");
    var shopPromoEl = D.get(self.shopPromo || "#J_ShopPromo");
    var promoEl = D.get(self.promo || "#J_promote");
    var itemOrderId = this.orderId;
    if(!itemPromoEl) {
      console.log("[promo/vir-ui]: has no itemPromo");
      return
    }
    if(!self.api) {
      console.warn("[promo/vir-ui]: specfic promotion api needed.")
    }
    if(!this.promodata) {
      D.hide(promoEl);
      console.log("[promo/vir-ui]: has no promoData");
      return
    }
    var promo = new Promo({api:self.api, from:this.from, groups:this.groups});
    try {
      promo.data = S.isObject(this.promodata) ? this.promodata : JSON.parse(this.promodata)
    }catch(e) {
      console.log("[promo/vir-ui]: promoData error");
      return
    }
    console.log("[promo/vir-ui]: !!" + JSON.stringify(promo.data));
    this.listen("quantity-change", function(e) {
      Monitor.start("promotion_update_from_quantity");
      if(!promo.data || !promo.data.orders || !promo.data.orders[itemOrderId]) {
        console.log("[promo/vir-ui]: has no orders");
        return
      }
      promo.data.orders[itemOrderId].amount = e.quantity;
      promo.config.type = AMOUNTCHANGE;
      requestPromotion()
    }, this.groups);
    var PromoRender = {render:function(o) {
      if(o) {
        var result = promo.isEmptyProperty(o, "bundles") ? "\u65e0\u4f18\u60e0" : renderer(o);
        return result
      }else {
        console.log("[promo/vir-ui]: no promo");
        return null
      }
    }, initItemPromo:function(o) {
      try {
        var itemHtml = this.render(S.merge(o.orders[itemOrderId], {name:"bundleList_" + itemOrderId}));
        if(!itemHtml) {
          return
        }
        D.html(itemPromoEl, "\u4f7f\u7528\u5b9d\u8d1d\u4f18\u60e0\uff1a" + itemHtml);
        D.show(promoEl);
        E.on(D.get("select", itemPromoEl), "change", function(e) {
          promo.config.type = BUNDLECHANGE;
          var selectedbundle = D.attr(e.target.options[e.target.selectedIndex], "bundle-data");
          promo.updateOrder(itemOrderId, selectedbundle ? selectedbundle : null);
          promo.update(function(o) {
            PromoRender.initItemPromo(o);
            PromoRender.initShopPromo(o)
          }, itemOrderId)
        })
      }catch(e) {
        console.warn(e)
      }
    }, initShopPromo:function(o) {
      try {
        var shopHtml = this.render(o.orders[itemOrderId] ? S.merge(o.orders[o.orders[itemOrderId].parent], {name:"bundleList_" + (o.orders[itemOrderId] ? o.orders[itemOrderId].parent : "null")}) : null);
        if(shopHtml) {
          D.html(shopPromoEl, "\u4f7f\u7528\u5e97\u94fa\u4f18\u60e0\uff1a" + shopHtml);
          D.show(promoEl);
          E.on(D.get("select", shopPromoEl), "change", function(e) {
            promo.config.type = BUNDLECHANGE;
            var shopOrderId = promo.data.orders[itemOrderId].parent;
            var selectedbundle = D.attr(e.target.options[e.target.selectedIndex], "bundle-data");
            promo.updateOrder(shopOrderId, selectedbundle ? selectedbundle : null);
            promo.update(function(o) {
              console.log(o);
              PromoRender.initShopPromo(o)
            }, shopOrderId)
          })
        }
      }catch(e) {
        console.warn(e)
      }
    }};
    var requestPromotion = function() {
      Monitor.start("promotion_update");
      promo.update(function(o) {
        var curOrder = promo.data.orders[itemOrderId];
        promo.updateOrder(itemOrderId, curOrder.bundle);
        if(curOrder.parent) {
          promo.updateOrder(curOrder.parent, promo.data.orders[curOrder.parent].bundle, true)
        }
        PromoRender.initItemPromo(o);
        PromoRender.initShopPromo(o);
        Monitor.end("promotion_update");
        Monitor.end("promotion_update_from_quantity")
      }, itemOrderId)
    };
    PromoRender.initItemPromo(promo.data);
    PromoRender.initShopPromo(promo.data)
  }};
  return re
}, {requires:["dom", "event", "./promotion", "template", "json", "tc/core/monitor"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/core/common", function(S, D) {
  if(!Number.prototype.toFixed) {
    Number.prototype.toFixed = function(precision) {
      var power = Math.pow(10, precision || 0);
      var n = String(Math.round(this * power) / power);
      var nf = n.split(".")[1];
      var suffixLeng = 0;
      if(nf) {
        suffixLeng = nf.length
      }else {
        if(precision != suffixLeng) {
          n = n + "."
        }
      }
      for(var i = 0;i < precision - suffixLeng;i++) {
        n = n + "0"
      }
      return n
    }
  }
  var _clearErr = function(el, msg) {
    if(!el) {
      return
    }
    if(msg) {
      S.all(".label-error", el).each(function(element) {
        if(element.html() == msg) {
          element.hide()
        }
      })
    }else {
      D.hide(D.query(".label-error", el))
    }
  };
  var _error = function(el, msg) {
    _clearErr(el);
    el = D.get(el);
    if(!el) {
      return
    }
    var errDiv = D.get(".label-error", el) || function() {
      var _d = document.createElement("div");
      D.addClass(_d, "label-error");
      el.appendChild(_d);
      return _d
    }();
    D.show(errDiv);
    D.html(errDiv, msg || "")
  };
  return{block:function(func, tag) {
    var _r_function = /^function\b\s*([\$\S]*)\s*\(/;
    var _r_codebody = /[^{]*\{([\d\D]*)\}$/;
    var _r_params = /[^\(]*\(([^\)]*)\)[\d\D]*/;
    tag = (tag || "body").toLowerCase();
    func = func.toString();
    return tag == "body" ? func.replace(_r_codebody, "$1").replace(/^\s*|\s*$/g, "") : tag == "param" ? (tag = func.replace(_r_params, "$1")) ? tag.split(/[,\s]+/) : [] : tag == "name" ? func.match(_r_function)[1] : tag == "anonymous" ? Function.apply(this, arguments.callee(func, "param").concat(arguments.callee(func, "body"))) : "Block() with bad arguments."
  }, parseBoolean:function(string) {
    return string && string != "false"
  }, error:_error, clearErr:_clearErr}
}, {requires:["dom"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWRE.
*/
KISSY.add("tc/core/form", function(S, undefined) {
  var forms = {}, instanceCache = {};
  var namesToArray = function(name) {
    return S.isArray(name) ? name : name.split(/[,\s]+/)
  };
  var formBase = S.mix(S.EventTarget, {validate:function() {
    if(this.stop) {
      return true
    }
    var args = [].slice.call(arguments), validated = true;
    for(var i = 0, l = this.name.length;i < l;i++) {
      if(this.name[i] in forms) {
        validated = forms[this.name[i]].validate.apply(this, args);
        if(!validated) {
          break
        }
      }
    }
    if(this.name.length == 1) {
      i = 0
    }
    var method = validated ? "success" : "error";
    console.log("[form]: %s validate result: %s, fired: %s.", this.name.join(","), validated, method);
    this.fire(method, forms[this.name[i]]);
    return validated
  }, stop:false, bind:function() {
    var args = [].slice.call(arguments), vals = [], that = this, o = {events:"blur", stopAtFirst:false, haltAtFirst:true, onBeforeValidate:function() {
    }, onValidated:function() {
    }}, callback, haltAtFirst = o.haltAtFirst;
    if(S.isPlainObject(args[args.length - 1])) {
      o = S.merge(o, args.pop())
    }
    if(S.isFunction(args[args.length - 1])) {
      callback = args.pop()
    }
    that.stop = o.stopAtFirst;
    S.Event.on(args, o.events, function(e) {
      if(callback) {
        callback.apply(that, args)
      }
      o.onBeforeValidate.apply(that, args);
      S.each(args, function(a, i) {
        vals[i] = a.value
      });
      var pass = that.validate.apply(that, vals);
      that.stop = false;
      o.onValidated.call(that, pass, e);
      if(!pass && haltAtFirst) {
        e.halt(true)
      }
      return pass
    })
  }});
  var re = {};
  re.add = function(name, fn, msg, init) {
    forms[name] = {validate:fn || function() {
      return true
    }, msg:msg || ""};
    var formInit = function(config) {
      this.config = {};
      S.isObject(config) && S.mix(this.config, config)
    };
    var o = {name:namesToArray(name), mixWith:function() {
      var names = [], extra;
      var args = [].slice.call(arguments);
      for(var k = 0, m = args.length;k < m;k++) {
        extra = args[k];
        if(S.isFunction(extra)) {
          names = (new extra).name
        }
        if(S.isString(extra) && !S.inArray(name, this.name)) {
          names = namesToArray(name)
        }
        for(var i = 0, l = names.length;i < l;i++) {
          this.name.push(names[i])
        }
      }
      return this
    }};
    return S.augment(S.isFunction(init) && init || formInit, o, formBase)
  };
  console.on("log", function(e) {
    this.decorate(e.args, "form", "background: #d5ffc4")
  });
  return re
});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/form/point", function(S, Form) {
  return Form.add("point", function(i) {
    if(!i) {
      i = 0
    }
    return/^\d+$/.test(i) && i >= 0
  }, "\u4f7f\u7528\u5546\u57ce\u79ef\u5206\u70b9\u6570\u5fc5\u987b\u4e3a\u5927\u4e8e0\u7684\u6574\u6570")
}, {requires:["tc/core/form"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/form/compareNum", function(S, Form) {
  return Form.add("compareNum", function(i, max) {
    if(!i) {
      i = 0
    }
    return parseInt(i) <= (max === Infinity ? max : parseInt(max))
  }, "\u60a8\u4f7f\u7528\u7684\u5546\u57ce\u79ef\u5206\u70b9\u6570\u8d85\u8fc7\u4e86\u8be5\u6b21\u8ba2\u5355\u786e\u8ba4\u5141\u8bb8\u4f7f\u7528\u7684\u6700\u5927\u5546\u57ce\u79ef\u5206\u70b9\u6570")
}, {requires:["tc/core/form"]});

KISSY.add("tc/mods/point/point", function(S, PointForm, CompareNum, Rule) {
  var re = {};
  re.validates = {point:new PointForm, maxUse:new CompareNum};
  re._init = function() {
    var self = S.mix(this, this.config);
    self.rule = Rule.add("point", function(o) {
      return-o.point
    }, {groups:this.groups});
    self.maxUseRule = Rule.add("maxUsePoint", function(b2cShopTotal) {
      return b2cShopTotal * 100
    }, {parents:["b2cShopTotal"], groups:self.groups});
    self.maxUseRule.on("parentUpdate", function(e) {
      if(e.name !== "b2cShopTotal") {
        return
      }
      return Rule.sum(e.parent)
    });
    self.maxUseRule.on("selfUpdate", function(e) {
      console.log("[maxUsePoint]: " + e.result);
      self.maxUse = e.result > self.point ? self.point : e.result;
      self.maxUseRule.fire("selfUpdateComplete")
    });
    self.validates.point.on("error", function() {
      self.rule.update({point:0})
    });
    self.validates.maxUse.on("error", function() {
      self.rule.update({point:0})
    })
  };
  re.test = function() {
    return this.validates.point.validate(this.usePoint) && this.validates.maxUse.validate(this.usePoint, this.maxUse)
  };
  re.change = function(config) {
    var self = S.mix(this, config);
    var ret = self.test();
    if(ret) {
      self.rule.update({point:self.usePoint / 100})
    }
    return ret
  };
  return re
}, {requires:["tc/form/point", "tc/form/compareNum", "tc/core/rule"]});

KISSY.add("tc/mods/point/ui", function(S, DOM, Event, C, Point) {
  return{_init:function() {
    var self = S.mix(this, this.config);
    self.logic = new Point({point:parseInt(self.pointEl.innerHTML || "0", 10), usePoint:S.trim(self.useEl.value || 0), maxUse:0, groups:self.groups});
    var msgBox = S.get("div.msg", self.useEl.parentNode);
    self.logic.validates.point.on("error", function(ev) {
      S.get("p", msgBox).innerHTML = ev.msg;
      DOM.show(msgBox);
      self.priceEl.innerHTML = "-0.00"
    }).on("success", function() {
      DOM.hide(msgBox)
    });
    self.logic.validates.maxUse.on("error", function(ev) {
      S.get("p", msgBox).innerHTML = ev.msg;
      DOM.show(msgBox)
    }).on("success", function(ev) {
      DOM.hide(msgBox)
    });
    self.logic.maxUseRule.on("selfUpdateComplete", function() {
      self.renderData();
      self.bindEvents()
    })
  }, renderData:function() {
    var self = this;
    self.maxPriceEl.innerHTML = (self.logic.maxUse / 100).toFixed(2);
    self.maxUseEl.innerHTML = self.logic.maxUse.toFixed(0);
    var price = self.logic.usePoint / 100;
    price = isNaN(price) ? 0 : price;
    self.priceEl.innerHTML = "-" + price.toFixed(2)
  }, bindEvents:function() {
    var self = this;
    Event.on(self.useEl, "keyup", self.pointChangeHandler, self);
    self.listen("toggle-point", function(e) {
      var d = !!e.disable;
      DOM[d ? "addClass" : "removeClass"](self.useEl, "input-disabled");
      DOM.attr(self.useEl, "disabled", d);
      DOM.attr(self.useEl, "readonly", d);
      if(d) {
        self.useEl.value = 0;
        self.pointChangeHandler()
      }
    }, ["global"]);
    self.listen("global-test", function() {
      return self.logic.test()
    }, ["global"]);
    self.bindEvents = function() {
    }
  }, pointChangeHandler:function() {
    var self = this;
    if(self.logic.change({usePoint:S.trim(self.useEl.value || 0)})) {
      self.renderData()
    }
  }}
}, {requires:["dom", "event", "tc/core/common", "tc/mods/point/point"]});

KISSY.add("tc/mods/winPoints/showWinPoints", function(S, Rule) {
  var re = {};
  re._init = function() {
    var self = S.mix(this, this.config);
    self.rule = Rule.add("cartWinPoint", function(shopWinPoint, o) {
      return shopWinPoint
    }, {parents:["shopWinPoint"], groups:self.groups});
    self.rule.on("parentUpdate", function(e) {
      if(e.name !== "shopWinPoint") {
        return
      }
      return Rule.sum(e.parent)
    })
  };
  return re
}, {requires:["tc/core/rule"]});

KISSY.add("tc/mods/winPoints/showWinPoint-ui", function(S, DOM, ShowWinPoint) {
  var re = {};
  re._init = function() {
    var self = S.mix(this, this.config);
    self.logic = new ShowWinPoint({groups:self.groups});
    self.logic.rule.on("selfUpdate", function(e) {
      self.winPointEl.innerHTML = e.result
    })
  };
  return re
}, {requires:["dom", "tc/mods/winPoints/showWinPoints"]});

KISSY.add("tc/mods/winPoints/winPoints", function(S, Rule) {
  var re = {};
  re._init = function() {
    var self = S.mix(this, this.config);
    self.rule = Rule.add("shopWinPoint", function(itemWinPoint, o) {
      return itemWinPoint + +o.giftPoint
    }, {parents:["itemWinPoint"], groups:self.groups, vars:{giftPoint:0}});
    self.rule.on("parentUpdate", function(e) {
      if(e.name !== "itemWinPoint") {
        return
      }
      return Rule.sum(e.parent)
    })
  };
  return re
}, {requires:["tc/core/rule"]});

KISSY.add("tc/mods/winPoints/winPoint-ui", function(S, DOM, Event, ShopWinPoint) {
  return{_init:function() {
    var self = S.mix(this, this.config);
    self.logic = new ShopWinPoint({groups:self.groups})
  }, updatePoint:function(point) {
    this.logic.rule.update({giftPoint:point})
  }}
}, {requires:["dom", "event", "tc/mods/winPoints/winPoints"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/form/birth", function(S, Form, undefined) {
  function testBirth(str) {
    var year = parseInt(str.substring(0, 4), 10), month = parseInt(str.substring(4, 6), 10), day = parseInt(str.substring(6, 8), 10);
    var MONTH_DAY = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if(year >= 1900 && year < 2010 && MONTH_DAY[month - 1]) {
      if(month == 2 && year / 4 == 0 && year != 1900 && day > 0 && day <= 29) {
        return true
      }else {
        if(day > 0 && day <= MONTH_DAY[month - 1]) {
          return true
        }
      }
    }
    return false
  }
  return Form.add("birth", function(s) {
    return s.length >= 18 && testBirth(s.substring(6, 14))
  })
}, {requires:["tc/core/form"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/form/id", function(S, Form, undefined) {
  return Form.add("id", function(s) {
    return s.match(/^(([0-9]{0,18})|([0-9]{17,17}x))$/i)
  })
}, {requires:["tc/core/form"]});

KISSY.add("tc/form/notNull", function(S, Form) {
  return Form.add("notNull", function(i) {
    return!!S.trim(i)
  }, "\u4e0d\u80fd\u4e3a\u7a7a")
}, {requires:["tc/core/form"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/form/18", function(S, Form, undefined) {
  return Form.add("18", function(s) {
    var today = new Date, month = today.getMonth() + 1 + "", day = today.getDate() + "";
    if(month.length < 2) {
      month = "0" + month
    }else {
      month = "" + month
    }
    if(day.length < 2) {
      day = "0" + day
    }else {
      day = "" + day
    }
    var NUM_DATE = parseInt(today.getFullYear() - 18 + month + day);
    return parseInt(s.substring(6, 14), 10) <= NUM_DATE
  })
}, {requires:["tc/core/form"]});

KISSY.add("tc/mods/authentication/logic", function(S, BirthForm, IdForm, NotNullForm, LargerThan18) {
  var ret = {};
  var validates = {birth:new BirthForm, id:new IdForm, notNull:new NotNullForm, largeThan18:new LargerThan18};
  var msg = {birth:"\u8eab\u4efd\u8bc1\u53f7\u7801\u6709\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165", notNull:"\u8bf7\u8f93\u5165\u8eab\u4efd\u8bc1\u53f7\u7801", largeThan18:"\u60a8\u8fd8\u672a\u6ee118\u5c81\uff0c\u4e0d\u80fd\u8fdb\u884c\u7f51\u6e38\u7c7b\u5546\u54c1\u4ea4\u6613"};
  S.mix(ret, {testId:function(s, showError, clearError) {
    S.each(["birth", "notNull", "largeThan18"], function(method) {
      if(!validates[method].validate(s)) {
        showError && showError(msg[method]);
        this.hasError = true;
        return false
      }else {
        this.hasError = false;
        clearError && clearError()
      }
    }, this)
  }, testBirth:function(str) {
    return validates.birth.validate(str)
  }, validateId:function(str) {
    return validates.id.validate(str)
  }, adjustId:function(s) {
    if(s.length < 18) {
      s = s.replace(/[^0-9]/g, "")
    }else {
      if(s.length == 18) {
        s = s.replace(/[^0-9xX]/g, "")
      }
    }
    return s
  }, testCharOnSubmit:function(s) {
    this.hasError = false;
    if(s.length == 18) {
      if(/\d{17}[^0-9xX]/.test(s)) {
        s = s.substring(0, 17);
        this.hasError = true
      }else {
        if(/\D/g.test(s.substring(0, 17))) {
          s = s.replace(/[^0-9]/g, "");
          this.hasError = true
        }
      }
    }else {
      if(/[^0-9]/g.test(s)) {
        s = s.replace(/[^0-9]/g, "");
        this.hasError = true
      }else {
        this.hasError = false
      }
    }
    return s
  }});
  return ret
}, {requires:["tc/form/birth", "tc/form/id", "tc/form/notNull", "tc/form/18"]});

KISSY.add("tc/mods/authentication/ui", function(S, UA, D, E, Logic) {
  var ret = {};
  S.mix(ret, {show:function() {
    this.popup.center();
    this.popup.show()
  }, hide:function() {
    this.popup.hide()
  }, _init:function() {
    if(!D.get("#J_PopupIdConfirm")) {
      return
    }
    var self = this;
    KISSY.use("overlay", function(S, Overlay) {
      self.logic = new Logic;
      self.shadow = D.get("#J_shadow");
      self.input = D.get("#J_InputIdConfirm");
      self.error = D.get("#J_ErrorIdConfirm");
      self.popup = new Overlay({srcNode:"#J_PopupIdConfirm", zIndex:19999, mask:true});
      S.one("#J_PopupIdConfirm").removeClass("hidden");
      self.show();
      S.one(".ks-ext-mask").addClass("shadow");
      self.popup.on("beforeVisibleChange", function(ev) {
        if(!ev.newVal) {
          if(!D.get("#J_RadioOther").checked) {
            self.testCharOnSubmit();
            self.testId();
            if(self.logic.hasError) {
              return false
            }
          }else {
            if(!self.input.value) {
              self.showError("\u8bf7\u8f93\u5165\u8eab\u4efd\u8bc1\u53f7\u7801")
            }
          }
        }
      });
      E.on(self.input, "blur", self.testId, self);
      E.on(self.input, "keyup", self.testChar, self);
      D.get("#J_RadioInland").checked = "checked";
      E.on(D.get("#J_RadioOther"), "click", self.radioOtherFocus, self);
      E.on(D.get("#J_ButtonIdConfirm"), "click", self.onSubmit, self)
    })
  }, showError:function(msg) {
    var error = this.error;
    D.css(error, "visibility", "visible");
    error.innerHTML = msg
  }, clearError:function() {
    D.css(this.error, "visibility", "hidden")
  }, testId:function() {
    var self = this, o = self.input, s = o.value;
    self.logic.testId(s, function(s) {
      self.showError(s)
    }, function() {
      self.clearError()
    })
  }, testChar:function() {
    var pos1, error = false;
    var range1, range2;
    var o = this.input;
    error = !this.logic.validateId(o.value);
    if(error) {
      if(document.selection) {
        range1 = document.selection.createRange().duplicate();
        range1.moveEnd("character", this.input.value.length);
        pos1 = this.input.value.lastIndexOf(range1.text)
      }else {
        pos1 = this.input.selectionStart
      }
      o.value = this.logic.adjustId(o.value);
      if(document.selection) {
        range2 = this.input.createTextRange();
        range2.collapse(true);
        range2.move("character", pos1 - 1);
        range2.select()
      }else {
        this.input.selectionStart = pos1 - 1;
        this.input.selectionEnd = pos1 - 1
      }
    }
  }, testCharOnSubmit:function() {
    var o = this.input;
    o.value = this.logic.testCharOnSubmit(o.value)
  }, radioOtherBlur:function() {
    E.remove(D.get("#J_RadioInland"), "click", this.radioOtherBlur, this);
    D.get("#confirmIdTipSpan").style["visibility"] = "visible";
    D.html(D.get("#confirmIdLabel"), "\u8eab\u4efd\u8bc1\u53f7\u7801\uff1a");
    this.clearAll();
    this.logic.hasError = true;
    E.remove(D.get("#J_RadioInland"), "click", this.radioOtherBlur, this);
    E.remove(this.input, "blur", this.onEasyBlur, this);
    E.remove(D.get("#J_ButtonIdConfirm"), "click", this.onEasySubmit, this);
    E.on(this.input, "blur", this.testId, this);
    E.on(this.input, "keyup", this.testChar, this);
    E.on(D.get("#J_ButtonIdConfirm"), "click", this.onSubmit, this);
    E.on(D.get("#J_RadioOther"), "click", this.radioOtherFocus, this)
  }, radioOtherFocus:function() {
    D.get("#confirmIdTipSpan").style["visibility"] = "hidden";
    D.html(D.get("#confirmIdLabel"), "\u8eab\u4efd\u8b49\u865f\u78bc\uff1a");
    this.clearAll();
    this.logic.hasError = true;
    E.remove(D.get("#J_RadioOther"), "click", this.radioOtherFocus, this);
    E.remove(this.input, "blur", this.testId, this);
    E.remove(this.input, "keyup", this.testChar, this);
    E.remove(D.get("#J_ButtonIdConfirm"), "click", this.onSubmit, this);
    E.on(D.get("#J_ButtonIdConfirm"), "click", this.onEasySubmit, this);
    E.on(D.get("#J_RadioInland"), "click", this.radioOtherBlur, this);
    E.on(this.input, "blur", this.onEasyBlur, this)
  }, onSubmit:function() {
    this.testCharOnSubmit();
    this.testId();
    if(this.logic.hasError) {
      return false
    }else {
      this.hide()
    }
  }, onEasySubmit:function() {
    if(!this.input.value) {
      this.showError("\u8bf7\u8f93\u5165\u8eab\u4efd\u8bc1\u53f7\u7801");
      return false
    }else {
      this.clearError();
      this.hide()
    }
  }, onEasyBlur:function() {
    if(!this.input.value) {
      this.showError("\u8bf7\u8f93\u5165\u8eab\u4efd\u8bc1\u53f7\u7801")
    }
  }, clearAll:function() {
    this.clearError();
    this.input.value = ""
  }});
  return ret
}, {requires:["ua", "dom", "event", "./logic"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/mods/warning-popup/ui", function(S) {
  return{_init:function() {
    if(!S.one("#J_popup")) {
      return
    }
    KISSY.use("overlay", function(S, Overlay) {
      S.one("#J_popup").removeClass("hidden").css("padding", "25px");
      var o = new Overlay({srcNode:"#J_popup", zIndex:2E4, mask:true});
      o.center();
      o.show();
      S.one(".ks-ext-mask").addClass("shadow");
      var closeBtn = S.one("#J_popup .J_closeBtn");
      var content = closeBtn.html();
      closeBtn.attr("disabled", true);
      closeBtn.on("click", function() {
        o.hide()
      });
      o.on("beforeVisibleChange", function(ev) {
        if(!ev.newVal && closeBtn.attr("disabled")) {
          return false
        }
      });
      KISSY.Event.on(window, "resize", function(e) {
        o.center()
      });
      for(var i = 0;i < 6;i++) {
        (function(i) {
          setTimeout(function() {
            if(i == 5) {
              closeBtn.attr("disabled", false);
              closeBtn.html(content);
              return
            }
            closeBtn.html("(" + (5 - i) + ") " + content)
          }, i * 1E3)
        })(i)
      }
    })
  }}
});

KISSY.add("tc/mods/itemInfo/item", function(S, Rule) {
  var re = {};
  re._init = function() {
    var self = S.mix(this, this.config);
    self.rule = Rule.add("itemPrice", function(o) {
      return o.price
    }, {vars:{price:self.price}, groups:[self.groups]});
    self.rule.update()
  };
  return re
}, {requires:["tc/core/rule"]});

KISSY.add("tc/mods/itemInfo/ui", function(S, Item) {
  var re = {};
  re._init = function() {
    var self = this;
    self.logic = new Item(self.config)
  };
  return re
}, {requires:["./item"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/form/number", function(S, Form) {
  return Form.add("number", function(a, max) {
    return/^\d+$/.test(a) && +a > 0 && +a < (max || Number.MAX_VALUE)
  }, "\u8d2d\u4e70\u6570\u91cf\u5fc5\u987b\u4e3a\u5927\u4e8e0\u7684\u6574\u6570")
}, {requires:["tc/core/form"]});

KISSY.add("tc/mods/quantity/quantity", function(S, Rule, Num, Compare, undefined) {
  var re = {};
  re._init = function() {
    var self = this;
    self.validates = {quantityNum:new Num, quantityCompare:new Compare};
    self.setData(self.config);
    self.rule = Rule.add("quantity", function(itemPrice, o) {
      return itemPrice * o.quantity
    }, {parents:["itemPrice"], groups:self.groups, vars:{quantity:self.quantity}});
    self.rule.on("selfUpdate", function(e) {
      self.fire("change", {quantity:self.quantity});
      self.broadcast("quantity-change", {quantity:self.quantity})
    });
    self.listen("global-test", function() {
      return self.test()
    });
    self.rule.update()
  };
  re.setData = function(config) {
    S.mix(this, config, true)
  };
  re.test = function() {
    if(this.maxQuantity === undefined || this.maxQuantity === "") {
      return this.validates.quantityNum.validate(this.quantity)
    }else {
      return this.validates.quantityNum.validate(this.quantity) && this.validates.quantityCompare.validate(this.quantity, this.maxQuantity)
    }
  };
  re.change = function(data) {
    var self = this;
    self.setData(data);
    if(self.test()) {
      console.log("[quantity]: Updating quantity: %s", self.quantity);
      self.rule.update({quantity:self.quantity});
      return true
    }
    return false
  };
  return re
}, {requires:["tc/core/rule", "tc/form/number", "tc/form/compareNum"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/mods/quantity/normal-ui", function(S, D, E, Quantity, C) {
  var re = {};
  re._init = function() {
    S.mix(this, this.config);
    var quantityEl = D.get(this.quantity || "#J_Quantity");
    var allowQuantityEl = D.get(this.allowQuantity || "#J_AllowQuantity");
    var max = S.trim(this.maxValue || D.attr(allowQuantityEl, "allowquantity"));
    var config = {type:"normal", quantity:S.trim(quantityEl.value), maxQuantity:max, groupId:this.groupId, fullPointPay:this.fullPointPay || false};
    var quantity = new Quantity(config);
    var validates = quantity.validates;
    validates.quantityNum.on("error", function(e) {
      C.error(quantityEl.parentNode, e.msg)
    }).on("success", function(ev) {
      C.clearErr(quantityEl.parentNode, ev.msg)
    });
    validates.quantityCompare.on("error", function(e) {
      C.error(quantityEl.parentNode, "\u6700\u591a\u53ea\u80fd\u8d2d\u4e70" + max + "\u4ef6")
    }).on("success", function(ev) {
      C.clearErr(quantityEl.parentNode, "\u6700\u591a\u53ea\u80fd\u8d2d\u4e70" + max + "\u4ef6")
    });
    E.on(quantityEl, "keyup", function() {
      quantity.change({quantity:S.trim(quantityEl.value)})
    })
  };
  return re
}, {requires:["dom", "event", "./quantity", "tc/core/common"]});

KISSY.add("tc/form/mobile", function(S, Form) {
  return Form.add("mobile", function(i) {
    return/^\d{2,11}$/.test(S.trim(i))
  }, "\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u53f7\u7801\uff0c\u624b\u673a\u53f7\u7801\u5fc5\u987b\u5168\u4e3a\u6570\u5b57\uff0c\u4e14\u4e0d\u80fd\u8d85\u8fc711\u4f4d")
}, {requires:["tc/core/form"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/form/length", function(S, Form) {
  var re = Form.add("length", function(a, b) {
    return a.length <= (b || 100)
  }, "\u4e0d\u80fd\u8d85\u8fc7100");
  var _validate = re.prototype.validate;
  re.prototype.validate = function() {
    var args = [].slice.call(arguments);
    if(this.config && this.config.max) {
      args[1] = this.config.max
    }
    return _validate.apply(this, args)
  };
  return re
}, {requires:["tc/core/form"]});

KISSY.add("tc/form/repeat", function(S, Form) {
  return Form.add("repeat", function(target, self) {
    return S.trim(target) === S.trim(self)
  }, "\u4e24\u6b21\u8f93\u5165\u4e0d\u4e00\u81f4")
}, {requires:["tc/core/form"]});

KISSY.add("tc/form/identityCard", function(S, Form) {
  return Form.add("identityCard", function(i) {
    return/^\d{17}[x0-9X]$|^$/.test(i)
  }, "\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u8eab\u4efd\u8bc1\u53f7")
}, {requires:["tc/core/form"]});

KISSY.add("tc/mods/generQRCode/generQRCode", function(S, Mobile, length, repeat, identityCard, notNull) {
  var validates = {mySelfMob:new Mobile, mySelfMobRepeat:new repeat, friendMob:new Mobile, friendMobRepeat:new repeat, nameNotNull:new notNull, nameLength:new length({max:9}), identityCard:new identityCard, identityCardRepeat:new repeat};
  var re = {validates:validates, isFriend:function() {
    return this.to === "friend"
  }};
  re._init = function() {
    S.mix(this, this.config);
    var that = this;
    this.listen("global-test", function() {
      return that.test()
    })
  };
  re.test = function(config) {
    var that = this;
    var pass = true;
    var _testMobileRepeat = function() {
      if(that.isFriend()) {
        return validates.friendMobRepeat.validate(that.friendMob.value, that.friendMobRepeat.value)
      }else {
        return validates.mySelfMobRepeat.validate(that.mySelfMob.value, that.mySelfMobRepeat.value)
      }
    };
    var _testMobile = function() {
      var rst;
      if(that.isFriend()) {
        rst = validates.friendMob.validate(that.friendMob.value);
        rst && that.friendMobRepeat.value && _testMobileRepeat()
      }else {
        rst = validates.mySelfMob.validate(that.mySelfMob.value);
        rst && that.mySelfMobRepeat.value && _testMobileRepeat()
      }
      return rst
    };
    var _testName = function() {
      if(!that.name) {
        console.warn("[generQRCode]: name not found, return true.");
        return true
      }
      return validates.nameNotNull.validate(that.name.value) && validates.nameLength.validate(that.name.value)
    };
    var _testIdentityCard = function() {
      if(!that.identityCard) {
        console.warn("[generQRCode]: identityCard not found, return true.");
        return true
      }
      var rst = validates.identityCard.validate(that.identityCard.value);
      rst && _testIdentityCardRepeat();
      return rst
    };
    var _testIdentityCardRepeat = function() {
      if(!that.identityCardRepeat) {
        console.warn("[generQRCode]: identityCardRepeat not found, return true.");
        return true
      }
      return validates.identityCardRepeat.validate(that.identityCard.value, that.identityCardRepeat.value)
    };
    var map = {mySelfMob:_testMobile, mySelfMobRepeat:_testMobileRepeat, friendMob:_testMobile, friendMobRepeat:_testMobileRepeat, name:_testName, identityCard:_testIdentityCard, identityCardRepeat:_testIdentityCardRepeat};
    if(config) {
      for(var el in config) {
        if(el in map) {
          pass = pass && map[el]()
        }else {
          console.log("xy warning:" + el + " is not in map!!   -------tc/mods/generQRCode/generQRCode")
        }
      }
      return pass
    }else {
      var pass1 = _testMobile() && _testMobileRepeat();
      var pass2 = that.isFriend() ? _testName() : true;
      var pass3 = that.to ? true : _testIdentityCard() && _testIdentityCardRepeat();
      console.log("[all test]:" + pass1 + " " + pass2 + " " + pass3);
      return pass1 && pass2 && pass3
    }
  };
  re.setData = function(config) {
    if(config) {
      S.mix(this, config)
    }
  };
  re.change = function(changeConfig) {
    S.mix(this, changeConfig, true);
    return this.test(changeConfig)
  };
  return re
}, {requires:["tc/form/mobile", "tc/form/length", "tc/form/repeat", "tc/form/identityCard", "tc/form/notNull"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/mods/generQRCode/ui", function(S, D, E, GenerQRCode, C) {
  var re = {};
  re._init = function() {
    var els = {friend:D.get("#J_Present .J_ToFriend"), mySelf:D.get("#J_Present .J_ToMyself"), friendUl:D.get("#J_ToFriend"), mySelfUl:D.get("#J_ToMySelf"), presentInfo:D.get("#J_PresentInfo")};
    for(var i in els) {
      if(!els[i]) {
        console.warn("[generQRCode/ui] element %s not found. delete it.", i);
        delete els[i]
      }
    }
    var inPutEls = {friendMob:D.get("#J_friendMob"), friendMobRepeat:D.get("#J_SureFriendMobile"), mySelfMob:D.get("#J_MyMobile"), mySelfMobRepeat:D.get("#J_SureMyMobile"), name:D.get("#J_Name")};
    for(var i in inPutEls) {
      if(!inPutEls[i]) {
        console.warn("[generQRCode/ui] inputElement %s not found. delete it.", i);
        delete inPutEls[i]
      }
    }
    var NAME_LENGTH = 9;
    var validatesMap = {mySelfMob:{el:"mySelfMob"}, mySelfMobRepeat:{el:"mySelfMobRepeat"}, friendMob:{el:"friendMob"}, friendMobRepeat:{el:"friendMobRepeat"}, nameNotNull:{el:"name", msg:"\u59d3\u540d\u6216\u6635\u79f0\u4e0d\u80fd\u4e3a\u7a7a"}, nameLength:{el:"name", msg:"\u6700\u591a\u53ef\u8f93\u51659\u4e2a\u5b57"}};
    var _clearInputValue = function(el) {
      if(!el) {
        return
      }
      S.each(D.query("input", el), function(element) {
        if(element.id != "J_Benediction") {
          element.value = ""
        }
      })
    };
    var config = {friendMob:{value:S.trim(inPutEls.friendMob.value)}, friendMobRepeat:{value:S.trim(inPutEls.friendMobRepeat.value)}, name:{value:S.trim(inPutEls.name.value)}, identityCard:{value:""}, identityCardRepeat:{value:""}, to:"friend", NAME_LENGTH:NAME_LENGTH};
    var generQRCode = new GenerQRCode(config);
    var _showMySelf = function(attr) {
      if(attr) {
        D.addClass(els.friendUl, "hidden");
        D.removeClass(els.mySelfUl, "hidden");
        D.addClass(els.presentInfo, "hidden");
        C.clearErr(els.friendUl);
        _clearInputValue(els.friendUl);
        generQRCode.setData({mySelfMob:{value:S.trim(inPutEls.mySelfMob.value)}, mySelfMobRepeat:{value:S.trim(inPutEls.mySelfMobRepeat.value)}, friendMob:{value:""}, friendMobRepeat:{value:""}, name:{value:""}, to:"myself"})
      }else {
        D.removeClass(els.friendUl, "hidden");
        D.addClass(els.mySelfUl, "hidden");
        D.removeClass(els.presentInfo, "hidden");
        C.clearErr(els.mySelfUl);
        _clearInputValue(els.mySelfUl);
        generQRCode.setData({mySelfMob:{value:""}, mySelfMobRepeat:{value:""}, friendMob:{value:S.trim(inPutEls.friendMob.value)}, friendMobRepeat:{value:S.trim(inPutEls.friendMob.value)}, name:{value:S.trim(inPutEls.name.value)}, to:"friend"})
      }
    };
    if(els.mySelf.checked) {
      _showMySelf(true)
    }
    if(els.friend.checked) {
      _showMySelf(false)
    }
    var validates = generQRCode.validates;
    var _bind = function(vName) {
      var elName = validatesMap[vName].el;
      var elDom = inPutEls[elName];
      if(!elDom) {
        console.log("tc/mods/generPhone/ui element\uff1a " + elName + " not exist")
      }else {
        var msg = validatesMap[vName].msg;
        validates[vName].on("error", function(e) {
          C.error(elDom.parentNode, msg || e.msg)
        }).on("success", function(e) {
          C.clearErr(elDom.parentNode, msg || e.msg)
        })
      }
    };
    for(var vName in validatesMap) {
      _bind(vName)
    }
    S.each(inPutEls, function(el) {
      E.on(el, "blur", function(el) {
        var dataConfig = {};
        for(var elName in inPutEls) {
          if(el.target === inPutEls[elName]) {
            dataConfig[elName] = {value:S.trim(inPutEls[elName].value)}
          }
        }
        generQRCode.change(dataConfig)
      })
    });
    E.on("#J_Present", "click", function(ev) {
      var eventTarget = ev.target;
      if(D.hasClass(eventTarget, "J_ToMyself")) {
        _showMySelf(true)
      }
      if(D.hasClass(eventTarget, "J_ToFriend")) {
        _showMySelf(false)
      }
    })
  };
  return re
}, {requires:["dom", "event", "tc/mods/generQRCode/generQRCode", "tc/core/common"]});

KISSY.add("tc/mods/memo/memo", function(S, notNull, length) {
  var re = {memo:{readOnly:false, maxLength:500, value:"", needMemoNullTest:false}};
  re._init = function() {
    var that = this;
    S.mix(that.memo, that.config, true);
    that.validates = {memoNotNull:new notNull, memoLength:new length({max:that.memo.maxLength})};
    that.listen("global-test", function(e) {
      if(that.test()) {
        that.fire("clean-msg");
        return true
      }
      return false
    }, this.groups);
    if(that.memo && that.memo.value !== "") {
      that.test()
    }
  };
  re.setData = function(config) {
    S.mix(this, config, true)
  };
  re.change = function(config) {
    S.mix(this, config, true);
    return this.test()
  };
  re.test = function() {
    if(this.needMemoNullTest) {
      return this.validates.memoNotNull.validate(this.memo.value) && this.validates.memoLength.validate(this.memo.value)
    }else {
      return this.validates.memoLength.validate(this.memo.value)
    }
  };
  return re
}, {requires:["tc/form/notNull", "tc/form/length"]});

KISSY.add("tc/core/widget", function(S, D, E) {
  var D = S.DOM, E = S.Event;
  var Widget = {};
  Widget.InputHint = {decorate:function(inputField, config) {
    var defConfig = {hintMessage:"", hintClass:"tb-input-hint", appearOnce:false};
    var EMPTY_PATTERN = /^\s*$/;
    inputField = D.get(inputField);
    config = S.merge(defConfig, config || {});
    var hintMessage = config.hintMessage || inputField.title || "";
    if(!S.trim(hintMessage)) {
      return
    }
    var div = D.create("<div style='position:relative;" + "display:inline-block;" + "*display:inline;" + "*zoom:1;'>");
    D.insertBefore(div, inputField);
    div.appendChild(inputField);
    var handle = {};
    handle.disabled = false;
    var inputDiv = (new S.Node("<div " + "style='position:absolute;" + "left:-9999px;" + "top:-9999px;' " + "class='" + config.hintClass + "'>" + hintMessage + "</div>")).insertAfter(inputField);
    inputDiv.css("width", inputField.offsetWidth);
    handle.disappear = function() {
      inputDiv.offset({left:-9999, top:-9999})
    };
    handle.appear = function() {
      if(EMPTY_PATTERN.test(inputField.value)) {
        var off = D.offset(inputField);
        off.left += 5;
        inputDiv.offset(off)
      }
    };
    handle.purge = function() {
      this.disappear();
      E.remove(inputField, "focus", focusHandler);
      E.remove(inputField, "drop", focusHandler);
      E.remove(inputField, "blur", blurHandler)
    };
    var focusHandler = function(ev) {
      inputField.focus();
      if(!handle.disabled) {
        handle.disappear()
      }
    };
    var blurHandler = function(ev) {
      if(!handle.disabled) {
        handle.appear()
      }
    };
    if(!inputField.title) {
      D.attr(inputField, "title", hintMessage)
    }
    E.on([inputField, inputDiv[0]], "focus", focusHandler);
    E.on(inputField, "drop", focusHandler);
    if(!config.appearOnce) {
      E.on(inputField, "blur", blurHandler)
    }
    setTimeout(function() {
      handle.appear()
    }, 0);
    return handle
  }};
  return Widget
}, {requires:["dom", "event"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/mods/memo/ui", function(S, D, E, Memo, C, W) {
  var re = {};
  re._init = function() {
    S.mix(this, this.config);
    var that = this;
    var memoEl = S.get(that.memo || "#J_msgtosaler");
    if(!memoEl) {
      console.warn("[memo]: memo %s is not found, ignored.", that.memo);
      return
    }
    var maxLength = that.maxLength || 500;
    var groupId = that.groupId;
    var needMemoNullTest = that.needMemoNullTest || false;
    var config = {value:S.trim(memoEl.value), maxLength:maxLength, groupId:groupId, needMemoNullTest:needMemoNullTest};
    var memo = new Memo(config);
    W.InputHint.decorate("#" + memoEl.id, {hintClass:"tips"});
    var validates = memo.validates;
    validates.memoLength.on("error", function(e) {
      C.error(memoEl.parentNode, "\u6700\u591a\u8f93\u5165" + maxLength + "\u4e2a\u5b57\u7b26")
    }).on("success", function(ev) {
      C.clearErr(memoEl.parentNode, "\u6700\u591a\u8f93\u5165" + maxLength + "\u4e2a\u5b57\u7b26")
    });
    if(needMemoNullTest) {
      validates.memoNotNull.on("error", function(e) {
        C.error(memoEl.parentNode, "\u4e0d\u80fd\u4e3a\u7a7a")
      }).on("success", function(ev) {
        C.clearErr(memoEl.parentNode, "\u4e0d\u80fd\u4e3a\u7a7a")
      })
    }
    E.on(memoEl, "blur", function() {
      memo.change({memo:{value:S.trim(memoEl.value)}})
    })
  };
  return re
}, {requires:["dom", "event", "./memo", "tc/core/common", "tc/core/widget"]});

KISSY.add("tc/mods/payForAnother/payForAnother", function(S) {
  var re = {readOnly:false, isChecked:false};
  re._init = function() {
    S.mix(this, this.config, true);
    this.listen("postType-change fareInsure-change", function(e) {
      if(e.target.postType = "cod" || e.target.fareInsure.isChecked) {
        this.fire("disabled-el")
      }else {
        this.fire("un-disabled-el")
      }
    })
  };
  re.change = function(json) {
    if(this.readOnly) {
      console.log("payForAnother is read only");
      return
    }
    S.mix(this, json)
  };
  return re
});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/mods/payForAnother/ui", function(S, D, E, PayForAnother) {
  var re = {};
  re._init = function() {
    var payForAnotherEl = D.get("#" + "find-another");
    var config = {readOnly:true, isChecked:payForAnotherEl.checked};
    var payForAnother = new PayForAnother(config);
    payForAnother.on("disabled", function(e) {
      payForAnotherEl.disabled = "disabled"
    });
    payForAnother.on("un-disabled", function(e) {
      payForAnotherEl.disabled = ""
    });
    E.on(payForAnotherEl, "click", function(e) {
      payForAnother.change({isChecked:e.target.checked})
    })
  };
  return re
}, {requires:["dom", "event", "./payForAnother"]});

KISSY.add("tc/mods/realPay/realPay", function(S, Rule) {
  var re = {realMoney:{readOnly:false, value:""}};
  re._init = function() {
    var that = this;
    S.mix(that.realMoney, that.config, true);
    that.rule = Rule.add("realPay", function(shopPay, point) {
      var result = shopPay + point;
      if(result < 0) {
        console.log("[realpay]: result is less than zero. use 0");
        result = 0
      }
      return result
    }, {parents:["shopPay", "point"], groups:that.groups});
    that.rule.on("parentUpdate", function(e) {
      if(e.name !== "shopPay") {
        return
      }
      return Rule.sum(e.parent)
    });
    that.rule.on("selfUpdate", function(e) {
      console.log("[realPay]: |%s| %s", that.config.cartId, e.result);
      if(that.realMoney.fullPointPay) {
        that.show(0)
      }else {
        that.show(e.result)
      }
    })
  };
  re.show = function(realMoney, o) {
    var money = (realMoney || realMoney === 0 ? realMoney : this.realMoney.value).toFixed(2);
    this.fire("realPay-show", S.mix({realMoney:money}, o), null, this.groupId)
  };
  re.setMoney = function(realMoney, isShow) {
    if(this.realMoney.readOnly) {
      console.log("[realpay]: realMoney is readOnly");
      return
    }
    this.realMoney.value = realMoney;
    if(isShow) {
      this.show(this.realMoney.value)
    }
  };
  return re
}, {requires:["tc/core/rule"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/mods/realPay/ui", function(S, RealPay) {
  var re = {};
  re._init = function() {
    S.mix(this, this.config);
    var realPayEl = S.one(this.actualFee || "#J_ActualFee");
    var totalSum = S.one(this.totalSum || "#J_TotalSum");
    var realPay = new RealPay(this.config);
    realPay.on("realPay-show", function(e) {
      realPayEl.html(e.realMoney);
      if(totalSum) {
        totalSum.val(e.realMoney)
      }
    }, null, this.groups)
  };
  return re
}, {requires:["./realPay"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/mods/submit/submit", function(S, DOM, Monitor) {
  return{submit:function() {
    var self = this;
    if(DOM.get("#J_verifyImage")) {
      self.listen("checkCode:success", function() {
        self.test()
      })
    }else {
      self.test()
    }
    self.broadcast("checkCode")
  }, test:function() {
    var self = this;
    if(self.broadcast("global-test") !== false) {
      self.fire("submit")
    }
  }}
}, {requires:["dom", "tc/core/monitor"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/mods/submit/ui", function(S, D, E, Submit) {
  var re = {};
  re._init = function() {
    var self = S.mix(this, this.config);
    var globalForm = new Submit;
    var form = S.get(this.submitForm || "#J_Form");
    var submitEl = S.get(this.submitId || "#J_Go");
    submitEl && (submitEl.disabled = false);
    globalForm.on("submit", function() {
      if(submitEl) {
        submitEl.disabled = true;
        if(self.isTips && self.isTips.value) {
          var tips = S.get(".submit-tips");
          if(!tips) {
            tips = document.createElement("div");
            D.addClass(tips, "submit-tips");
            submitEl.parentNode.appendChild(tips);
            D.show(tips);
            tips.innerHTML = "\u6b63\u5728\u5904\u7406\uff0c\u8bf7\u7a0d\u5019..."
          }
        }
      }
      form.submit()
    });
    E.on(submitEl, "click", function(ev) {
      ev.halt(true);
      globalForm.submit()
    });
    E.on(form, "submit", function(ev) {
      ev.halt(true);
      globalForm.submit()
    })
  };
  return re
}, {requires:["dom", "event", "./submit"]});

KISSY.add("tc/mods/checkCode/checkCode", function(S, length, notNull) {
  var re = {checkCode:{value:""}, validates:{checkCodeNotNull:new notNull}};
  re._init = function() {
    S.mix(this, this.config);
    var self = this
  };
  re.test = function() {
    return this.validates.checkCodeNotNull.validate(this.checkCode.value)
  };
  re.change = function(config) {
    S.mix(this, config, true);
    return this.test(config)
  };
  return re
}, {requires:["tc/form/length", "tc/form/notNull"]});

KISSY.add("tc/mods/checkCode/ui", function(S, Ajax, DOM, Event, C, CheckCode) {
  var re = {};
  re._init = function() {
    var self = S.mix(this, this.config);
    var imgEl = DOM.get(this.img || "#J_verifyImage");
    var checkCodeEl = DOM.get(this.checkCode || "#verify-code");
    var nextCode = DOM.get(this.nextCode || "#J_verifyTrigger");
    var checkCodeUrlEl = DOM.get("#J_checkCodeUrl");
    if(!checkCodeEl || !checkCodeUrlEl) {
      console.log("[checkcode]: checkCode is not use..");
      return
    }
    var logic = new CheckCode({checkCode:{value:checkCodeEl.value}});
    self.checkCodeURL = checkCodeUrlEl.value;
    self.logic = logic;
    self.checkCodeEl = checkCodeEl;
    Event.on(nextCode, "click", function(e) {
      e.halt();
      imgEl.src = imgEl.src + "&t=" + (new Date).getTime()
    });
    var validates = logic.validates;
    validates.checkCodeNotNull.on("error", function(e) {
      C.error(checkCodeEl.parentNode, "\u8bf7\u586b\u5199\u6821\u9a8c\u7801")
    }).on("success", function(ev) {
      S.later(function() {
        C.clearErr(checkCodeEl.parentNode, "\u8bf7\u586b\u5199\u6821\u9a8c\u7801")
      }, 500, false)
    });
    Event.on(checkCodeEl, "blur", function() {
      logic.change({checkCode:{value:checkCodeEl.value}})
    });
    self.listen("global-test", function() {
      return logic.change({checkCode:{value:checkCodeEl.value}})
    });
    self.listen("checkCode", function() {
      self.verifyCode()
    })
  };
  re.verifyCode = function() {
    var self = this;
    var url = self.checkCodeURL;
    var els = DOM.get("#J_Form").elements;
    if(!els["isCheckCode"]) {
      return
    }
    var params = [];
    S.each(["isCheckCode", "encrypterString", "sid", "gmtCreate", "checkCodeIds"], function(name) {
      params.push(name + "=" + (els[name] && els[name].value))
    });
    url = url + (url.indexOf("?") === -1 ? "?" : "&") + params.join("&");
    url += "&checkCode=" + S.trim(self.logic.checkCode.value);
    Ajax.get(url, function(data) {
      if(data !== "error") {
        if(!els["newCheckCode"]) {
          DOM.create('<input type="hidden" name="newCheckCode" value="' + data + '" />')
        }else {
          els["newCheckCode"].value = data
        }
        self.broadcast("checkCode:success")
      }else {
        C.error(self.checkCodeEl.parentNode, "\u8bf7\u586b\u5199\u6b63\u786e\u7684\u6821\u9a8c\u7801");
        var imgEl = DOM.get(this.img || "#J_verifyImage");
        imgEl.src = imgEl.src + "&t=" + (new Date).getTime()
      }
    })
  };
  return re
}, {requires:["ajax", "dom", "event", "tc/core/common", "tc/mods/checkCode/checkCode"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/mods/totalFee/totalFee", function(S, Rule) {
  var re = {totalFee:{readOnly:false, value:0}};
  re._init = function() {
    var that = this;
    var cfg = this.config || {};
    S.mix(that.totalFee, that.config, true);
    that.rule = Rule.add("totalFee", function(itemTotal, fare, cod) {
      return itemTotal + fare + cod
    }, {parents:["itemTotal", "fareTemplate", "cod"], groups:this.groups});
    that.rule.on("parentUpdate", function(e) {
      if(e.name !== "itemTotal") {
        return
      }
      return Rule.sum(e.parent)
    });
    that.rule.on("selfUpdate", function(e) {
      that.broadcast("totalFee-show", {totalFee:e.result}, that.groups);
      that.show(e.result)
    })
  };
  re.show = function(totalFee) {
    var money = totalFee ? totalFee.toFixed(2) : this.totalFee.value.toFixed(2);
    this.fire("totalFee-show", {totalFee:money})
  };
  re.setMoney = function(totalFee, isShow) {
    if(this.totalFee.readOnly) {
      console.log("realMoney is readOnly");
      return
    }
    this.totalFee.value = totalFee;
    if(isShow) {
      this.show(this.totalFee.value)
    }
  };
  return re
}, {requires:["tc/core/rule"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/mods/totalFee/ui", function(S, D, E, TotalFee) {
  var re = {};
  re._init = function() {
    S.mix(this, this.config);
    var totalFeeEl = D.get(this.totalPrice || "#J_TotalFee");
    var totalFee = new TotalFee({groupId:this.groupId});
    totalFee.on("totalFee-show", function(e) {
      if(totalFeeEl) {
        totalFeeEl.innerHTML = e.totalFee
      }
    })
  };
  return re
}, {requires:["dom", "event", "./totalFee"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/mods/point/fullPointPay-ui", function(S, C, Point) {
  var E = S.Event, D = S.DOM;
  return{_init:function() {
    S.mix(this, this.config);
    var maxUseEl = D.get(this.maxUseEl || "#ark_maxUsePointValue");
    var maxPriceEl = D.get(this.maxPriceEl || "#ark_maxUsePointPriceValue");
    var pointEl = D.get(this.pointEl || "#ark_pointValue");
    this.listen("quantity-change", function(e) {
      console.log(e.result)
    });
    var point = new Point({point:{value:parseInt(pointEl.innerHTML || "0")}, use:{value:0}, maxUse:{value:0}, fullPointPay:{value:true}});
    point.on("totalFee-ready", function(ev) {
      maxPriceEl.innerHTML = point.getPrice(point.getMaxUsePoint()).toFixed(2);
      maxUseEl.innerHTML = point.getMaxUsePoint()
    });
    point.validates.maxUse.on("error", function(ev) {
      C.error(pointEl.parentNode, "\u5bf9\u4e0d\u8d77\uff0c\u60a8\u6301\u6709\u7684\u5546\u57ce\u79ef\u5206\u70b9\u6570\u4e0d\u8db3\u4ee5\u6362\u8d2d\u6b64\u5546\u54c1")
    }).on("success", function(ev) {
      C.clearErr(pointEl.parentNode, "\u5bf9\u4e0d\u8d77\uff0c\u60a8\u6301\u6709\u7684\u5546\u57ce\u79ef\u5206\u70b9\u6570\u4e0d\u8db3\u4ee5\u6362\u8d2d\u6b64\u5546\u54c1")
    })
  }}
}, {requires:["tc/core/common", "tc/mods/point/point"]});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/mods/totalPointPay/totalPointPay", function(S) {
  var re = {};
  re._init = function() {
    var that = this;
    var cfg = this.config || {};
    S.mix(that, that.config, true);
    that.listen("quantity-change", function(e) {
      setTimeout(function() {
        console.log("quantity-change is listened by totalPointPay!,realPay:" + e.result);
        that.broadcast("totalPointPay-show", {result:e.result * 100}, null, cfg.groupId);
        that.show(e.result)
      }, 0)
    }, null, cfg.groupId)
  };
  re.show = function(totalPointPay) {
    var cfg = this.config || {};
    var money = totalPointPay.toFixed(2);
    this.fire("totalPointPay-show", {totalPointPay:money})
  };
  return re
});

/*

 Copyright (c) 2010 Taobao Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
KISSY.add("tc/mods/totalPointPay/ui", function(S, D, E, TotalPointPay) {
  var re = {};
  re._init = function() {
    S.mix(this, this.config);
    var totalPointPayEl = D.get(this.totalPrice || "#J_needPoints");
    var totalPointPay = new TotalPointPay;
    totalPointPay.on("totalPointPay-show", function(e) {
      totalPointPayEl.innerHTML = e.totalPointPay * 100
    })
  };
  return re
}, {requires:["dom", "event", "./totalPointPay"]});

KISSY.add("tc/cart/qrCodeOrder", function(S, Promo, Point, ShowWinPoint, WinPoints, AUI, WUI, ItemUI, QuantityUI, GenerQRCodeUI, MemoUI, PayForAnotherUI, RealPayUI, SubmitUI, CheckCode, TotalFee, FullPointUI, TotalPointPayUI) {
  var re = {};
  var D = S.DOM;
  re._init = function() {
    S.mix(this, this.config);
    var groupId = S.guid();
    var winPoint = this.winPoint || false;
    this.usePoint = this.usePoint || false;
    this.fullPointPay = this.fullPointPay || false;
    new AUI;
    new WUI;
    new Promo({api:this.promoAPI, orderId:this.orderId, promodata:this.promodata, from:this.from || "buynow", promo:this.promo, itemPromo:this.itemPromo, shopPromo:this.shopPromo, groupId:groupId});
    if(winPoint) {
      this.showPoint = new ShowWinPoint;
      this.winPonit = new WinPoints({rate:D.get("#J_Rate") ? D.get("#J_Rate").value : 0, id:groupId, presentPoint:D.get("#J_PresentPoint") ? D.get("#J_PresentPoint").value : 0, codBias:D.get("#J_CodBias") ? D.get("#J_CodBias").value : 0, manjiujianBias:D.get("#J_ManjiujianBias") ? D.get("#J_ManjiujianBias").value : 0})
    }
    this.quantity = new QuantityUI({groupId:groupId});
    this.beizhuUI = new MemoUI({memo:"#J_Benediction", maxLength:18});
    this.memo = new MemoUI({memo:"#J_msgtosaler"});
    this.payForAnother = new PayForAnotherUI;
    new TotalFee({totalPrice:"#ark_totalPrice", groupId:groupId});
    if(this.usePoint) {
      if(this.fullPointPay) {
        new FullPointUI({fullPointPay:this.fullPointPay, needPointEl:"J_needPoints"});
        new TotalPointPayUI
      }else {
        new Point({pointEl:"#ark_pointValue", useEl:"#ark_usePointId", priceEl:"#profitId", maxPriceEl:"#ark_maxUsePointPriceValue", groupId:groupId, maxUseEl:"#ark_maxUsePointValue"})
      }
    }
    new RealPayUI({fullPointPay:this.fullPointPay, groupId:groupId});
    this.itemInfo = new ItemUI({groupId:groupId});
    this.submit = new SubmitUI({isTips:{value:true}});
    this.generQRCode = new GenerQRCodeUI;
    new CheckCode
  };
  return re
}, {requires:["tc/mods/promotions/vir-ui", "tc/mods/point/ui", "tc/mods/winPoints/showWinPoint-ui", "tc/mods/winPoints/winPoint-ui", "tc/mods/authentication/ui", "tc/mods/warning-popup/ui", "tc/mods/itemInfo/ui", "tc/mods/quantity/normal-ui", "tc/mods/generQRCode/ui", "tc/mods/memo/ui", "tc/mods/payForAnother/ui", "tc/mods/realPay/ui", "tc/mods/submit/ui", "tc/mods/checkCode/ui", "tc/mods/totalFee/ui", "tc/mods/point/fullPointPay-ui", "tc/mods/totalPointPay/ui"]});


