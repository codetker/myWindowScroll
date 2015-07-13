/*
 * windowScroll 0.1
 * window滚动插件，上下左右，可选择是否回弹。参考搜狗欢迎页面
 * 兼容等常见浏览器
 * 借鉴搜狗4.2版http://ie.sogou.com/features4.2.html
 * 如有侵权，请联系codetker@sina.com解决，谢谢
 */
 ;(function($,window,document,undefined){
 	//定义构造函数
 	var WindowObj=function(ele,opt){
 		this.$element=ele; //最外层对象
 		this.defaults={
 			'choose' : 0,//默认为上下
 			'verticalSpeed' : 1,
 			'horizontalSpeed' : 1,
 			'objControlUl': null
 		},
 	
 		this.options=$.extend({},this.defaults,opt );

		//阻止默认行为和冒泡,这里可以定义多个方法都要用到的函数
		this.stopDefaultAndBubble=function(e){
			e=e||window.event;
			if (e.preventDefault) {
				e.preventDefault();
			}
			e.returnValue=false;

			if (e.stopPropagation) {
				e.stopPropagation();
			}
			e.cancelBubble=true;
		}

		this.setSize=function(ele){
			$(ele).css({
				'width':$(window).outerWidth()+'px'
			});
			//自动判断元素是否存在，对undefined赋css属性无意义
			$(ele).children('.stage').css({
				'width':$(window).outerWidth()+'px',
				'height':$(window).outerHeight()+'px'
			});
			$(ele).children('.page').css({
				'width':$(window).outerWidth()+'px',
				'height':$(window).outerHeight()+'px'
			});
		}
 	}

 	//给构造函数添加方法
 	WindowObj.prototype={

 		//上下滚动的方法
 		verticalMove:function(){
 			var obj=this.$element; //最外层对象
 			var speed=this.options.verticalSpeed;
 			var objControl=this.options.objControlUl;//控制按钮

 			var windowHeight=$(window).height();
 			var list=$(obj).children('.stage');
 			var listMax=$(list).length;

 			var is_chrome=navigator.userAgent.toLowerCase().indexOf('chrome')>-1;
 			if(is_chrome){
 				//判断webkit内核，供scrollTop兼容性使用
 				windowobject='body';
 			}else{
 				//支持IE和FF
 				windowobject='html';
 			}
 			var stop=0;

 			//均设置为windows大小
 			this.setSize(obj);

 			//得到当前的垂直位置
 			var stageIndex;
 			function getIndex(){
 				stageIndex=Math.round($(window).scrollTop()/windowHeight);
 			} 

 			//绑定键盘上下按键事件
 			$(document).keydown(function(event) {
 				/* 绑定keycode38，即向上按钮 */
 				if (event.keyCode==38) {
 					getIndex();
					setTimeout(function(){
						scrollStage(windowobject,stageIndex,1); //stageIndex为当前页码
					},100);
 				}else if (event.keyCode==40) {//绑定40，即向下按钮
 					getIndex();
					setTimeout(function(){
						scrollStage(windowobject,stageIndex,-1); //stageIndex为当前页码
					},100);
 				}
 			});

 			//绑定滑轮功能的函数
 			function handle(delta){
 				getIndex();
			    if (delta<0) {
					setTimeout(function(){
						scrollStage(windowobject,stageIndex,-1); //stageIndex为当前页码
					},100);
			    }else{
					setTimeout(function(){
						scrollStage(windowobject,stageIndex,1); //stageIndex为当前页码
					},100);
			    }

 			}

 			//判断滑轮，解决兼容性
 			function wheel(event){
			    var delta = 0;
			    if (!event) event = window.event;
			    if (event.wheelDelta) {
			        delta = event.wheelDelta; 
			        if (window.opera) delta = -delta;
			    } else if (event.detail) {
			        delta = -event.detail;
			    }
			    if (delta)
			        handle(delta);  //调用执行函数
			}

 			//注册事件
 			if (window.addEventListener) {
 				window.addEventListener('DOMMouseScroll', wheel, false);
 			}
 			window.onmousewheel = document.onmousewheel = wheel;
 			
 			//绑定鼠标滚轮事件
 			$(document).bind('mousedown', function(event) {
 				if (e.which==2) {//which=2代表鼠标滚轮,即为中键
 					this.stopDefaultAndBubble(e);
 					//bugfix 搜狗浏览器的ie内核只有在定时器触发这个函数才生效
 					setTimeout(function(){
 						this.stopDefaultAndBubble(e);
 					},10);
 				}
 			});

 			//如果有ul li控制按钮
 			if (objControl!=null) {
 				$(objControl).delegate('li', 'click', function() {
 					stageIndex=$(this).index();
 					setTimeout(function(){
 						scrollStage(windowobject,stageIndex,0);
 					},100);
 				});
 			}

 			function scrollStage(obj,stIndex,dir){//如果用scrollStage=function来指定的话没有声明提前，然后就会找不到这个函数了
 				//obj为操作滚动的对象
				//stIndex为点击调用时应该滚动到的页面页码，按键和滚轮调用时默认为1(传入0)
				//dir传入滚动时的方向，0代表不滚动，1代表向上，-1代表向下
				var sIndex=stIndex;//!(dir)则stageIndex为要到的页码，否则为当前页码
				var windowobject=obj;
				var direction=0||dir;  //接收参数封装,没有传入时暂时认为为0
				var target=windowHeight*sIndex; //目标页面距离文档顶部距离
 			
				if ( !$(windowobject).is(':animated') ) {//当没有在滚动时
					if(!direction){ ////响应guider,此时stageIndex为目标页面页码
						if ($(window).scrollTop() > target) { //内容下移，窗口上移,上方出现弹痕
							direction=-1;
							$(windowobject).animate({
								"scrollTop": target +"px"
							},1000*speed,function(){
								crash_bottom(1,target,20,150);  //调用撞击函数,先撞顶部,target变成当前页面了
							});
						}else if($(window).scrollTop() == windowHeight*sIndex){ //当前页面时
							direction=0;
							crash_bottom(1, target ,20,150);  //模拟撞底部
						}else{
							direction=1;
							$(windowobject).animate({
								"scrollTop": target +"px"
							},1000*speed,function(){
								crash(1,target,20,150);  //调用撞击函数,先撞底部

							});
						}
					}else{//响应鼠标滚轮和键盘上下，sindex为当前页面
						if(direction==1){
							if(sIndex==0){
								crash(1,target,20,150);
							}else{  //往上翻
								sIndex-=1;
								$(windowobject).animate({
									"scrollTop":windowHeight*sIndex+"px"
									},1000*speed,function(){
										crash_bottom(1,windowHeight*sIndex,20,150);  //调用撞击函数,往下翻内容往上，先撞顶部
									}
								);
							}
						}else{
							if(sIndex==listMax){
								crash_bottom(1,target,20,150);
							}else{ //往下翻
								sIndex+=1;
								$(windowobject).animate({
									"scrollTop":windowHeight*sIndex+"px"
								},1000*speed,function(){
									crash(1,windowHeight*sIndex,20,150);  //调用撞击函数,往上翻内容往下，先撞底部
								});

							}
						}
					}
				}
 			}

			//撞击函数
			function crash_bottom(direction,termin,distant,time){
				if (!stop) {
					var scrollTop=$(window).scrollTop();
					if (direction==1) {
						direction=0;
						$(windowobject).animate({"scrollTop":"+="+distant+"px"},time,function(){
							crash_bottom(direction,termin,distant*0.6,time);
							if (distant<=15||time>150) {
								stop=1;//停止碰撞

								$(windowobject).animate({"scrollTop":termin+"px"},time,function(){
									stop=0;
								});
							}
						});
					}else if (direction==0) {
						direction=1;
						$(windowobject).animate({"scrollTop":termin+"px"},time,function(){
							crash_bottom(direction,termin,distant*0.6,time);
							if (distant<=15||time>150) {
								stop=1;//停止碰撞

								$(windowobject).animate({"scrollTop":termin+"px"},time,function(){
									stop=0;
								});
							}
						});
					}
				}
			}
			function crash(direction,termin,distant,time){
				if (!stop) {
					var scrollTop=$(window).scrollTop();
					if (direction==1) {
						direction=0;
						$(windowobject).animate({"scrollTop":"-="+distant+"px"},time,function(){
							crash(direction,termin,distant*0.6,time);
							if (distant<=15||time>150) {
								stop=1;//停止碰撞

								$(windowobject).animate({"scrollTop":termin+"px"},time,function(){
									stop=0;
								});
							}
						});
					}else if (direction==0) {
						direction=1;
						$(windowobject).animate({"scrollTop":termin+"px"},time,function(){
							crash(direction,termin,distant*0.6,time);
							if (distant<=15||time>150) {
								stop=1;//停止碰撞

								$(windowobject).animate({"scrollTop":termin+"px"},time,function(){
									stop=0;
								});
							}
						});
					}
				}
			}

 		},
 		//左右滚动的方法
 		horizontalMove:function(){
 			var obj=this.$element; //最外层对象
 			var speed=this.options.horizontalSpeed;
 			var objControl=this.options.objControlUl;//控制按钮

 			var windowWidth=$(window).width();
 			var list=$(obj).children('.page');
 			var listMax=$(list).length;

 			var is_chrome=navigator.userAgent.toLowerCase().indexOf('chrome')>-1;
 			if(is_chrome){
 				//判断webkit内核，供scrollTop兼容性使用
 				windowobject='body';
 			}else{
 				//支持IE和FF
 				windowobject='html';
 			}
 			var stop=0;

 			//均设置为windows大小
 			this.setSize(obj);
 			$(obj).css({'width':windowWidth*listMax+'px'});

 			var pageIndex;  //当前页面页码(负数)
			function getPageIndex(){
				pageIndex=Math.round(parseInt($(obj).css("margin-left")) / windowWidth);
			}

			//绑定键盘左右按键事件
			$(document).keydown(function(event){
				//判断event.keyCode为39（即向右按钮）
				if (event.keyCode==39) {
					getPageIndex();
					scrollPage($(obj),pageIndex,-1); 
				}
				//判断event.keyCode为37（即向左按钮
				else if (event.keyCode==37) {
					getPageIndex();
					scrollPage($(obj),pageIndex,1);
				}
			});

			//如果有ul li控制按钮
 			if (objControl!=null) {
 				$(objControl).delegate('li', 'click', function() {
 					pageIndex=$(this).index();
 					setTimeout(function(){
 						scrollPage(obj,pageIndex,0);
 					},100);
 				});
 			}

			function scrollPage(obje,pIndex,dir){
				var windowobject=obje;
				var direction=0||dir;
				var pageIndex=pIndex;
				var dist=Math.round(parseInt($(obj).css("margin-left")));  //当前页距离左边的margin(负值)
				var aim=pageIndex*windowWidth*(-1);

				if (!$(windowobject).is(":animated")) {
					if(!direction){  //响应nav

						if (dist != aim) { //此时pageIndex为yearID.非负值
							$(windowobject).animate({"margin-left": aim + "px"},
								1000*speed);
						}else{
							direction=0;
							$(windowobject).animate({"margin-left":"+="+"50px"},500).animate({"margin-left":"-="+"100px"},500).animate({"margin-left":"+="+"50px"},500);
						}
					}else{ //响应键盘左右键
						if(direction==1){ //pageIndex为负值
							if(pageIndex==0){
								$(windowobject).animate({"margin-left":"+="+"50px"},500).animate({"margin-left":"-="+"100px"},500).animate({"margin-left":"+="+"50px"},500);	
							}else{
								pageIndex+=1; //显示左边内容，左键
								$(windowobject).animate({"margin-left":"+=" + windowWidth + "px"},
									1000*speed);
							}
						}else{
							if(pageIndex== ((-1)*(listMax-1))){
								$(windowobject).animate({"margin-left":"-="+"50px"},500).animate({"margin-left":"+="+"100px"},500).animate({"margin-left":"-="+"50px"},500);	
							}else{
								pageIndex-=1;
								$(windowobject).animate({"margin-left":"-=" + windowWidth + "px"},
									1000*speed);
							}
							
							
						}
					}
				}
			}

 		}
 	}

 	//在插件中使用windowObj对象的方法，0为vertical，1为horizontal
 	$.fn.windowScroll=function(options){
 		//创建实体
 		var windowObj=new WindowObj(this,options);
 		//根据选择调用方法
 		if (windowObj.options.choose==0) {
 			return windowObj.verticalMove();
 		}else if(windowObj.options.choose==1){
 			return windowObj.horizontalMove();
 		}else{//2之后的留扩展吧
 			//add some functions
 		}
 	}
 })(jQuery,window,document);