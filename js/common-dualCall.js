var me = {
	id: 'me', // 写死不用改
	name: decodeURIComponent(getCookie("WxNickName")) || '麓湖的朋友', // 用户昵称
	avatar: getCookie("WxHeadImg") || 'img/avatar-me.png', // 用户头像图片 url
	userId: '', // 用户id
	registered: false // 用户是否已经记录信息
};
var _userName = me.name;
var _inputName = '';
var _inputPhone = '';
var _dialog = {};
var _members = {};
var myTime = new Date().toLocaleTimeString();
var status = "";
var openid = "";

var init = (function(){
    var t = ZMD_COMMON.parseURI().params;
    status = t.status;
    openid = t.WxOpenId;
    console.log(t);
})()

function geneDialog(userName){
    var defaultMembers = {
        xlj:{
            id:'xlj',
            name:'寻麓君',
            avatar:'img/avatar.png'
        }
    }
    _members = $.extend(_members, defaultMembers);

    //引导对话
    _dialog.d0 = [{
        type:'system',
        content:myTime
    },{
        type:'plain',
        author:_members.xlj,
        content:'筑梦十年，不忘初心，1月22日，麓湖年会诚邀各位“同麓人”共同庆祝，欢迎您的到来！首先我需要您提供【姓名】好安排定制服务。'
    }];

    //回复海报
	_dialog.d3 = [{
	    type: 'system',
	}, {
        type:'plain',
        author:_members.xlj,
        content:'好的，感谢您的支持，筑梦十年感谢有您，新的一年，准备好一起出发了吗？1月22日，我们不见不散。',
        pause:2000
    },{
        type:'plain',
        author:_members.xlj,
        content:'关于具体的年会时间、地点等安排，我们制作了一份精美的邀请函，请您打开查阅。',
        pause:1500
    },{
	    type: 'picture',
	    author: _members.xlj,
        content:'img/poster-sm.png'
	}];

    //回复落格
    _dialog.d4 = [{
        type:'picture',
        author:_members.xlj,
        content:'img/final-sm.png'
    }]
    //回复姓名
    _dialog.name = [{
        type:'system',
        content:myTime
    },{
        type:'plain',
        author:_members.me,
        content:'hello'
    }];
    //回复手机
    _dialog.phone = [{
        type:'plain',
        author:_members.me,
        content:'hello'
    }];
    //回复确认
    _dialog.confirm = [{
        type:'plain',
        author:_members.me,
        content:'hello'
    }];
    //反馈姓名
    _dialog.r1 = [{
        type:'plain',
        author:_members.xlj
    }];
    //反馈手机
    _dialog.r2 = [{
        type:'plain',
        author:_members.xlj
    }];
    //反馈海报
    _dialog.r3 = [{
        type: 'picture',
        author: _members.xlj
    }];
}

$.fn.scrollSmooth = function(scrollHeight,duration){
    var $el = this;
    var el = $el[0];
    var startPosition = el.scrollTop;
    var delta = scrollHeight - startPosition;
    var startTime = Date.now();
    function scroll(){
        var fraction = Math.min(1,(Date.now() - startTime) / duration);
        el.scrollTop = delta * fraction + startPosition + 20;
        if(fraction < 1){
            setTimeout(scroll, 10);
        }
    }
    scroll();
};

$.fn.goSmooth = function(height,duration){
    var $el = this;
	var startPosition = 1 * $el.css('margin-bottom').replace('px', '');
	var delta = height  - startPosition;
	var startTime = Date.now();
	function scroll() {
		var fraction = Math.min(1, (Date.now() - startTime) / duration);
		$el.css('margin-bottom', delta * fraction + startPosition);
		if(fraction < 1) {
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
    $('.box_ft').find('input').prop({
        disabled:false,
        placeholder:holder
    });
}

function deactiveInput() {
    $('.box_ft').find('input').prop({
        disabled:true,
        placeholder:'',
        value:''
    });
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
					if(message.el.pause != undefined) {
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

$(function(){
    if(judge.platform() == "ios"){
		var str = "<style> body{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif!important;}</style>";
		$('head').append(str);
	}
	if(judge.platform()=="android"){
		var str = "<style>body{ font-family: 'RobotoRegular', 'Droid Sans', sans-serif!important;}</style>";
		$('head').append(str);
	}
    randomCall();
    pageSwitch();
    _members.me = me;
    geneDialog(_userName);
    //mainThread.intro();

})
var randomCall = function(Min,Max){
    var range = Max - Min;
    var rand = Math.random();
    return (Min + Math.round(rand * range));
}
var _num = randomCall(1,2);console.log('phone:'+ _num);
var pageSwitch = function(){

    $('#js_call').click(function(){
        $('#js_phone').hide();
        $('#js_calling').show();
        ion.sound.play("phonecall" + _num);
        window.setTimeout('timer()',1000);
    });
    $('#js_hang').click(function(){
        $('#js_calling').hide();
        $('#js_message').show();
        ion.sound.stop("phonecall" + _num);
        //window.clearTimeout('timer()');

    });
    $('.msg-hint').click(function(){
        $('#js_message').hide();
        $('#js_chat').show();
        $('body').attr('ontouchmove','return true');
        if (status == 1) {
            mainThread.completeInfo();
        } else {
            mainThread.intro();
        }
    })
}
var phoneCall = (function(){
    ion.sound({
        sounds:[{
            name: "phonecall1",
            volume: 1,
            preload: true
        },{
            name: "phonecall2",
            volume: 1,
            preload: true
        }],
        path: "sounds/",
        ended_callback:function(){
            $('#js_hang>i').addClass('animated infinite tada');
            $('#js_timer').html('通话结束，请挂断电话').addClass('animated infinite fadeIn');
        }
    });
})()



    var t=1;
    var c,diff;
    _num == 1?diff=15:diff=12;
    function timer(){
        var time = $('#js_callTime');
        var c = t++;
        if(c<=diff){
            c<10?time.html('0'+c):time.html(c);
            window.setTimeout('timer()',1000);
        }
    }

var myDate = new Date();
$("#js_time").html(myRight(myDate.getHours(),2)+":"+myRight(myDate.getMinutes(),2));
$("#js_date").html(myRight(myDate.getMonth()+1,2)+"月"+myRight(myDate.getDate(),2)+"日 "+myDay(myDate.getDay()));

function myRight(str, len){
	return ("0"+str).substr(-len);
}
function myDay(str){
	var Week = ['日','一','二','三','四','五','六'];
    return '星期' + Week[str];
}

var mainThread = {
    intro: function(){
        //展示默认的引导对话
        showDialog(_dialog['d0'], function () {
            if (status == 0) {
                window.mainThread.getName();
            }
        });
    },
    getName:function(){
        activeInput('请输入您的姓名');
        $('#js_input').on('keyup',function(e){
            _inputName = trim($('#js_input').val());
            if(_inputName !== "" || _inputName !== null){
                $('.input-wrapper').addClass('send-ready');
                $('#js_submit').unbind('click').click(function(){
                    _inputName = trim($('#js_input').val());
					submitName();
                    return;
                })
            }
            if(e.which == 13){
                if(_inputName == "" || _inputName == null){
                    alert('请正确输入姓名');
                }else{
                    _inputName = trim($('#js_input').val());
					submitName();
                    return;
                }

            }
        });
    },
    getPhone: function(_name){
        _dialog.r1[0].content = '好的，【'+_name+'】, 为了避免万华的大家庭里有同名同姓的情况，我还需要进一步确认您的身份，请提供您的【电话号码】。';
        showDialog(_dialog['r1'],function(){
            activeInput('请输入您的电话号码');
            $('#js_input').on('keyup',function(e){
                if(e.which == 13){
                    _inputPhone = trim($('#js_input').val());
                    var re = /^(13[0-9]|15[0|3|6|7|8|9]|18[8|9])\d{8}$/;
                    if(!re.test(_inputPhone)){
                        alert('请正确输入手机号');
                        return false;
                    }else{
                        _dialog.phone[0].content = _inputPhone;
                        showDialog(_dialog['phone'],function(){
                            deactiveInput();
                            $('#js_input').off('keyup');
                            window.mainThread.vertifyInfo(_inputName, _inputPhone);
                        })
                    }
                }
            })
        });
    },
    vertifyInfo: function(_name){
        _dialog.r2[0].content = '【'+_name+'】，请确认您的信息是否输入正确？请回复【是】或【不是】';
        showDialog(_dialog['r2'],function(){
            activeInput('确认您的信息');
            var _confirm;

            $('#js_input').on('keyup',function(e){
                _confirm = $('#js_input').val();
                if(_confirm !== "" || _confirm !== null){
                    $('.input-wrapper').addClass('send-ready');
                    $('#js_submit').unbind('click').click(function(){
                         _confirm = $('#js_input').val();
						submitVertify(_name,_confirm);
                    })
                }
                if(e.which == 13){

                    if(_confirm == "" || _confirm == null){
                        alert('请正确输入');
                        return false;
                    }else{
                         _confirm = $('#js_input').val();
						submitVertify(_name,_confirm);
                    }


                }
            })
        })
    },
    queryInfo: function(_name){
        var _flag = false;
        var res = getWx(_name);
        if (res == 1 || res == 5) {
            window.mainThread.completeInfo();
        }
		else if(res==4)
		{
		_dialog.r2[0].content = '此账户已绑定！';
        showDialog(_dialog['r2'],function(){
			window.mainThread.completeInfo();
			})
			}
        //console.log(_name, _phone, _flag);
    },

    completeInfo: function () {
        _dialog.d3[0].content = new Date().toLocaleTimeString();
        showDialog(_dialog['d3'], function () {
           var flag = true;
            $('.J_img').on('click',function(){
                $('.poster').addClass('show');
           });
           $('.poster').on('click',function(){
               if(flag){
                   showDialog(_dialog['d4'],function(){
                       $('.J_img').on('click',function(){
                           var _img = $(this).attr('src');
                           if(_img === "img/final-sm.png"){
                               $('.final').addClass('show');
                                $('body').attr('ontouchmove','return false');
                           }

                       })
                   });
                   flag = false;
               }
               $(this).removeClass('show');
           })
        })
    }
}

var submitName = function(){
    _dialog.name[1].content = _inputName;
    showDialog(_dialog['name'],function(){
    deactiveInput();
     $('#js_input').off('keyup');
     window.mainThread.vertifyInfo(_inputName);
    })
}
var submitVertify = function(_name,_confirm){
    _dialog.confirm[0].content = _confirm;
    showDialog(_dialog['confirm'],function(){
    deactiveInput();
    $('#js_input').off('keyup');
    if(_confirm === '是'){
        window.mainThread.queryInfo(_name);
     }else if(_confirm === '不是'){
     window.mainThread.intro();
      }else if(_confirm !== '是' && _confirm !== '不是'){
     window.mainThread.vertifyInfo(_name);
        }
});
}

function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g,"");
}
function getWx(_name){
    var res=0;
    $.ajax({
        url: "http://192.168.16.166:1125/UIHandler/UIHandler1.ashx",
        data: { "action": "RetrieveEmployee", "openid": openid, "name": _name },
        dataType: "json",
        async: false,
        type: "post",
        success: function (data) {
            res = data;
           console.log(data);
        },
           error:function(){}
    });
    return res;
}
document.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault(); // 阻止默认事件
});

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
