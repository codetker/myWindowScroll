插件效果：
	实现window的上下滚动，默认绑定键盘上下按钮和鼠标滑轮
	实现window的左右滚动，默认绑定键盘左右按钮
	可附加ul li协助控制滚动
	可修改后附加缓动函数，实现多种效果，详情见缓动函数表 http://easings.net/zh-cn#easeInOutQuad
	插件使用完整示例 https://github.com/codetker/TokenFamily


html 结构(ZenCoding形式)
	-div.divClass
	  -div.toLeftOrTop
	  -div.toRightOrBottom
	  -div.stageClass*n

	-ul.controlUl
	  -li.liClass*n

	其中div.toLeftOrTop,div.toRightOrBottom,ul.controlUl可选

调用方法(详情见demo)(按需设置参数)
A.vertical
    $(".divClass").windowScroll({
        'choose': 0,             //垂直滚动，默认
        'verticalSpeed': 1,      //控制垂直滚动速度
        'objControlUl': 'ul.controlUl', //控制垂直滚动按钮，默认为null
        'list': '.stageClass',          //垂直滚动的对象
        'crash': true,                  //撞击底部特效
        'toTop': '.toLeftOrTop',        //向上按钮，默认为null
        'toBottom': 'toRightOrBottom',  //向下按钮，默认为null
        'liHover': 'stageSelect'        //设置当前stage的类名
    });

B.horizontal
    $(".divClass").windowScroll({
        'choose': 1,               //水平滚动
        'horizontalSpeed': 1,      //控制水平滚动速度
        'objControlUl': 'ul.controlUl', //控制水平滚动按钮，默认为null
        'list': '.stageClass',          //水平滚动的对象
        'crash': true,                  //撞击左右特效
        'toTop': '.toLeftOrTop',        //向左按钮，默认为null
        'toBottom': 'toRightOrBottom',  //向右按钮，默认为null
        'liHover': 'stageSelect'        //设置当前page的类名
    });

运行demo
    最简单的方法为改Default.html中jquery对应script元素的src为本地的jquery(离线)或CDN中的jquery(在线),然后双击Default.html即可
    或者配置myBoxScroll.jquery.json or package.json

PS:代码之间耦合过强，可重复利用的很多，准备参考学长的建议按模块写个人函数库，通过模块加载注入需要使用的工具函数
