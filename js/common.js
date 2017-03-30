var me = {
    id: 'me', // 写死不用改
    name: decodeURIComponent(getCookie("WxNickName")) || '志明达的小伙伴', // 用户昵称
    avatar: getCookie("WxHeadImg") || 'img/avatar-me.png', // 用户头像图片 url
    userId: '', // 用户id
    registered: false // 用户是否已经记录信息
};
var _userName = me.name;
var _inputName = '';
var _inputPhone = '';
var _dialog = {};
var _members = {};
var myTime = new Date().toLocaleTimeString().replace(/^([^\d]*\d{1,2}:\d{1,2}):\d{1,2}([^\d]*)$/, '$1$2');
var status = "";
var openid = "";

var init = (function() {
    var t = ZMD_COMMON.parseURI().params;
    status = t.status;
    openid = t.WxOpenId;
    console.log(t);
})()

function geneDialog(userName) {
    var defaultMembers = {
        zfx: {
            id: 'zfx',
            name: '川商总会小徐',
            avatar: 'img/images.jpg'
        }
    }
    _members = $.extend(_members, defaultMembers);

    //引导对话
    _dialog.d0 = [
        {
            type: 'system',
            content: myTime
        }, {
            type: 'plain',
            author: _members.zfx,
            content: '感谢您对天府论坛的关注。',
            pause: 1000
        },{
          type: 'plain',
          author: _members.zfx,
          content: '4月5日，由川商总会主办的天府论坛将在成都召开。关心四川未来发展的你，可一定不能错过哦。',
          pause: 1500
        },{
          type: 'plain',
          author: _members.zfx,
          content: '本届主题是“商业新力量，迈向新未来”——聚变与涅槃：经济驱动新引擎。届时，柳传志、刘永好、李书福、王文银等商界大咖将齐聚蓉城，论道天府。',
          pause: 2000
        },{
          type: 'plain',
          author: _members.zfx,
          content: '接受邀请，报名参加天府论坛，请回复“是”。',
          pause: 2000
        }
        // }, {
        //     type: 'plain',
        //     author: _members.zfx,
        //     content: 'xxx，您好，由川商总会主办天府论坛即将在成都召开。关心四川未来发展的你，怎么可以错过呢？',
        //     pause: 1000
        // }, {
        //     type: 'plain',
        //     author: _members.zfx,
        //     content: '本届主题是“商业新力量，迈向新未来”——聚变与涅槃：经济驱动新引擎。四川省政府领导、本土知名企业代表、国内商界领军人物及众多媒体界朋友都将参加此次盛会。期待你与他们一起，在论坛上头脑风暴哦！',
        //     pause: 1000
        // }, {
        //     type: 'plain',
        //     author: _members.zfx,
        //     content: '点击下面的邀请函图片，了解论坛更多内容，获取报名方式。',
        //     pause: 1000
        // }
    ];

    //回复海报
    _dialog.d3 = [
        {
            type: 'system'
        }, {
            type: 'plain',
            author: _members.zfx,
            content: '筑梦十年，步履不停。2017，准备好与我们一起回溯初心，并且再次出发了吗？<br />1月22日，属于所有同麓人的十年之约，我们不见不散！',
            pause: 2000
        }, {
            type: 'plain',
            author: _members.zfx,
            content: '点击下面的邀请函图片，了解论坛更多内容，获取报名方式。<i class="fa fa-hand-o-down"></i> <i class="fa fa-hand-o-down"></i> <i class="fa fa-hand-o-down"></i>',
            pause: 1500
        }, {
            type: 'picture',
            author: _members.zfx,
            content: 'img/poster-sm.png'
        }
    ];

    //回复落格
    _dialog.d4 = [
        {
            type: 'picture',
            author: _members.zfx,
            content: 'img/final-sm.png'
        }
    ]
    //回复姓名
    _dialog.name = [
        {
            type: 'system',
            content: myTime
        }, {
            type: 'plain',
            author: _members.me,
            content: ''
        }
    ];
    //回复手机
    _dialog.phone = [
        {
            type: 'plain',
            author: _members.me,
            content: 'hello'
        }
    ];
    //回复确认
    _dialog.confirm = [
        {
            type: 'plain',
            author: _members.me,
            content: 'hello'
        }
    ];
    //反馈姓名
    _dialog.r1 = [
        {
            type: 'plain',
            author: _members.zfx
        }
    ];
    //反馈手机
    _dialog.r2 = [
         {
            type: 'plain',
            author: _members.zfx,
            content: '点击下面的邀请函图片，了解论坛更多内容，获取报名方式。',
            pause: 1000

        }, {
            type: 'picture',
            author: _members.zfx,
            content: 'img/poster-sm.png'
        }
    ];
    //反馈海报
    _dialog.r3 = [
        {
            type: 'picture',
            author: _members.zfx
        }
    ];
}

$.fn.scrollSmooth = function(scrollHeight, duration) {
    var $el = this;
    var el = $el[0];
    var startPosition = el.scrollTop;
    var delta = scrollHeight - startPosition;
    var startTime = Date.now();
    function scroll() {
        var fraction = Math.min(1, (Date.now() - startTime) / duration);
        el.scrollTop = delta * fraction + startPosition + 20;
        if (fraction < 1) {
            setTimeout(scroll, 10);
        }
    }
    scroll();
};

$.fn.goSmooth = function(height, duration) {
    var $el = this;
    var startPosition = 1 * $el.css('margin-bottom').replace('px', '');
    var delta = height - startPosition;
    var startTime = Date.now();
    function scroll() {
        var fraction = Math.min(1, (Date.now() - startTime) / duration);
        $el.css('margin-bottom', delta * fraction + startPosition);
        if (fraction < 1) {
            setTimeout(scroll, 10);
        }
    }
    scroll();
};

var $chat = $('#chatContent');

function Queue() {};
Queue.prototype = {
    add: function(el) {
        if (this._last) {
            this._last = this._last._next = { //_last是不断变的
                el: el,
                _next: null //设置_last属性表示最后一个元素，并且让新增元素成为它的一个属性值
            }
        } else {
            this._last = this._first = { //我们要设置一个_first属性表示第一个元素
                el: el,
                _next: null
            }
        }
        return this;
    }
}

function copyQueue(p) {
    var queue = new Queue;
    for (var i = 0; i < p.length; i++) {
        queue.add(p[i]);
    }
    return queue;
};
function activeInput(holder) {
    $('.box_ft').find('input').prop({disabled: false, placeholder: holder});
}

function deactiveInput() {
    $('.box_ft').find('input').prop({disabled: true, placeholder: '', value: ''});
    $('.input-wrapper').removeClass('send-ready')
}
function showDialog(dialog, cb) {
    // 显示对话的时候，菜单栏不可点
    deactiveInput();

    var message = copyQueue(dialog)._first;
    var tpl = doT.template($('#messageTpl').html());

    function loop(delay) {
        // speed
        if (delay == undefined) {
            // random delay between messages
            delay = Math.random() * 1000 + 600;
            //delay = Math.random() * 50 + 50;
        }

        var timeout = setTimeout(function() {
            if (message) {
                // 显示 message
                var messageHtml = tpl([message.el]);
                $chat.append(messageHtml);
                console.log('1');
                // 自动滚动
                var viewH = $('.J_scrollContent').height();
                var contentH = $chat.height();
                if (contentH > viewH) {
                    $('.J_scrollContent').scrollSmooth(contentH - viewH + 16, 300)
                }

                // 执行附加效果
                if (message.el.flag) {
                    var flag = message.el.flag;

                    switch (flag) {
                        case 'animate-tour':
                            playTour();
                            break;
                        default:
                            break;
                    }
                }

                // 特别语句的特殊delay
                if (message.el.pause != undefined) {
                    loop(message.el.pause);
                } else {
                    loop();
                }

                // 指向下一句
                message = message._next;

            } else {
                //activeInput();
                clearTimeout(timeout);
                cb && cb();
            }
        }, delay);
    };

    loop(0);
};

$(function() {
    if (judge.platform() == "ios") {
        var str = "<style> body{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif!important;}</style>";
        $('head').append(str);
    }
    if (judge.platform() == "android") {
        var str = "<style>body{ font-family: 'RobotoRegular', 'Droid Sans', sans-serif!important;}</style>";
        $('head').append(str);
    }

    pageSwitch();
    _members.me = me;
    geneDialog(_userName);
    //mainThread.intro();

})


var t = 1;
var c;
function timer() {
    var time = $('#js_callTime');
    var c = t++;
    if (c <= 17) {
        c < 10
            ? time.html('0' + c)
            : time.html(c);
        window.setTimeout('timer()', 1000);
    }
}

function startClick() {
    $('#js_calling').hide();
    $('#js_message').show();
    ion.sound.stop("phonecall");
}



var pageSwitch = function() {

    $('#js_call').click(function() {
        $('#js_phone').hide();
        $('#js_calling').show();
        ion.sound.play("phonecall");
        window.setTimeout('timer()', 1000);
    });
    // 直接挂断
    var message_top = '<div class="msg-hint animated message-top slideInDown" style="display:block;"><img src="img/msg0.png"></div>'

    $('#js_close').click(function(){

      $('#js_phone').find('h1').before(message_top);
      setTimeout(function(){
        $('#js_phone').hide();
        $('#js_message').show();
      }, 2000);

    })

    $('#js_hang').click(function() {
        var now_time = parseInt(($('#js_callTime').html()));

        console.log(now_time);
        if (now_time < 17) { //  提前挂断则弹窗提示语
            $('#js_calling').find('h1').before(message_top);
            setTimeout('startClick()', 2000);
            return  false;
        }
       startClick();

    });


    $('.msg-hint').click(function() {
        $('#js_message').hide();
        $('#js_chat').show();
        $('body').attr('ontouchmove', 'return true');
        if (status == 1) {
            mainThread.completeInfo();
        } else {
            mainThread.intro();
        }
    })
}
var phoneCall = (function() {
    ion.sound({
        sounds: [
            {
                name: "phonecall",
                volume: 1,
                preload: true
            }
        ],
        path: "sounds/",
        ended_callback: function() {
            $('#js_hang>i').addClass('animated infinite tada');
            $('#js_timer').html('通话结束，请挂断电话').addClass('animated infinite fadeIn');
        }
    });
})()

// var t = 1;
// var c;
// function timer() {
//     var time = $('#js_callTime');
//     var c = t++;
//     if (c <= 26) {
//         c < 10
//             ? time.html('0' + c)
//             : time.html(c);
//         window.setTimeout('timer()', 1000);
//     }
//     // console.log(c);11111
// }

var myDate = new Date();
$("#js_time").html(myRight(myDate.getHours(), 2) + ":" + myRight(myDate.getMinutes(), 2));
$("#js_date").html(myRight(myDate.getMonth() + 1, 2) + "月" + myRight(myDate.getDate(), 2) + "日 " + myDay(myDate.getDay()));

function myRight(str, len) {
    return ("0" + str).substr(-len);
}
function myDay(str) {
    var Week = [
        '日',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六'
    ];
    return '星期' + Week[str];
}

var mainThread = {
    intro: function() {
        //展示默认的引导对话
        showDialog(_dialog['d0'], function() {
            //console.log(status);
            //if (status == 0) {
            window.mainThread.getName();
            //}
        });
    },
    getName: function() {
        activeInput('请回复');
        $('#js_input').on('keyup', function(e) {
            _inputName = trim($('#js_input').val());
            if (_inputName !== "" || _inputName !== null) {
                $('.input-wrapper').addClass('send-ready');
                $('#js_submit').unbind('click').click(function() {
                    _inputName = trim($('#js_input').val());
                    submitName();
                    return;
                })
            }
            if (e.which == 13) {
                if (_inputName == "" || _inputName == null) {
                    alert('请正确输入姓名');
                } else {
                    _inputName = trim($('#js_input').val());
                    submitName();
                    return;
                }

            }
        });
    },
    getPhone: function(_name) {
        _dialog.r1[0].content = '好的，【' + _name + '】, 为了避免万华的大家庭里有同名同姓的情况，我还需要进一步确认您的身份，请提供您的【电话号码】。';
        showDialog(_dialog['r1'], function() {
            activeInput('请输入您的电话号码');
            $('#js_input').on('keyup', function(e) {
                if (e.which == 13) {
                    _inputPhone = trim($('#js_input').val());
                    var re = /^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/;
                    if (!re.test(_inputPhone)) {
                        alert('请正确输入手机号');
                        return false;
                    } else {
                        _dialog.phone[0].content = _inputPhone;
                        showDialog(_dialog['phone'], function() {
                            deactiveInput();
                            $('#js_input').off('keyup');
                            window.mainThread.vertifyInfo(_inputName, _inputPhone);
                        })
                    }
                }
            })
        });
    },
    vertifyInfo: function(_name) {
        // _dialog.r2[0].content = _name + '，您好，由川商总会主办天府论坛即将在成都召开。关心四川未来发展的你，怎么可以错过呢？';

        showDialog(_dialog['r2'], function() {
            //activeInput('确认您的信息');
            var flag = true;
            $('.J_img').on('click', function() {
                $('.poster').addClass('show');
                var _img = $('.poster').find('img');
                var _imgHeight = _img.height();
                var _winHeight = $(window).height();
                _img.on('touchmove', function() {
                    var _scrollTop = Math.abs($(this).offset().top);
                    var _diff = (_imgHeight - _winHeight) / 2;
                    console.log(_diff);
                    console.log(_winHeight);
                    if (_scrollTop >= _diff) {
                        $('.arrow-down').removeClass('infinite bounce').addClass('fadeOut');
                    }
                })
            });
            var _confirm;

            $('#js_input').on('keyup', function(e) {
                _confirm = $('#js_input').val();
                if (_confirm !== "" || _confirm !== null) {
                    $('.input-wrapper').addClass('send-ready');
                    $('#js_submit').unbind('click').click(function() {
                        _confirm = $('#js_input').val();
                        submitVertify(_name, _confirm);
                    })
                }
                if (e.which == 13) {

                    if (_confirm == "" || _confirm == null) {
                        alert('请正确输入');
                        return false;
                    } else {
                        _confirm = $('#js_input').val();
                        submitVertify(_name, _confirm);
                    }

                }
            })
        })
    },
    queryInfo: function(_name) {
        var _flag = false;
        window.mainThread.completeInfo();
        //        var res = getWx(_name);
        //        if (res == 1 || res == 5) {
        //            window.mainThread.completeInfo();
        //        }
        //		else if(res==4)
        //		{
        //		_dialog.r2[0].content = '此账户已绑定！';
        //        showDialog(_dialog['r2'],function(){
        //			window.mainThread.completeInfo();
        //			})
        //		}
        //console.log(_name, _phone, _flag);
    },

    completeInfo: function() {
        _dialog.d3[0].content = new Date().toLocaleTimeString();
        showDialog(_dialog['d3'], function() {
            var flag = true;
            $('.J_img').on('click', function() {
                $('.poster').addClass('show');
                var _img = $('.poster').find('img');
                var _imgHeight = _img.height();
                var _winHeight = $(window).height();
                _img.on('touchmove', function() {
                    var _scrollTop = Math.abs($(this).offset().top);
                    var _diff = (_imgHeight - _winHeight) / 2;
                    console.log(_diff);
                    if (_scrollTop >= _diff) {
                        $('.arrow-down').removeClass('infinite bounce').addClass('fadeOut');
                    }
                })
            });
            //           $('.poster').on('click',function(){
            //               if(flag){
            //                   showDialog(_dialog['d4'],function(){
            //                       $('.J_img').on('click',function(){
            //                           var _img = $(this).attr('src');
            //                           if(_img === "img/final-sm.png"){
            //                               $('.final').addClass('show');
            //
            //                                $('body').attr('ontouchmove','return false');
            //                           }
            //
            //                       })
            //                   });
            //                   flag = false;
            //               }
            //               $(this).removeClass('show');
            //           })
        })
    }
}

var submitName = function() {
    _dialog.name[1].content = _inputName;
    showDialog(_dialog['name'], function() {
        deactiveInput();
        $('#js_input').off('keyup');
        window.mainThread.vertifyInfo(_inputName);
    })
}
var submitVertify = function(_name, _confirm) {
    _dialog.confirm[0].content = _confirm;
    showDialog(_dialog['confirm'], function() {
        deactiveInput();
        $('#js_input').off('keyup');
        if (_confirm === '是') {
            window.mainThread.queryInfo(_name);
        } else if (_confirm === '不是') {
            window.mainThread.intro();
        } else if (_confirm !== '是' && _confirm !== '不是') {
            window.mainThread.vertifyInfo(_name);
        }
    });
}

function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
function getWx(_name) {
    var res = 0;
    $.ajax({
        url: "http://192.168.16.166:1125/UIHandler/UIHandler1.ashx",
        data: {
            "action": "RetrieveEmployee",
            "openid": openid,
            "name": _name
        },
        dataType: "json",
        async: false,
        type: "post",
        success: function(data) {
            res = data;
            console.log(data);
        },
        error: function() {}
    });
    return res;
}
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault(); // 阻止默认事件
});

function getCookie(name) {
    var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
    }
