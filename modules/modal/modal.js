;F.modal = function(cfg) {
    /*
    title:'',//标题
    content:'',//内容
    style:'',//样式
    mask:true,//是否遮罩
    FIndex:0,//当前弹窗的层次
    position:[0,1,2,3,4,5,6,7,8],
    time:0,//自动关闭时间
    fixedWidth:true,//是否固定宽度
    cls:'name',//class名字
    btn:['确定','取消'],
    btnFns:[fn],//函数数组 和btn 一一对应
    success:fn//加载成功函数
    */
    var cfg = cfg || {},
        w, //元素宽
        h, //元素高
        sw, //实际宽
        sh, //实际高
        pw = $(document).width(), //屏幕宽
        ph = $(document).height(), //屏幕高
        close = '', //关闭按钮
        btns = '',
        style = '', //行内样式
        cls = '', //class名称
        Flay = {};

    cfg = $.extend(true, {
        mask: true, //是否遮罩
        position: 0,
        time: 0,
        FIndex:0
    }, cfg);


    cfg.btn && $(cfg.btn).each(function(item) {
        btns += '<a herf="javascipt:void(0);">' + this + '</a>'
    })


    Flay.id = 'F_ui_' + Math.random().toString().substr(2);
    Flay.ele = $('<div class="F-ui-modal" id="' + Flay.id + '" style="z-index:' + (cfg.FIndex+ 2) + '"></div>');
    Flay.mask = $('<div class="mask" id="mask_' + Flay.id + '" style="z-index:' + (cfg.FIndex+ 1) + '"></div>');

    cfg.btn || (close = '<span class="iconfont">&#xe644;</span>');
    cfg.style && (style = cfg.style);
    cfg.cls && (cls = cfg.cls);
    cfg.title && Flay.ele.append('<h1>' + close + cfg.title + '</h1>');
    cfg.content && Flay.ele.append('<div class="modal-content ' + cls + '" style="' + style + '">' + cfg.content + '</div>');
    cfg.btn && Flay.ele.append('<div class="btn">' + btns + '</div>');

    $("body").append(Flay.ele);
    cfg.mask && ($("body").append(Flay.mask));

    //居中
    w = $("#" + Flay.id).width();
    h = $("#" + Flay.id).height();
    //sh = h;
    sw = cfg.fixedWidth ? pw * 0.8 : w;
    //sh = cfg.fixedWidth && ph*0.8;
    switch (cfg.position) {
        case 1:
            Flay.ele.css({
                width: sw + 'px',
                top: 0,
                left: 0
            });
            break;
        case 2:
            Flay.ele.css({
                width: sw + 'px',
                top: 0,
                left: '50%',
                marginLeft: -(sw / 2)
            });
            break;

        case 3:
            Flay.ele.css({
                width: sw + 'px',
                right: 0,
                top: 0
            });
            break;

        case 4:
            Flay.ele.css({
                width: sw + 'px',
                marginLeft: -(sw / 2),
                marginTop: -(h / 2)
            });
            break;

        case 5:
            Flay.ele.css({
                width: sw + 'px',
                bottom: 0,
                right: 0
            });
            break;

        case 6:
            Flay.ele.css({
                width: sw + 'px',
                marginLeft: -(sw / 2),
                left: '50%',
                bottom: 0
            });
            break;

        case 7:
            Flay.ele.css({
                width: sw + 'px',
                bottom: 0,
                left: 0
            });
            break;

        case 8:
            Flay.ele.css({
                width: sw + 'px',
                left: 0,
                top: '50%',
                marginTop: -(h / 2)
            });
            break;

        default:
            Flay.ele.css({
                width: sw + 'px',
                left: '50%',
                top: '50%',
                marginLeft: -(sw / 2),
                marginTop: -(h / 2)
            });
            break;
    }

    //关闭函数  
    Flay.close = function(obj) {
            if (obj) {
                Flay.closeFn($(obj).parents('.F-ui-modal'));
            } else {
                Flay.closeFn($('#' + Flay.id));
            }
        }
        //具体动画函数
    Flay.closeFn = function(obj) {
        $(obj).addClass('out');
        $(obj).next('.mask').animate({ opacity: 0 }, 300);
        setTimeout(function() {
            $(obj).next('.mask').remove();
        }, 300)
        setTimeout(function() {
            $(obj).remove();
        }, 350)
    }

    //加载成功执行函数
    cfg.success && cfg.success(Flay);

    //自动关闭
    cfg.time && setTimeout(function() {
        Flay.close($("#" + Flay.id).find('>div'));
    }, cfg.time);


    $("h1>span").click(function() {
        Flay.close(this);
    });

    cfg.btnFns && $(".btn a").each(function(index) {
        $(this).click(function() {
            Flay.close(this);
            cfg.btnFns[index] && cfg.btnFns[index]();
        });
    })

}
