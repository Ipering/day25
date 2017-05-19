//对传入的字符串进行多余空格的删除
function deleteSpace(arg){
    //删除字符串两端的空格
    var txt = /^\s+|\s+$/g;
    arg = arg.replace(txt, "");
    //保留选择器之间的一个空格
    var txt1 = /\s+/g;
    arg = arg.replace(txt1, " ");
    return arg;
}
//合并数组
function combineArray(sourceArray, desArray){
    for (var i = 0; i < sourceArray.length; i++) {
    	     desArray.push(sourceArray[i]);
    }
    return desArray;
}
//定义函数完成按照选择器查找所有的元素
function getElements(arg) {
    //统一选择器格式
    arg = deleteSpace(arg);
    var selectors = arg.split(" ");
    var parents = [document]; //存储每次查找所需要的父级元素
    var childs = []; //存储每次找到的子级标签
    for (var i = 0; i < selectors.length; i++) {
    	     var selector = selectors[i];
    	     for (var j = 0; j < parents.length; j++) {
    	     	var parent = parents[j];
    	     	var elements = []; //存储找到的元素的
    	     	//判断应该使用哪个方法进行元素的获取
    	     	//id
    	     	if((/^#/).test(selector)) {
    	     	     selector = selector.substr(1, selector.length - 1);  elements.push(parent.getElementById(selector));
    	     	//class
    	     	}else if((/^[.]/).test(selector)) {
    	     	    selector = selector.substr(1, selector.length - 1); 
    	     	    elements = parent.getElementsByClassName(selector);
    	     	//tag
    	     	}else {
    	     	    elements = parent.getElementsByTagName(selector);
    	     	}
    	     	//合并数组
    	     	childs = combineArray(elements, childs);
    	     }
    	     parents = [];
    	     parents = combineArray(childs, parents);
    	     childs = [];
    }
    return parents;
}


//定义返回JQ对象的方法
function $(arg){
    return new JQuery(arg);
}
function JQuery(arg){
    //声明一个属性存储找到的元素
    this.elements = [];
    if(typeof(arg) == "string") {
        //查找元素
        this.elements = getElements(arg);
    }else {
        //将对应的arg直接转化为jq对象
         this.elements.push(arg);
        
    }
}
JQuery.prototype.get = function(index){
    return this.elements[index];
}

//on
JQuery.prototype.on = function(eventName, fun){
    function callFun(e){
        var even = e || event;
        //都是函数对象的方法,每一个函数对象都有以下的两个方法,作用效果相同:  将fun函数的执行绑定到对应的obj上.
//      fun.call(obj, 参数1, 参数2...);
//      fun.apply(obj, [参数1, 参数2...]);
        fun.call(this, even);
    }
    for (var i = 0; i < this.elements.length; i++) {
    	       //主流浏览器的绑定事件方法
    	       if(this.elements[i].addEventListener) {
    	           this.elements[i].addEventListener(eventName, callFun, false);
    	       }else {
    	           //ie写法
    	           this.elements[i].attachEvent("on"+event, callFun);
    	       }
    }
}
//获取对应的css样式
function getStyle(obj, styleName) {
    //主流浏览器获取样式
    if(window.getComputedStyle) {
        return window.getComputedStyle(obj, null)[styleName];
    } else {
        //ie浏览器中获取对应标签
        return obj.currentStyle[styleName];
    }
}
//定义函数完成样式的设置
function setStyle(obj, styleName, styleVlaue) {
    //设置标签的外观样式只能通过标签的style属性
    obj.style[styleName] = styleVlaue;
}
//css方法的实现
JQuery.prototype.css = function() {
    //arguments是一个全局变量，用来存储函数在调用过程中传递的参数列表
    for(var i = 0; i < this.elements.length; i++) {
        if(arguments.length == 1) {
            if(typeof(arguments[0]) == "string") {
                //此时获取第一个指定的标签样式
                return getStyle(this.elements[0], arguments[0]);
            } else {
                //此时代表设置对应的标签样式
                for(var styleName in arguments[0]) {
                    setStyle(this.elements[i], styleName, arguments[0][styleName]);
                }
            }
        } else if(arguments.length == 2) {
            //此时代表设置对应的标签样式
            setStyle(this.elements[i], arguments[0], arguments[1]);
        }
    }
}
//封装animate操作
JQuery.prototype.animate = function(obj, speed, fun) {
    var time = 0; //存储动画的时间
    if(arguments.length == 2) {
        time = 500;
    }else if(arguments.length == 3) {
        switch (arguments[1]){
            case "fast":
                time = 500;
                break;
            case "normal":
                time = 1000;
                break;
            case "slow":
                time = 2000;
                break;
            default:
                break;
        }
    }
    //设置需要过度的属性,通过空格相连接
    var attr = "";
    var time1 = "";
    for(var styleName in arguments[0]) {
        attr = attr + styleName+",";
        time1 = time1 + (time/1000)+"s,";
    }
    //替换属性最后的","
    attr = attr.replace(/,$/, " ");
    time1 = time1.replace(/,$/, "");
    //设置过渡transition属性
    for(var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.transition = attr+time1;
        //修改标签对应的外观
        for(var styleName in arguments[0]) {
            this.elements[i].style[styleName] = arguments[0][styleName];
        }
    }
    //动画结束之后执行函数回调
    setTimeout(arguments[arguments.length-1], time);
}

