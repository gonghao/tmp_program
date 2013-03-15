/**
 * ��ά��ף������
 *
 * @author ��ͦ <zhangting@taobao.com>
 * @create: 11-3-22 ����11:21
 */
KISSY.add(/*'tc/cart/qrCodeOrder', */function(S, Promo, Point, ShowWinPoint, WinPoints, AUI, WUI, ItemUI,
                                          QuantityUI, GenerQRCodeUI, MemoUI, PayForAnotherUI,
                                          RealPayUI, SubmitUI, CheckCode, TotalFee, FullPointUI, TotalPointPayUI) {
    var re = {};
    var D = S.DOM;
    re._init = function() {
        S.mix(this, this.config);
        var groupId = S.guid();
        var winPoint = this.winPoint || false;//Ĭ�ϲ��û�û���
        this.usePoint = this.usePoint || false;//Ĭ�ϲ�ʹ�û���
        this.fullPointPay = this.fullPointPay || false; //Ĭ�ϲ���ȫ��ʹ�û���
        new AUI();
        new WUI();
        new Promo({api: this.promoAPI, orderId:this.orderId, promodata:this.promodata, from: this.from || 'buynow', promo: this.promo, itemPromo: this.itemPromo, shopPromo:this.shopPromo, groupId: groupId});

        if (winPoint) {
            this.showPoint = new ShowWinPoint();
            this.winPonit = new WinPoints({
                rate: D.get('#J_Rate') ? D.get('#J_Rate').value : 0,
                id : groupId,
                presentPoint: D.get('#J_PresentPoint') ? D.get('#J_PresentPoint').value : 0,
                codBias: D.get('#J_CodBias') ? D.get('#J_CodBias').value : 0,
                manjiujianBias: D.get('#J_ManjiujianBias') ? D.get('#J_ManjiujianBias').value : 0
            });
        }
        this.quantity = new QuantityUI({groupId: groupId});
        this.beizhuUI = new MemoUI({memo: '#J_Benediction', maxLength: 18});
        this.memo = new MemoUI({memo: '#J_msgtosaler'});
        this.payForAnother = new PayForAnotherUI();
        new TotalFee({totalPrice: '#ark_totalPrice', groupId: groupId});
        // ����
        if (this.usePoint) {
            if(this.fullPointPay) {
                new FullPointUI({
                    fullPointPay: this.fullPointPay,
                    needPointEl: 'J_needPoints'
                });
                new TotalPointPayUI();
            } else{
                new Point({
                    pointEl: '#ark_pointValue',
                    useEl: '#ark_usePointId',
                    priceEl: '#profitId',
                    maxPriceEl: '#ark_maxUsePointPriceValue',
                    groupId: groupId,
                    maxUseEl: '#ark_maxUsePointValue'});
            }
        }

        // ʵ����
        new RealPayUI({fullPointPay: this.fullPointPay, groupId: groupId});

        this.itemInfo = new ItemUI({groupId: groupId});
        this.submit = new SubmitUI({isTips: {value: true}});
        this.generQRCode = new GenerQRCodeUI();

        new CheckCode();
    };

    return re;

}, {requires: ['tc/mods/promotions/vir-ui',
    'tc/mods/point/ui',
    'tc/mods/winPoints/showWinPoint-ui',
    'tc/mods/winPoints/winPoint-ui',
    'tc/mods/authentication/ui',
    'tc/mods/warning-popup/ui',
    'tc/mods/itemInfo/ui',
    'tc/mods/quantity/normal-ui',
    'tc/mods/generQRCode/ui',
    'tc/mods/memo/ui',
    'tc/mods/payForAnother/ui',
    'tc/mods/realPay/ui',
    'tc/mods/submit/ui',
    'tc/mods/checkCode/ui',
    'tc/mods/totalFee/ui',
    'tc/mods/point/fullPointPay-ui',
    'tc/mods/totalPointPay/ui']
});
