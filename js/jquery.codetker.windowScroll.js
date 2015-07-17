/*
 * windowScroll 0.1
 * window滚动插件，上下左右，可选择是否回弹。参考搜狗欢迎页面
 * 兼容等常见浏览器
 * 借鉴搜狗4.2版http://ie.sogou.com/features4.2.html
 * 如有侵权，请联系codetker@sina.com解决，谢谢
 */
;
(function($, window, document, undefined) {
	//定义构造函数
	var WindowObj = function(ele, opt) {
		this.$element = ele; //最外层对象
		this.defaults = {
				'choose': 0, //0为上下,1为左右
				'list': null, //内层对象
				'verticalSpeed': 1,
				'horizontalSpeed': 1,
				'objControlUl': null,
				'toLeft': null,
				'toRight': null,
				'toTop': null,
				'toBottom': null,
				'crash': true //用来定义效果
			},

			this.options = $.extend({}, this.defaults, opt);

	}

	//给构造函数添加方法
	WindowObj.prototype = {

		//上下滚动的方法
		verticalMove: function() {
			var
				obj = this.$element, //最外层对象
				speed = this.options.verticalSpeed,
				objControl = this.options.objControlUl, //控制按钮
				windowHeight = $(window).height(),
				list = this.options.list,
				listMax = $(list).length,
				toTop = this.options.toTop,
				toBottom = this.options.toBottom,
				crashButton = this.options.crash,
				toTop = this.options.toTop,
				toBottom = this.options.toBottom,
				stop = 0,
				stageIndex,
				windowobject = is_chrome();


			//均设置为windows大小
			$(obj).css({
				'width': $(window).width() + 'px',
				'height': $(window).height() * listMax + 'px'
			});
			$(list).css({
				'min-width': $(window).width() + 'px',
				'height': $(window).height() + 'px'
			});

			function is_chrome() {
				var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
				if (is_chrome) {
					//判断webkit内核，供scrollTop兼容性使用
					return 'body';
				} else {
					//支持IE和FF
					return 'html';
				}
			}


			//阻止默认行为和冒泡
			function stopDefaultAndBubble(e) {
				e = e || window.event;
				if (e.preventDefault) {
					e.preventDefault();
				}
				e.returnValue = false;

				if (e.stopPropagation) {
					e.stopPropagation();
				}
				e.cancelBubble = true;
			}

			//得到当前的垂直位置
			function getIndex() {
				stageIndex = Math.round($(window).scrollTop() / windowHeight);
			}

			function goTop() {
				getIndex();
				scrollStage(windowobject, stageIndex, 1); //stageIndex为当前页码
			}

			function goBottom() {
				getIndex();
				scrollStage(windowobject, stageIndex, -1); //stageIndex为当前页码
			}
			//绑定键盘上下按键事件
			$(document).keydown(function(event) {
				/* 绑定keycode38，即向上按钮 */
				if (event.keyCode == 38) {
					goTop();

				} else if (event.keyCode == 40) { //绑定40，即向下按钮
					goBottom();
				}
			});

			//绑定滑轮功能的函数
			function handle(delta) {
				getIndex();
				if (delta < 0) {
					scrollStage(windowobject, stageIndex, -1); //stageIndex为当前页码
				} else {
					scrollStage(windowobject, stageIndex, 1); //stageIndex为当前页码
				}

			}

			//判断滑轮，解决兼容性
			function wheel(event) {
				var delta = 0;
				if (!event) event = window.event;
				if (event.wheelDelta) {
					delta = event.wheelDelta;
					if (window.opera) delta = -delta;
				} else if (event.detail) {
					delta = -event.detail;
				}
				if (delta)
					handle(delta); //调用执行函数
			}

			//注册事件
			if (window.addEventListener) {
				window.addEventListener('DOMMouseScroll', wheel, false);
			}
			window.onmousewheel = document.onmousewheel = wheel;

			//绑定鼠标滚轮事件
			$(document).bind('mousedown', function(e) {
				if (e.which == 2) { //which=2代表鼠标滚轮,即为中键
					stopDefaultAndBubble(e);
					//bugfix 搜狗浏览器的ie内核只有在定时器触发这个函数才生效
					setTimeout(function() {
						stopDefaultAndBubble(e);
					}, 10);
				}
			});

			//如果有ul li控制按钮
			if (objControl != null) {
				$(objControl).delegate('li', 'click', function() {
					stageIndex = $(this).index();
					scrollStage(windowobject, stageIndex, 0);
				});
			}

			//如果有上下控制
			$(toTop).click(function() {
				goTop();
			});
			$(toBottom).click(function() {
				goBottom();
			});

			function scrollStage(obj, stIndex, dir) { //如果用scrollStage=function来指定的话没有声明提前，然后就会找不到这个函数了
				//obj为操作滚动的对象
				//stIndex为点击调用时应该滚动到的页面页码，按键和滚轮调用时默认为1(传入0)
				//dir传入滚动时的方向，0代表不滚动，1代表向上，-1代表向下
				var
					sIndex = stIndex, //!(dir)则stageIndex为要到的页码，否则为当前页码
					windowobject = obj,
					direction = 0 || dir, //接收参数封装,没有传入时暂时认为为0
					target = windowHeight * sIndex; //目标页面距离文档顶部距离

				function move() {
					$(windowobject).animate({
						'scrollTop': target + 'px'
					}, 1000 * speed, function() {
						crash(1, target, 20, 150, -1); //调用撞击函数,先撞顶部,target变成当前页面了
					});
				}

				function after_crash(distant, time, termin) {
					if (distant <= 15 || time > 150) {
						stop = 1; //停止碰撞
						$(windowobject).animate({
							'scrollTop': termin + 'px'
						}, time, function() {
							stop = 0;
						});
					}
				}

				//撞击函数
				function crash(direction, termin, distant, time, aspect) {
					if (crashButton) {
						if (!stop) {
							var scrollTop = $(window).scrollTop();
							if (direction == 1) {
								direction = 0;
								if (aspect == 1) {
									$(windowobject).animate({
										'scrollTop': '-=' + distant + 'px'
									}, time, function() {
										crash(direction, termin, distant * 0.6, time, 1);
										after_crash(distant, time, termin);
									});
								} else {
									$(windowobject).animate({
										'scrollTop': '+=' + distant + 'px'
									}, time, function() {
										crash(direction, termin, distant * 0.6, time, -1);
										after_crash(distant, time, termin);
									});
								}

							} else if (direction == 0) {
								direction = 1;
								if (aspect == 1) {
									$(windowobject).animate({
										'scrollTop': termin + 'px'
									}, time, function() {
										crash(direction, termin, distant * 0.6, time, 1);
										after_crash(distant, time, termin);
									});
								} else {
									$(windowobject).animate({
										'scrollTop': termin + 'px'
									}, time, function() {
										crash(direction, termin, distant * 0.6, time, -1);
										after_crash(distant, time, termin);
									});
								}

							}
						}
					}

				}


				if (!$(windowobject).is(':animated')) { //当没有在滚动时
					if (!direction) { ////响应guider,此时stageIndex为目标页面页码
						if ($(window).scrollTop() > target) { //内容下移，窗口上移,上方出现弹痕
							direction = -1;
							move();
						} else if ($(window).scrollTop() == windowHeight * sIndex) { //当前页面时
							direction = 0;
							crash(1, target, 20, 150, -1); //由于使用的是scrollTop,且body(.warp)的高度刚刚好，因此最下一层没有效果(stable)
						} else {
							direction = 1;
							move();
						}
					} else { //响应鼠标滚轮和键盘上下，sindex为当前页面
						if (direction == 1) {
							if (sIndex == 0) {
								crash(1, target, 20, 150, 1);
							} else { //往上翻
								sIndex -= 1;
								target = windowHeight * sIndex;
								move();
							}
						} else {
							if (sIndex == listMax - 1) {
								crash(1, target, 20, 150, -1);
							} else { //往下翻
								sIndex += 1;
								target = windowHeight * sIndex;
								move();
							}
						}
					}
				}
			}

		},

		//左右滚动的方法
		horizontalMove: function() {
			var
				obj = this.$element, //最外层对象
				speed = this.options.horizontalSpeed,
				objControl = this.options.objControlUl, //控制按钮
				windowWidth = $(window).width(),
				list = this.options.list,
				listMax = $(list).length,
				toLeft = this.options.toLeft,
				toRight = this.options.toRight,
				crashButton = this.options.crash,
				toLeft = this.options.toLeft,
				toRight = this.options.toRight,
				stop = 0,
				pageIndex; //当前页面页码

			//均设置为windows大小
			$(obj).css({
				'width': windowWidth * listMax + 'px',
				'height': $(window).height() + 'px'
			});
			$(list).css({
				'width': windowWidth + 'px',
				'min-height': $(window).height() + 'px'
			});

			function getPageIndex() {
				pageIndex = (-1) * Math.round(parseInt($(obj).css('margin-left')) / windowWidth);
			}

			function goLeft() {
				getPageIndex();
				scrollPage(obj, pageIndex, 1);
			}

			function goRight() {
				getPageIndex();
				scrollPage(obj, pageIndex, -1);
			}

			//绑定键盘左右按键事件
			$(document).keydown(function(event) {
				//判断event.keyCode为39（即向右按钮）
				if (event.keyCode == 39) {
					goRight();
				}
				//判断event.keyCode为37（即向左按钮
				else if (event.keyCode == 37) {
					goLeft();
				}
			});

			//如果有ul li控制按钮
			if (objControl != null) {
				$(objControl).delegate('li', 'click', function() {
					pageIndex = $(this).index();
					scrollPage(obj, pageIndex, 0);
				});
			}

			//如有有左右控制按钮
			$(toLeft).click(function() {
				goLeft();
			});
			$(toRight).click(function() {
				goRight();
			});

			function scrollPage(obj, pageIndex, dir) {
				var
					windowobject = obj,
					direction = 0 || dir,
					dist = Math.round(parseInt($(obj).css('margin-left'))), //当前页距离左边的margin(负值)
					aim;

				function getAim() {
					aim = pageIndex * windowWidth * (-1);
				}

				function crash(type) {
					if (crashButton) {
						if (type == 'left') {
							$(windowobject).animate({
								'margin-left': '+=' + '50px'
							}, 500).animate({
								'margin-left': '-=' + '100px'
							}, 500).animate({
								'margin-left': '+=' + '50px'
							}, 500);
						} else {
							$(windowobject).animate({
								'margin-left': '-=' + '50px'
							}, 500).animate({
								'margin-left': '+=' + '100px'
							}, 500).animate({
								'margin-left': '-=' + '50px'
							}, 500);
						}
					}

				}

				function move() {
					$(windowobject).animate({
							'margin-left': aim + 'px' //调用时aim已经有值了，不需要作为参数(默认也会成为参数)
						},
						1000 * speed);
				}

				if (!$(windowobject).is(':animated')) {
					switch (direction) {
						case 0:
							getAim();
							if (dist != aim) {
								move();
							} else {
								direction = 0;
								crash('left');
							}
							break;
						case 1:
							if (pageIndex == 0) {
								crash('left');
							} else {
								pageIndex -= 1; //显示左边内容，左键
								getAim();
								move();
							}
							break;
						case -1:
							if (pageIndex == (listMax - 1)) {
								crash('right');
							} else {
								pageIndex += 1;
								getAim();
								move();
							}
							break;
						default:
							break;
					}

				}
			}

		}
	}

	//在插件中使用windowObj对象的方法，0为vertical，1为horizontal
	$.fn.windowScroll = function(options) {
		//创建实体
		var windowObj = new WindowObj(this, options);
		//根据选择调用方法
		if (windowObj.options.choose == 0) {
			return windowObj.verticalMove();
		} else if (windowObj.options.choose == 1) {
			return windowObj.horizontalMove();
		} else { //2之后的留扩展吧
			//add some functions
		}
	}
})(jQuery, window, document);