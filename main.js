// 一些预定义的方法(该方法不是现在写的)
(function() {
    _$ = function(selector) {
        //生成器每一次返回一个新的对象
        return new _$.fn.init(selector);
    };
    _$.fn = _$.prototype = {
        isQuery: true,
        //继承splice方法
        splice: [].splice,
        length: 0,
        init: function(selector) {
            if (!selector) return this;
            var i;
            if (typeof selector == 'string') {
                this.selector = selector;
                //低版本浏览器兼容,暂不做低版本处理
                var elem = document.querySelectorAll(selector);
                for (i = 0; i < elem.length; i++) {
                    this[i] = elem[i];
                }
                this.length = elem.length;
            } else {
                for (i in selector) {
                    this[i] = selector[i];
                }
                this.length = selector ? selector.length : 0;
            }
            return this;
        },
        css: function(attr, css) {
            switch (arguments.length) {
                case 1:
                    //首先判断是否是json数据，是的话那就依次设置（设置）
                    if ((typeof attr == 'object') && (Object.prototype.toString.call(attr).toLowerCase()) == "[object object]" && !attr.length) {
                        //遍历自己
                        this.each(function(i, item) {
                            //遍历元素
                            for (var j in attr)
                                item.style[j] = attr[j];
                        });
                        //结束返回自己
                        return this;
                    } else {
                        // this.each(function(i,item){ 
                        return this[0].style[attr];
                    }
                    break;
                case 2:
                    if (css) {
                        //如果有两个参数那必然是遍历设置
                        if (this.length == 1) {
                            this[0].style[attr] = css;
                            return this;
                        }
                        this.each(function(i, item) {
                            this.style[attr] = css;
                        });
                    }
                    return this;
                default:
                    return "";
            }
        },
        addClass: function(ClassName) {
            this.each(function(i, item) {
                if (!item.className.match(new RegExp("(\\s|^)" + ClassName + "(\\s|$)", "g"))) {
                    item.className += " " + ClassName;
                }
            });
            //为了满足连贯操作
            return this;
        },
        removeClass: function(ClassName) {
            this.each(function() {
                if ((this.nodeType) && (this.nodeType != 11)) {
                    $(this).each(function(i, item) {
                        item.className = item.className.replace(new RegExp("(\\s|^)(" + ClassName + ")(\\s|$)", "g"), "$1");
                    });
                }
            });
            //为了满足连贯操作
            return this;
        },
        //遍历器
        each: function(callback) {
            for (var index = 0; index < this.length; index++) {
                if (false === callback.call(this[index], index, this[index])) break;
            }
        },
        //事件侦听！
        on: function(name, listener) {
            //[x]-预留检测位置！
            if (isNaN(this.length) || (this.length < 0)) {
                return false;
            } else {
                /*更改为全部绑定*/
                this.each(function(i, item) {
                    //这里存在一个可能的bug就是如果存在相同的函数会覆盖掉后者，但listener中却不会覆盖
                    //重命名函数，以组织重复和匿名函数
                    var func_name = $.getFuncName(listener) || Math.random();
                    //一个全新的json对象，用来存放lisener
                    var _json = {};
                    _json[func_name] = listener;
                    //一个如果dom上以及有了则不重新负值，否则给予{}
                    item.eventFnStack = item.eventFnStack || {};
                    item.eventFnStack[name] = item.eventFnStack[name] || [];
                    //放置进eventFnStack，到时候可以遍历取出就可以定向删除
                    item.eventFnStack[name].push(_json);
                    item.addEventListener(name, listener);
                });
            }
            //TODO:预留ie位置

            //返回自己使得可以连续操作
            return this;
        },
        unbind: function(name, listener) {
            //现在没空搞单个的先全部删除得了
            this.each(function(i, item) {
                var obj = item;
                $(item.eventFnStack[name]).each(function() {
                    $(this).each(function() {
                        obj.removeEventListener(name, this, false);
                    });
                });
            });
        },
        append: function(str) {
            //如果是空的那就什么都不做
            if (!str || (str === "")) return this;
            var i;
            if (typeof str == "string") {
                //如果是一个string则调用inserhtml来处理
                for (i = 0; i < this.length; i++) {
                    this[i].insertAdjacentHTML('beforeEnd', str);
                }
            } else {
                //如果是一个query 对象并且nodetype表明是一个html的情况下
                if (str.isQuery && str[0].nodeType && (str[0].nodeType != 11)) {
                    for (i = 0; i < this.length; i++) {
                        this[i].appendChild(str[0]);
                    }
                } else if ((str.nodeType) && (str.nodeType != 11)) {
                    //如果是一个element对象的情况下(去除跨域元素的)
                    for (i = 0; i < this.length; i++) {
                        this[i].appendChild(str);
                    }
                }
            }
            //其余情况不处理！
            return this;
        }
    };
    _$.div = function() {
        var _tmp = _$();
        _tmp[0] = document.createElement('div');
        _tmp.length = 1;
        return _tmp;
    };
    _$.fn.init.prototype = _$.fn;
    window.$ = _$;
})();



(function() {



        //这里将会未来常量的声明区域

        //这里将会是未来全局变量的声明区域


        //这里将会是未来操作方法的声明区域
        // 0.0.1:设定一个可能存在的grid系统
        function grid(size) {
            this.size = size;
            this.cells = [];
        }
        //0.0.2:设定一些可能存在的结构
        grid.prototype.empty = function() {
            //生成一个空的地图
            for (var gird = [], rowIndex = 0; rowIndex < this.size; rowIndex++) {
                for (var cell = grid[rowIndex] = [], cellIndex; cellIndex < this.size; cellIndex++) {
                    cell.push(null);
                }
            }
        }
    }
    return;
};
grid.prototype.haveEmpty = function() {

};
grid.prototype.randomAdd = function() {

};

function tile(position, value) {
    this.x = position.x;
    this.y = position.y;
    this.value = value;
    //默认为空
    this.previousPosition = null;
}
//记录一个之前的节点用于在移动时显示动画
tile.prototype.savePositon = function() {

};
tile.prototype.updatePositon = function(position) {
    this.x = point.x;
    this.y = point.y;
};
//序列化的函数，用于在传递时更简单的调用
tile.prototype.serialize = function() {
    return {
        position: {
            x: this.x,
            y: this.y
        },
        value: this.value
    };
};
// tile.
// 0.0.1:设定GameManage
//========
function GameManage(contentId, size) {
    this.content = $('#' + contentId);
    if (isNaN(size)) {
        size = 4;
    } else {
        var contentLength = 88 * size + 16 * (size - 1);
        var sizeCSS = {
            'width': contentLength + 'px',
            'height': contentLength + 'px',
        };
        var contentMargin = { 'margin': '-' + (contentLength / 2) + 'px' + ' -' + (contentLength / 2) + 'px' };
        this.content.css(sizeCSS).css(contentMargin);
        //添加tile
        this.tile = $.div().addClass('tile').css(sizeCSS);
        this.content.append(this.tile);
    }
    this.grid = $.div().addClass('grid');
    //初始化内容区
    for (var i = (size - 1); i >= 0; i--) {
        var _row = $.div().addClass('row');
        for (var j = (size - 1); j >= 0; j--) {
            _row.append($.div().addClass('cell'));
        }
        this.grid.append(_row);
    }
    //添加grid加入content渲染区域
    this.content.append(this.grid);
    //初始化绑定

    this.grid = new grid(size);
    return this;

}
//0.0.2:设定一些可能存在的结构
//系统的启动
GameManage.prototype.start = function() {

};
//系统的关闭
GameManage.prototype.stop = function() {

};

//这里将会是未来，window全局访问接口的定义位置
// 0.0.1:首先定义全局访问接口

window.fake2048 = GameManage;
})();

var game = fake2048('content');