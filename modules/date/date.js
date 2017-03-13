/** 
 * 时间对象的格式化; 
 */
;Date.prototype.Format = function(format) {
    /* 
     * 使用例子:format="yyyy-MM-dd hh:mm:ss"; 
     */
    var o = {
        "M+": this.getMonth() + 1, // month  
        "d+": this.getDate(), // day  
        "h+": this.getHours(), // hour  
        "m+": this.getMinutes(), // minute  
        "s+": this.getSeconds(), // second  
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter  
        "S": this.getMilliseconds() // millisecond  
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

;F.date = function(cfg) {
    /*
    ele:'',
    event:'',
    format:'yyyy-mm-dd',
    minDate:'2014-12-10',
    maxDate:'2016-12-10',
    time:true,//是否显示时分秒
    today:true,//是否显示当前日期
    iconHoliday:true,//显示节假日图标
    legal:true, //是否去除法定节假日、包含周末(默认否)
    disables:[],//休息的时间
    allows:[],//上班的时间
    selected:fn //选择日期后调用
    */
    //参数继承
    cfg = $.extend(true, {
        event: 'click',
        format: 'yyyy-MM-dd',
        minDate: '1900-01-01',
        maxDate: '2999-12-31',
        time: false,
        today: false,
        legal: false,
        iconHoliday: false
    }, cfg);

    //当前日期
    var Dates = {},
        nowDate = new Date(),
        nowTime = nowDate.getTime(),
        nowYear = nowDate.getFullYear(),
        nowMonth = nowDate.getMonth() + 1,
        nowDay = nowDate.getDate(),
        nowHour = nowDate.getHours(),
        nowMinute = nowDate.getMinutes(),
        nowSecond = nowDate.getSeconds();

    var old_selected; //保存上次选择的日期
    //最大、最小日期
    var cfgMinDate = new Date(cfg.minDate);
    var cfgMaxDate = new Date(cfg.maxDate);
    Dates.css='';//全局样式对象
    //判断小于10加0
    nowMonth = nowMonth < 10 ? '0' + nowMonth : nowMonth;



    Dates.id="F_date_"+Math.random().toString().substr(2);

    //禁止直接输入
    $(cfg.ele).attr('readonly', true);
    //显示时间插件
    Dates.showDate = function(T) {
        var htmlDate = '',
            Time = '<div class="F-ui-date-time">'; //时分秒
        var year;
        var month;
        var Hours = 0;
        var Minutes = 0;
        var Seconds = 0;
        if (T) {
            var defindDate = new Date(T);
            year = defindDate.getFullYear();
            month = defindDate.getMonth() + 1;
            Hours = defindDate.getHours();
            Minutes = defindDate.getMinutes();
            Seconds = defindDate.getSeconds();
        } else {
            //判断最大日期和最小日期相对于当前日期
            if (new Date(cfg.minDate).getTime() > nowTime) {
                var minDate = new Date(cfg.minDate);
                year = minDate.getFullYear();
                month = minDate.getMonth() + 1;
                Hours = minDate.getHours();
                Minutes = minDate.getMinutes();
                Seconds = minDate.getSeconds();
                T = minDate.getTime();
            }
            if (new Date(cfg.maxDate).getTime() < nowTime) {
                var maxDate = new Date(cfg.maxDate);
                year = maxDate.getFullYear();
                month = maxDate.getMonth() + 1;
                Hours = maxDate.getHours();
                Minutes = maxDate.getMinutes();
                Seconds = maxDate.getSeconds();
                T = maxDate.getTime();
            }
        }

        //是否显示时分秒
        if (cfg.time) {
            Time += '<ul id="date_hms" class="hms">' + '<li class="title">时间</li>' + '<li><input readonly="" id="date_hour" value="' + (Hours < 10 ? ('0' + Hours) : Hours) + '">:</li>' + '<li><input readonly="" id="date_minute" value="' + (Minutes < 10 ? ('0' + Minutes) : Minutes) + '">:</li>' + '<li><input readonly="" id="date_second" value="' + (Seconds < 10 ? ('0' + Seconds) : Seconds) + '"></li>' + '</ul>';
        }
        Time += '<div class="time-btn">';
        if (cfg.today) {
            Time += '<a id="date_today">今天</a>';
        }
        Time += '<a id="date_ok" class="">确认</a></div></div>';


        month && (month = month < 10 ? '0' + month : month);

        htmlDate += '<div  id="'+Dates.id+'" class="F-ui-date">' + '<div id="year"><i class="iconfont" id="yearReduce">&#xe725;</i><span>' + (year || nowYear) + '年</span><i id="yearAdd" class="iconfont">&#xe726;</i></div>' + '<div id="month"><i id="monthReduce" class="iconfont">&#xe725;</i><span>' + (month || nowMonth) + '月</span><i id="monthAdd" class="iconfont">&#xe726;</i></div>' + '<table cellpadding="0" cellspacing="0">' + '<thead>' + '<tr>' + '<th class="week">日</th>' + '<th class="">一</th>' + '<th class="">二</th>' + '<th class="">三</th>' + '<th class="">四</th>' + '<th class="">五</th>' + '<th class="week">六</th>' + '</tr>' + '</thead>' + '<tbody id="date-body">' + '</tbody>' + '</table>' + Time + '</div>';

        if ($('.F-ui-date').length) {
            $('.F-ui-date').remove();
        }

        $("body").append(htmlDate);
        //更新时间内容布局
        Dates.updataDate(T);
        $("#"+Dates.id).css(Dates.css);
    }

    //更新时间内容table
    Dates.updataDate = function(T) {
        var htmlday = '<tr>',
            date,
            year,
            month,
            day,
            days, //当前月的天数
            weeks, //当前月第一天星期几
            lastdays; //上月天数

        var slectedDate; //已经选择的日期
        //获取某个月的总天数
        function getDayS(year, month) {
            var date = new Date(year, month, 0); //0 其实是代表上个月的最后一天，这样就算出来了上个月的总天数
            return date.getDate();
        }

        //获取某个月的第一天是星期几
        function getWeekS(year, month) {
            var date = new Date(year, month, 1);
            return date.getDay();
        }

        //节假日添加图标
        function checkFestival(y, m, d) {
            var str = '';
            if (cfg.iconHoliday) {
                switch (m) {
                    case 1:
                        switch (d) {
                            case 1:
                                str += checkWeek(y, m, d) + ' newYear '
                                break;
                            case 27:
                                str += checkWeek(y, m, d) + ' spring '
                                break;
                        }
                        break;
                    case 2:
                        switch (d) {
                            case 14:
                                str += checkWeek(y, m, d) + ' heat '
                                break;
                        }
                        break;
                    case 3:
                        switch (d) {
                            case 8:
                                str += checkWeek(y, m, d) + ' woman '
                                break;
                        }
                        break;
                    case 4:
                        switch (d) {
                            case 1:
                                str += checkWeek(y, m, d) + ' fool '
                                break;
                            case 4:
                                str += checkWeek(y, m, d) + ' qingming  '
                                break;
                        }
                        break;
                    case 5:
                        switch (d) {
                            case 1:
                                str += checkWeek(y, m, d) + ' labor  '
                                break;
                            case 4:
                                str += checkWeek(y, m, d) + ' youth   '
                                break;
                            case 30:
                                if (y == nowYear) {
                                    str += checkWeek(y, m, d) + ' dragon  '
                                }
                                break;
                        }
                        break;
                    case 6:
                        switch (d) {
                            case 1:
                                str += checkWeek(y, m, d) + ' children  '
                                break;
                        }
                        break;
                    case 7:
                        switch (d) {
                            case 1:
                                str += checkWeek(y, m, d) + ' party  '
                                break;
                        }
                        break;
                    case 8:
                        switch (d) {
                            case 1:
                                str += checkWeek(y, m, d) + ' army   '
                                break;
                        }
                        break;
                    case 9:
                        switch (d) {
                            case 3:
                                str += checkWeek(y, m, d) + ' counter  '
                                break;
                            case 10:
                                str += checkWeek(y, m, d) + ' teacher   '
                                break;
                        }
                        break;
                    case 10:
                        switch (d) {
                            case 1:
                                str += checkWeek(y, m, d) + ' national  '
                                break;
                        }
                        break;
                    case 11:
                        switch (d) {
                            case 11:
                                str += checkWeek(y, m, d) + ' ruffian  '
                                break;
                        }
                        break;
                    case 12:
                        switch (d) {
                            case 24:
                                str += checkWeek(y, m, d) + ' safety  '
                                break;
                            case 25:
                                str += checkWeek(y, m, d) + ' christmas  '
                                break;
                        }
                        break;
                }
            }
            if (cfg.disables) {
                $(cfg.disables).each(function(index) {
                    var start = Date.parse(cfg.disables[index]['start'].replace(/-/g, '/'));
                    var end = Date.parse(cfg.disables[index]['end'].replace(/-/g, '/'));
                    if (new Date(y, (m - 1), d).getTime() >= new Date(start).getTime() && new Date(y, (m - 1), d).getTime() <= new Date(end).getTime()) {
                        str += ' disable rest ';
                        return false;
                    }
                });
            }
            return str;
        }

        //检查一个日期是否双休
        function checkWeek(y, m, d) {
            var date = new Date(y, m - 1, d);
            var day = date.getDay();
            if (cfg.legal && (day == 0 || day == 6)) {
                return ' disable ';
            } else {
                return '';
            }
        }

        //检查是否节假日
        function checkRest(y, m, d) {
            var str = checkFestival(y, m, d);
            if (((weeks + d) % 7 == 1) || ((weeks + d) % 7 == 0)) {
                if (cfg.legal) {
                    if (cfg.allows && cfg.allows.indexOf(y + '-' + m + '-' + d) >= 0) { //特殊的加班周末
                        return 'work';
                    } else {
                        return ' disable ' + str;
                    }
                } else {
                    return str;
                }
            } else {
                return str;
            }
        }
        //检查上个月填充是否双休
        function checkRestUp(y, m, d, z) {
            var str = checkFestival(y, m, d);
            if ((z + 1) == weeks) {
                if (cfg.legal) {
                    if (cfg.allows && cfg.allows.indexOf(y + '-' + m + '-' + d) >= 0) { //特殊的加班周末
                        return 'work';
                    } else {
                        return ' disable ' + str;
                    }
                } else {
                    return str;
                }

            } else {
                return str;
            }
        }
        //检查下个月填充是否双休
        function checkRestDown(y, m, d) {
            var str = checkFestival(y, m, d);
            if (((days + weeks) % 7 + d) % 7 == 0) {
                if (cfg.legal) {
                    if (cfg.allows && cfg.allows.indexOf(y + '-' + m + '-' + d) >= 0) { //特殊的加班周末
                        return 'work';
                    } else {
                        return ' disable ' + str;
                    }
                } else {
                    return str;
                }
            } else {

                return str;
            }
        }

        date = new Date();
        if (typeof(T) == 'string') {
            date = new Date(Date.parse(T.replace(/-/g, "/")));
        } else if (typeof(T) == 'number') {
            date = new Date(T);
        }

        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();

        //获取目标元素已经有的值
        if (old_selected) {
            slectedDate = new Date(old_selected);
        } else {
            slectedDate = new Date();
        }



        days = getDayS(year, month);
        lastdays = getDayS(year, month - 1);
        weeks = getWeekS(year, month - 1);

        //上月补齐
        for (var j = weeks; j--;) {
            if ((parseInt($("#year span").html()) == parseInt(cfgMinDate.getFullYear()) && parseInt($("#month span").html()) == parseInt(cfgMinDate.getMonth() + 1))) {
                htmlday += '<td data-date="' + year + '-' + (month - 1) + '-' + (lastdays - j) + '"><a href="javascript:void(0);" class="lastMonth disable ' + checkRestUp(year, month - 1, lastdays - j, j) + '">' + (lastdays - j) + '</a><span></span></td>';
            } else {
                htmlday += '<td data-date="' + year + '-' + (month - 1) + '-' + (lastdays - j) + '"><a href="javascript:void(0);" class="lastMonth ' + checkRestUp(year, month - 1, lastdays - j, j) + '">' + (lastdays - j) + '</a><span></span></td>';
            }
        }

        //循环当前月份部分
        //ps:中间部分主要是为了判断界限 做了很多的判断，感觉有点乱，以后思考哈有没有更好的方法！
        for (var i = 1; i <= days; i++) {
            //当前选中日期
            if (i === (slectedDate.getDate()) && (parseInt($("#month span").html()) == parseInt(slectedDate.getMonth() + 1)) && (parseInt($("#year span").html()) == parseInt(slectedDate.getFullYear()))) {
                htmlday += '<td data-date="' + year + '-' + month + '-' + i + '"><a href="javascript:void(0);" class="selected ' + checkRest(year, month, i) + '">' + i + '</a><span></span></td>';
                //当前日期(判断日期是否可选)
            } else if (!old_selected && i === nowDay && (parseInt($("#month span").html()) == parseInt(nowMonth)) && (parseInt($("#year span").html()) == parseInt(nowYear))) {
                htmlday += '<td data-date="' + year + '-' + month + '-' + i + '"><a href="javascript:void(0);" class="selected ' + checkRest(year, month, i) + '">' + i + '</a><span></span></td>';
            } else if (parseInt($("#year span").html()) > parseInt(cfgMinDate.getFullYear()) && parseInt($("#year span").html()) < parseInt(cfgMaxDate.getFullYear())) {
                htmlday += '<td data-date="' + year + '-' + month + '-' + i + '"><a href="javascript:void(0);" class=" ' + checkRest(year, month, i) + '">' + i + '</a><span></span></td>';
            } else if (parseInt($("#year span").html()) == parseInt(cfgMinDate.getFullYear())) {
                if (parseInt($("#month span").html()) > parseInt(cfgMinDate.getMonth() + 1)) {
                    htmlday += '<td data-date="' + year + '-' + month + '-' + i + '"><a href="javascript:void(0);" class=" ' + checkRest(year, month, i) + '">' + i + '</a><span></span></td>';
                } else if (parseInt($("#month span").html()) == parseInt(cfgMinDate.getMonth() + 1)) {
                    if (i >= parseInt(cfgMinDate.getDate()) && i <= parseInt(cfgMaxDate.getDate())) {
                        htmlday += '<td data-date="' + year + '-' + month + '-' + i + '"><a href="javascript:void(0);" class=" ' + checkRest(year, month, i) + '">' + i + '</a><span></span></td>';
                    } else {
                        htmlday += '<td data-date="' + year + '-' + month + '-' + i + '"><a href="javascript:void(0);" class="disable">' + i + '</a></td>';
                    }
                }
            } else if (parseInt($("#year span").html()) == parseInt(cfgMaxDate.getFullYear())) {
                if (parseInt($("#month span").html()) < parseInt(cfgMaxDate.getMonth() + 1)) {
                    htmlday += '<td data-date="' + year + '-' + month + '-' + i + '"><a href="javascript:void(0);" class=" ' + checkRest(year, month, i) + '">' + i + '</a><span></span></td>';
                } else if (parseInt($("#month span").html()) == parseInt(cfgMaxDate.getMonth() + 1)) {
                    if (i >= parseInt(cfgMinDate.getDate()) && i <= parseInt(cfgMaxDate.getDate())) {
                        htmlday += '<td data-date="' + year + '-' + month + '-' + i + '"><a href="javascript:void(0);" class=" ' + checkRest(year, month, i) + '">' + i + '</a><span></span></td>';
                    } else {
                        htmlday += '<td data-date="' + year + '-' + month + '-' + i + '"><a href="javascript:void(0);" class="disable">' + i + '</a></td>';
                    }
                }
            } else {
                htmlday += '<td data-date="' + year + '-' + month + '-' + i + '"><a href="javascript:;" class="disable">' + i + '</a></td>';
            }
            if ((i + weeks) % 7 == 0) {
                htmlday += '</tr><tr>';
            }
        }

        //补齐表格（下月）
        if ((days + weeks) % 7) {
            for (var i = 1; i <= (7 - (days + weeks) % 7); i++) {
                if (parseInt($("#year span").html()) == parseInt(cfgMaxDate.getFullYear()) && parseInt($("#month span").html()) == parseInt(cfgMaxDate.getMonth() + 1)) {
                    htmlday += '<td data-date="' + year + '-' + (month + 1) + '-' + i + '"><a href="javascript:;" class="nextMonth disable ' + checkRestDown(year, month + 1, i) + '">' + i + '</a><span></span></td>';
                } else {
                    htmlday += '<td data-date="' + year + '-' + (month + 1) + '-' + i + '"><a href="javascript:;" class="nextMonth ' + checkRestDown(year, month + 1, i) + '">' + i + '</a><span></span></td>';
                }
            }
        }
        htmlday += '</tr>';
        $("#date-body").html(htmlday);
    }



    
    //减少年限
    $(document).on('click', "#"+Dates.id+' #yearReduce', function() {
        $("#yearAdd").css('color', '#000');
        $("#yearReduce").css('color', '#000');
        //判断是否是界限
        if (parseInt($("#year span").html()) == parseInt(cfgMinDate.getFullYear()) + 1) {
            $("#month span").html(((parseInt(cfgMinDate.getMonth()) + 1) < 10 ? '0' + (parseInt(cfgMinDate.getMonth()) + 1) : (parseInt(cfgMinDate.getMonth()) + 1)) + '月');
        }
        if (parseInt($("#year span").html()) - 1 <= parseInt(cfgMinDate.getFullYear())) {
            $("#yearReduce").css('color', '#aaa');
        }
        if (parseInt($("#year span").html()) <= parseInt(cfgMinDate.getFullYear())) {
            return;
        }
        $("#year span").html(parseInt($("#year span").html()) - 1 + '年');
        Dates.updataDate(parseInt($("#year span").html()) + '-' + parseInt($("#month span").html()) + '-01');
    });
    //添加年限
    $(document).on('click', "#"+Dates.id+' #yearAdd', function() {
        $("#yearReduce").css('color', '#000');
        $("#yearAdd").css('color', '#000');
        //判断是否是界限
        if (parseInt($("#year span").html()) == parseInt(cfgMaxDate.getFullYear()) - 1) {
            $("#month span").html(((parseInt(cfgMaxDate.getMonth()) + 1) < 10 ? '0' + (parseInt(cfgMaxDate.getMonth()) + 1) : (parseInt(cfgMaxDate.getMonth()) + 1)) + '月');
        }
        if (parseInt($("#year span").html()) + 1 >= parseInt(cfgMaxDate.getFullYear())) {
            $("#yearAdd").css('color', '#aaa');
        }
        if (parseInt($("#year span").html()) >= parseInt(cfgMaxDate.getFullYear())) {
            return;
        }
        $("#year span").html(parseInt($("#year span").html()) + 1 + '年');
        Dates.updataDate(parseInt($("#year span").html()) + '-' + parseInt($("#month span").html()) + '-01');
    });
    //点击年份出现的列表
    $(document).on('click', "#"+Dates.id+' #year span', function() {
        $("#monthList").remove();
        var htmlyear = '<div class="selectList" id="yearList"><ul>';
        for (var i = 1900; i < 2999; i++) {
            if (i >= cfgMinDate.getFullYear() && i <= cfgMaxDate.getFullYear()) {
                htmlyear += '<li class="select">' + i + '年</li>';
            } else {
                htmlyear += '<li>' + i + '年</li>';
            }
        }
        htmlyear += "</ul></div>";
        if ($("#yearList").length == 0) {
            $("#"+Dates.id).append(htmlyear);
        }
        var scrollTop = (parseInt($("#year span").html()) - 1900) * 25;
        $("#yearList ul").scrollTop(scrollTop);
    });
    //选择列表一个年限
    $(document).on('click', "#"+Dates.id+' #yearList li', function() {
        if ($(this).attr('class')) {
            $("#year span").html($(this).html());
            Dates.updataDate(parseInt($("#year span").html()) + '-' + parseInt($("#month span").html()) + '-01');
        }
        $("#yearList").remove();
    })

    //减少月份
    $(document).on('click', "#"+Dates.id+' #monthReduce', function() {
        $("#monthReduce").css('color', '#000');
        $("#monthAdd").css('color', '#000');
        //判断是否是界限
        if (parseInt($("#year span").html()) == parseInt(cfgMinDate.getFullYear())) {
            if (parseInt($("#month span").html()) <= parseInt(cfgMinDate.getMonth()) + 1) {
                $("#month span").html(((parseInt(cfgMinDate.getMonth()) + 2) < 10 ? '0' + (parseInt(cfgMinDate.getMonth()) + 2) : (parseInt(cfgMinDate.getMonth()) + 2)) + '月');
                $("#monthReduce").css('color', '#999');
            }
        } else if (parseInt($("#month span").html()) <= 1 && (parseInt(cfgMinDate.getFullYear()) <= parseInt($("#year span").html()) - 1)) {
            $("#year span").html(parseInt($("#year span").html()) - 1 + '年');
            $("#month span").html("13");
        } else if (parseInt($("#month span").html()) <= 1) {
            $("#monthReduce").css('color', '#999');
            return;
        }
        $("#month span").html(((parseInt($("#month span").html()) - 1) < 10 ? '0' + (parseInt($("#month span").html()) - 1) : (parseInt($("#month span").html()) - 1)) + '月');
        Dates.updataDate(parseInt($("#year span").html()) + '-' + parseInt($("#month span").html()) + '-01');
    });
    //添加月份
    $(document).on('click', "#"+Dates.id+' #monthAdd', function() {
        $("#monthReduce").css('color', '#000');
        $("#monthAdd").css('color', '#000');
        //判断是否是界限
        if (parseInt($("#year span").html()) == parseInt(cfgMaxDate.getFullYear())) {
            $("#month span").html(((parseInt(cfgMaxDate.getMonth())) < 10 ? '0' + (parseInt(cfgMaxDate.getMonth())) : (parseInt(cfgMaxDate.getMonth()))) + '月');
            $("#monthAdd").css('color', '#999');
        } else if (parseInt($("#month span").html()) >= 12 && (parseInt(cfgMaxDate.getFullYear()) >= parseInt($("#year span").html()) + 1)) {
            $("#year span").html(parseInt($("#year span").html()) + 1 + '年');
            $("#month span").html("0");
        } else if (parseInt($("#month span").html()) >= 12) {
            $("#monthAdd").css('color', '#999');
            return;
        }
        $("#month span").html(((parseInt($("#month span").html()) + 1) < 10 ? '0' + (parseInt($("#month span").html()) + 1) : (parseInt($("#month span").html()) + 1)) + '月');
        Dates.updataDate(parseInt($("#year span").html()) + '-' + parseInt($("#month span").html()) + '-01');
    });

    //点击月份出现的列表
    $(document).on('click', "#"+Dates.id+' #month span', function() {
        $("#yearList").remove();
        var htmlyear = '<div class="selectList" id="monthList"><ul>';
        for (var i = 1; i < 13; i++) {
            //同一年的情况
            if (parseInt($("#year span").html()) == cfgMinDate.getFullYear() && parseInt($("#year span").html()) == cfgMaxDate.getFullYear()) {
                if (i >= cfgMinDate.getMonth() + 1 && i <= cfgMaxDate.getMonth() + 1) {
                    htmlyear += '<li class="select">' + (i < 10 ? '0' + i : i) + '月</li>';
                } else {
                    htmlyear += '<li>' + (i < 10 ? '0' + i : i) + '月</li>';
                }
                //最小年限
            } else if (parseInt($("#year span").html()) == cfgMinDate.getFullYear()) {
                if (i >= cfgMinDate.getMonth() + 1) {
                    htmlyear += '<li class="select">' + (i < 10 ? '0' + i : i) + '月</li>';
                } else {
                    htmlyear += '<li>' + (i < 10 ? '0' + i : i) + '月</li>';
                }
                //最大年限
            } else if (parseInt($("#year span").html()) == cfgMaxDate.getFullYear()) {
                if (i <= cfgMaxDate.getMonth() + 1) {
                    htmlyear += '<li class="select">' + (i < 10 ? '0' + i : i) + '月</li>';
                } else {
                    htmlyear += '<li>' + (i < 10 ? '0' + i : i) + '月</li>';
                }
                //中间
            } else if (parseInt($("#year span").html()) > cfgMinDate.getFullYear() && parseInt($("#year span").html()) < cfgMaxDate.getFullYear()) {
                htmlyear += '<li class="select">' + (i < 10 ? '0' + i : i) + '月</li>';
            } else {
                htmlyear += '<li>' + (i < 10 ? '0' + i : i) + '月</li>';
            }
        }
        htmlyear += "</ul></div>";
        if ($("#monthList").length == 0) {
            $("#"+Dates.id).append(htmlyear);
        }
        var scrollTop = (parseInt($("#month span").html()) - 1) * 25;
        $("#monthList ul").scrollTop(scrollTop);
    });

    //选择列表一个月份
    $(document).on('click', "#"+Dates.id+' #monthList li', function() {
        if ($(this).attr('class')) {
            $("#month span").html($(this).html());
            Dates.updataDate(parseInt($("#year span").html()) + '-' + parseInt($(this).html()) + '-01');
        }
        $("#monthList").remove();
    })

    /**
     * 选择弹出框
     * @param {str} [type] [弹出类型(时、分、秒)]
     * @return null
     */
    function selectAlert(type) {
        var htmlyear = '<div class="selectList" id="' + type + 'List"><ul>';
        switch (type) {
            case 'hour':
                if (parseInt($("#year span").html()) == parseInt(cfgMinDate.getFullYear()) && parseInt($("#month span").html()) == parseInt(cfgMinDate.getMonth()) + 1 && parseInt($("#date-body td a.selected").html()) == parseInt(cfgMinDate.getDate())) {
                    for (var i = 0; i < 24; i++) {
                        if (i >= cfgMinDate.getHours()) {
                            htmlyear += '<li class="select">' + (i < 10 ? ('0' + i) : i) + '时</li>';
                        } else {
                            htmlyear += '<li>' + (i < 10 ? ('0' + i) : i) + '时</li>';
                        }
                    }
                } else if (parseInt($("#year span").html()) == parseInt(cfgMaxDate.getFullYear()) && parseInt($("#month span").html()) == parseInt(cfgMaxDate.getMonth()) + 1 && parseInt($("#date-body td a.selected").html()) == parseInt(cfgMaxDate.getDate())) {
                    for (var i = 0; i < 24; i++) {
                        if (i <= cfgMaxDate.getHours()) {
                            htmlyear += '<li class="select">' + (i < 10 ? ('0' + i) : i) + '时</li>';
                        } else {
                            htmlyear += '<li>' + (i < 10 ? ('0' + i) : i) + '时</li>';
                        }
                    }
                } else {
                    for (var i = 0; i < 24; i++) {
                        htmlyear += '<li class="select">' + (i < 10 ? ('0' + i) : i) + '时</li>';
                    }
                }

                break;
            case 'minute':
                if (parseInt($("#year span").html()) == parseInt(cfgMinDate.getFullYear()) && parseInt($("#month span").html()) == parseInt(cfgMinDate.getMonth()) + 1 && parseInt($("#date-body td a.selected").html()) == parseInt(cfgMinDate.getDate()) && parseInt($("#date_hour").val()) == parseInt(cfgMinDate.getHours())) {
                    for (var i = 0; i < 60; i++) {
                        if (i >= cfgMinDate.getMinutes()) {
                            htmlyear += '<li class="select">' + (i < 10 ? ('0' + i) : i) + '分</li>';
                        } else {
                            htmlyear += '<li>' + (i < 10 ? ('0' + i) : i) + '分</li>';
                        }
                    }
                } else if (parseInt($("#year span").html()) == parseInt(cfgMaxDate.getFullYear()) && parseInt($("#month span").html()) == parseInt(cfgMaxDate.getMonth()) + 1 && parseInt($("#date-body td a.selected").html()) == parseInt(cfgMaxDate.getDate()) && parseInt($("#date_hour").val()) == parseInt(cfgMaxDate.getHours())) {
                    for (var i = 0; i < 60; i++) {
                        if (i <= cfgMaxDate.getMinutes()) {
                            htmlyear += '<li class="select">' + (i < 10 ? ('0' + i) : i) + '分</li>';
                        } else {
                            htmlyear += '<li>' + (i < 10 ? ('0' + i) : i) + '分</li>';
                        }
                    }
                } else {
                    for (var i = 0; i < 60; i++) {
                        htmlyear += '<li class="select">' + (i < 10 ? ('0' + i) : i) + '分</li>';
                    }
                }

                break;
            case 'second':
                for (var i = 0; i < 60; i++) {
                    htmlyear += '<li class="select">' + (i < 10 ? ('0' + i) : i) + '秒</li>';
                }
                break;
        }

        htmlyear += "</ul></div>";
        if ($("#" + type + "List").length == 0) {
            $("#"+Dates.id).append(htmlyear);
        }
        var scrollTop = (parseInt($("#date_" + type + "").val())) * 25;
        $(".hourList ul").scrollTop(scrollTop);
    }

    //点击时间出现的列表（小时）
    $(document).on('click', "#"+Dates.id+' #date_hour', function() {
        $("#minuteList").remove();
        $("#secondList").remove();
        selectAlert('hour');
    });
    //点击时间出现的列表（小时）
    $(document).on('click', "#"+Dates.id+' #date_minute', function() {
        $("#hourList").remove();
        $("#secondList").remove();
        selectAlert('minute');
    });
    //点击时间出现的列表（小时）
    $(document).on('click', "#"+Dates.id+' #date_second', function() {
        $("#hourList").remove();
        $("#minuteList").remove();
        selectAlert('second');
    });

    //选择一个时间
    $(document).on('click', "#"+Dates.id+' #hourList li', function() {
        $("#date_hour").val($(this).html().replace('时', ''));
    })
    $(document).on('click', "#"+Dates.id+' #minuteList li', function() {
        $("#date_minute").val($(this).html().replace('分', ''));
    })
    $(document).on('click', "#"+Dates.id+' #secondList li', function() {
        $("#date_second").val($(this).html().replace('秒', ''));
    })

    //选择列表一个年限
    $(document).on('click', "#"+Dates.id+' #yearList li', function() {
        if ($(this).attr('class')) {
            if (parseInt($(this).html()) == parseInt(cfgMinDate.getFullYear())) {
                $("#month span").html(((parseInt(cfgMinDate.getMonth()) + 1) < 10 ? '0' + (parseInt(cfgMinDate.getMonth()) + 1) : (parseInt(cfgMinDate.getMonth()) + 1)) + '月');
            }
            if (parseInt($(this).html()) == parseInt(cfgMaxDate.getFullYear())) {
                $("#month span").html(((parseInt(cfgMaxDate.getMonth()) + 1) < 10 ? '0' + (parseInt(cfgMaxDate.getMonth()) + 1) : (parseInt(cfgMaxDate.getMonth()) + 1)) + '月');
            }
            Dates.updataDate(parseInt($(this).html()) + '-' + parseInt($("#month span").html()) + '-01');
        }
        $("#yearList").remove();
    })


     //删除界面上年、月列表
    $(document).click(function(e) {
        var e = e || window.event; //浏览器兼容性 
        var elem = e.target || e.srcElement;
        if (elem.innerHTML.indexOf('月') == -1 && elem.innerHTML.indexOf('年') == -1) {
            $("#monthList").remove();
            $("#yearList").remove();
        }
        if (elem.id.indexOf('date_hour') == -1 && elem.id.indexOf('date_minute') == -1 && elem.id.indexOf('date_second') == -1) {
            $("#hourList").remove();
            $("#minuteList").remove();
            $("#secondList").remove();
        }

        if (elem.tagName == 'HTML') {
            $("#"+Dates.id).remove();
        }
    })

    //选择日期
    $(document).on("click", "#"+Dates.id+" #date-body td a", function() {
        if ($(this).attr("class").indexOf('disable') < 0) {
            if (cfg.time) {
                old_selected = $(this).parent().attr("data-date") + "  " + $("#date_hour").val() + ':' + $("#date_minute").val() + ':' + $("#date_second").val();
                old_selected = Date.parse(old_selected.replace(/-/g, '/'));
                Dates.showDate(old_selected);
               
            } else {
                old_selected = $(this).parent().attr("data-date");
                old_selected = Date.parse(old_selected.replace(/-/g, '/'));
                $(cfg.ele).val(new Date(old_selected).Format(cfg.format));
                cfg.selectedFn && cfg.selectedFn(old_selected);
                $("#"+Dates.id).remove();
            }

        }
    });

    //有时分秒的话 点击确认再销毁
    $(document).on("click", "#"+Dates.id+" #date_ok", function() {
        if (parseInt($("#date-body td a.selected").html())) {
            old_selected = parseInt($("#year span").html()) + '-' + parseInt($("#month span").html()) + '-' + parseInt($("#date-body td a.selected").html()) + "  " + $("#date_hour").val() + ':' + $("#date_minute").val() + ':' + $("#date_second").val();
            old_selected = Date.parse(old_selected.replace(/-/g, '/'));
        } else {
            old_selected = new Date();
        }
        $(cfg.ele).val(new Date(old_selected).Format(cfg.format));
        cfg.selectedFn && cfg.selectedFn(new Date(old_selected));
        $("#"+Dates.id).remove();

    })


    //点击回到今天
    $(document).on("click", "#"+Dates.id+" #date_today", function() {
        old_selected = new Date();
        $(cfg.ele).val(new Date().Format(cfg.format));
        cfg.selectedFn && cfg.selectedFn(new Date());
        $("#"+Dates.id).remove();
    })

  


    //整个日期组件入口
    $(cfg.ele).on(cfg.event, function() {
    	var offset = $(this).offset();
    	Dates.css = {
        	top:offset.top+$(this).height(),
        	left:offset.left,
        	bottom:'auto',
        	right:'auto'
        }
        if (!$("#"+Dates.id).length) {
            if ($(cfg.ele).val()) {
                Dates.showDate(old_selected);
            } else {
                Dates.showDate();
            }
        }
    });

  
}


//静态方法 获取当前时间
//s：+/-天数
F.date.now = function(s) {
    return new Date().getTime() + s * 86400000;
}