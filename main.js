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
					this.className = this.className.replace(new RegExp("(\\s|^)(" + ClassName + ")(\\s|$)", "g"), "$1");
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
    var BLOCK_SIZE = 88;
    var getVector = function(direction) {
        return [{
            x: -1,
            y: 0
        }, {
            x: 0,
            y: -1
        }, {
            x: 1,
            y: 0
        }, {
            x: 0,
            y: 1
        }][direction];
    };
    var getDirectionList = function(direction, size) {
        for (var x = [], y = [], i = 0; i < size; i++) {
            x.push(i);
            y.push(i);
        }
        //若direction.x是1则说明正向检索，即x=2->4，所以在深度检索时应当倒置由末尾开始判断，同理y
        return {
            'x': direction.x === 1 ? x.reverse() : x,
            'y': direction.y === 1 ? y.reverse() : y
        };
    };
    //这里将会是未来全局变量的声明区域


    //这里将会是未来操作方法的声明区域
    // 0.0.1:设定一个可能存在的grid系统
    function grid(size) {
        this.size = size;
        this.cells = this.empty();
    }
    //0.0.2:设定一些可能存在的结构
    grid.prototype.empty = function() {
        //生成一个空的地图
        for (var rows = [], rowIndex = 0; rowIndex < this.size; rowIndex++) {
            for (var cells = rows[rowIndex] = [], cellIndex = 0; cellIndex < this.size; cellIndex++) {
                cells.push(null);
            }
        }
        return rows;
    };
    grid.prototype.haveReachableCell = function() {

    };
    grid.prototype.whereEmpty = function() {
        var emptyList = [];
        for (var x in this.cells) {
            for (var y in this.cells[x]) {
                if (!this.cells[x][y]) {
                    emptyList.push({ 'x': x, 'y': y });
                }
            }
        }
        return emptyList;
    };
    grid.prototype.randomAdd = function() {
        var emptyList = this.whereEmpty(),
            which = Math.floor(Math.random() * emptyList.length),
            num = Math.random() < 0.8 ? 2 : 4,
            newTile = new tile(emptyList[which], num);
        this.insertCell(newTile);
        //TODO:检测是否能够继续
    };
    //position参数需事先{x:……,y:……}类型的接口
    grid.prototype.insertCell = function(tile) {
        this.cells[tile.x][tile.y] = tile;
    };
    grid.prototype.removeCell = function(position) {
        this.cells[position.x][position.y] = null;
    };
    grid.prototype.getCellContent = function(position) {
        return this.withinBound(position) ? this.cells[position.x][position.y] : null;
    };
    //判断元素是否是可访问的
    grid.prototype.availableCell = function(position) {
        return !!this.getCellContent(position);
    };
    //判断元素是否是空
    grid.prototype.isEmptyCell = function(position) {
        return !(this.cells[position.x][position.y]);
    };
    //判断元素是否在边界以内
    grid.prototype.withinBound = function(position) {
        return (position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size);
    };
    grid.prototype.moveTile = function(from, to) {
        if (from.x == to.x && from.y == to.y) return this.cells[from.x][from.y];
        this.cells[from.x][from.y].updatePositon(to);
        this.cells[to.x][to.y] = this.cells[from.x][from.y];
        this.cells[from.x][from.y] = null;
        return this.cells[to.x][to.y];
    };
    //深度优先遍历
    grid.prototype.travelDeep = function(direction) {
        this.travelCalculateInit();
        var directionList = getDirectionList(getVector(direction), this.size);
        var self = this;
        //第一级x方向
        directionList.x.forEach(function(x) {
            //第二级y方向
            directionList.y.forEach(function(y) {
                var position = {
                    'x': x,
                    'y': y
                };
                if (self.availableCell(position)) {
                    // var
                    var cellResult = self.findNearestPosition(position, getVector(direction));
                    if (self.withinBound(cellResult.next)) {
                        if (self.getCellContent(cellResult.next) &&
                            self.getCellContent(position) && 
							
                            self.getCellContent(cellResult.next).value == self.getCellContent(position).value) {
                            //若value相同则是可以合并的，把cell放置入mergedform
                            self.getCellContent(cellResult.next).mergedFrom = self.cells[x][y];
							self.getCellContent(cellResult.next).value *= 2;
                            //随后移除现在的元素
                            self.removeCell(position);
                        } else {
                            //移动至位置
                            self.moveTile(position, cellResult.nearest);
                            //获得元素并更新postion
                            // self.getCellContent(cellResult.nearest);
                        }
                    } else {
                        self.moveTile(position, cellResult.nearest);
                        //获得元素并更新postion
                        // self.getCellContent(cellResult.nearest);
                    }
                }
            });
        });
    };
    //寻找最近可访问元素
    grid.prototype.findNearestPosition = function(position, direction) {
        var nearest,
            next = position;
        var max = 0;
        do {
            if (++max > 99) {
                console.log('out of bound');
                break;
            }
            nearest = next;
            next = {
                x: next.x + direction.x,
                y: next.y + direction.y
            };
        } while (this.withinBound(next) && this.isEmptyCell(next));
        //返回时，下一个元素有两种可能，第一:超出边界，第二:可合并元素,第三种已经合并元素
        return {
            'nearest': nearest,
            'next': next
        };
    };
    //grid内元素遍历的方法
    grid.prototype.each = function(callback) {
        for (var x in this.cells) {
            for (var y in this.cells[x]) {
                callback.call(this, this.cells[x][y], x, y);
            }
        }
    };
    //在进行移动计算前首先要初始化tile
    grid.prototype.travelCalculateInit = function() {
        this.each(function(item) {
            if (item) {
                item.savePositon();
                item.mergedFrom = null;
            }
        });
    };
    //需要切换到专用的html渲染类
    grid.prototype.randerDom = function() {
        var _dom = $.div();
        for (var i in this.cells) {
            for (var j in this.cells[i]) {
                if (this.cells[i][j]) {
                    var _tile, _font, _from;
                    //应当新出现的元素渲染，新出现的元素的previous是null
                    if (this.cells[i][j].previousPosition) {
                        if (this.cells[i][j].mergedFrom) {
                            var y = parseInt(this.cells[i][j].mergedFrom.y);
                            var x = parseInt(this.cells[i][j].mergedFrom.x);
                            var prey = this.cells[i][j].y;
                            var prex = this.cells[i][j].x;
                            var value = this.cells[i][j].mergedFrom.value;
                            _from = $.div()
                                .addClass('tile-' + value)
                                .addClass('tile-cell')
                                .css({
                                    'top': (BLOCK_SIZE * prey + 16 * prey) + 'px',
                                    'left': (BLOCK_SIZE * prex + 16 * prex) + 'px'
                                });
                            _tile = $.div()
                                .addClass('tile-' + value)
                                .addClass('tile-cell')
                                .css({
                                    'top': (BLOCK_SIZE * y + 16 * y) + 'px',
                                    'left': (BLOCK_SIZE * x + 16 * x) + 'px'
                                });
                            _font = document.createElement('font');
                            _font.innerHTML = this.cells[i][j].value;
                            _tile.append(_font);
                            _from.append(_font);
                            _dom.append(_tile);
                            _dom.append(_from);
                            window.requestAnimationFrame((function(dx, dy, dfrom, dtile, dvalue) {
                                return function() {
                                    dtile.css({
                                        'top': (BLOCK_SIZE * dy + 16 * dy) + 'px',
                                        'left': (BLOCK_SIZE * dx + 16 * dx) + 'px'
                                    });
                                    dfrom.removeClass('tile-' + dvalue).addClass('tile-' + dvalue * 2).addClass('tile-merged');
                                }
                            })(x, y, _from, _tile, value));
                        } else {
                            //如果是=没有merge from就说明只有移动或者不动,不管动不动都一样
                            var prey = parseInt(this.cells[i][j].previousPosition.y);
                            var prex = parseInt(this.cells[i][j].previousPosition.x);
                            var y = this.cells[i][j].y;
                            var x = this.cells[i][j].x;
                            _tile = $.div()
                                .addClass('tile-' + this.cells[i][j].value)
                                .addClass('tile-cell')
                                .css({
                                    'top': (BLOCK_SIZE * prey + 16 * prey) + 'px',
                                    'left': (BLOCK_SIZE * prex + 16 * prex) + 'px'
                                });
                            _font = document.createElement('font');
                            _font.innerHTML = this.cells[i][j].value;
                            _tile.append(_font);
                            _dom.append(_tile);
                            window.requestAnimationFrame((function(dx, dy, dtile) {
                                return function() {
                                    dtile.css({
                                        'top': (BLOCK_SIZE * dy + 16 * dy) + 'px',
                                        'left': (BLOCK_SIZE * dx + 16 * dx) + 'px'
                                    });
                                };
                            })(x, y, _tile));
                        }
                    } else {
                        _tile = $.div()
                            .addClass('tile-' + this.cells[i][j].value)
                            .addClass('tile-cell')
                            .addClass('tile-new')
                            .css({
                                'top': (BLOCK_SIZE * j + 16 * j) + 'px',
                                'left': (BLOCK_SIZE * i + 16 * i) + 'px'
                            });
                        _font = document.createElement('font');
                        _font.innerHTML = this.cells[i][j].value;
                        _tile.append(_font);
                        _dom.append(_tile);
                    }

                }
            }
        }
        return _dom;
    };

    function tile(position, value) {
        this.x = position.x;
        this.y = position.y;
        this.value = value;
        //默认为空
        this.previousPosition = this.mergedFrom = null;
        return this;
    }
    tile.prototype.isMoved = function() {
        return this.mergedFrom || this.x != this.previousPosition.x || this.y != this.previousPosition.y;
    };
    //记录一个之前的节点用于在移动时显示动画
    tile.prototype.savePositon = function() {
        this.previousPosition = {
            x: this.x,
            y: this.y,
            value: this.value
        };
    };
    tile.prototype.updatePositon = function(position) {
        this.x = position.x;
        this.y = position.y;
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
        if (isNaN(size)) size = 4;
        //如果是其他大小的将会动态创建盒子大小
        var contentLength = BLOCK_SIZE * size + 16 * (size - 1);
        var sizeCSS = {
            'width': contentLength + 'px',
            'height': contentLength + 'px',
        };
        this.content = $('#' + contentId);
        //添加tile
        this.tile = $.div().addClass('tile');
        this.content.append(this.tile);

        this.grid = $.div().addClass('grid');
        if (size != 4) {
            var contentMargin = { 'margin': '-' + (contentLength / 2) + 'px' + ' -' + (contentLength / 2) + 'px' };
            this.content.css(sizeCSS).css(contentMargin);
            this.tile.css(sizeCSS);
            this.grid.css(sizeCSS);
        }
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
        document.addEventListener('keydown', this.move.bind(this));
        //初始化grid系统
        this.grid = new grid(size);
        return this;

    }
    //0.0.2:设定一些可能存在的结构
    //系统的启动
    GameManage.prototype.start = function() {
        this.grid.randomAdd();
        var _dom = this.grid.randerDom();
        this.tile.append(_dom);
    };
    //系统的关闭
    GameManage.prototype.stop = function() {

    };
    GameManage.prototype.move = function(event) {
        var direction;
        switch (event.keyCode) {
            case 37:
                direction = 0;
                break;
            case 38:
                direction = 1;
                break;
            case 39:
                direction = 2;
                break;
            case 40:
                direction = 3;
                break;
            default:
                return;
        }
        this.grid.travelDeep(direction);
        this.grid.randomAdd();
        this.tile[0].innerHTML = "";
        var _dom = this.grid.randerDom();
        this.tile.append(_dom);
    };
    //可能需要添加的controlmanage
    // function controlManage() {

    // }
    // controlManage.prototype.
    //这里将会是未来，window全局访问接口的定义位置
    // 0.0.1:首先定义全局访问接口

    window.fake2048 = GameManage;
})();

var game = new fake2048('content', 4);
game.start();