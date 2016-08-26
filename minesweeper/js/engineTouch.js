define(['exports', 'js/block'], function (exports, _block) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _block2 = _interopRequireDefault(_block);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var MineSweeper = function () {
        function MineSweeper(options) {
            _classCallCheck(this, MineSweeper);

            this.options = options;

            this._initGame();
            this.setLevel('Easy');
            this._startGame();
        }

        _createClass(MineSweeper, [{
            key: '_initGame',
            value: function _initGame() {
                var _this = this;

                this.gameArea = document.getElementById(this.options.gameArea);

                // menu
                var menuWrapper = document.createElement('div');
                menuWrapper.className = 'menu';
                menuWrapper.innerHTML = '<span>Menu</span>';
                this._menu = document.createElement('ul');
                this._menu.innerHTML = '<li>Start</li><a class="gap"></a><li class="current">Easy</li><li>Normal</li><li>Hard</li><li>Custom</li>';
                menuWrapper.appendChild(this._menu);
                this.gameArea.appendChild(menuWrapper);

                var menuButton = menuWrapper.getElementsByTagName('span')[0];
                // event for menu show
                menuButton.addEventListener('click', function (event) {
                    _this._menu.style.display = 'block';
                    menuButton.className = 'on';
                    event.stopPropagation();
                });
                // event for menu hide
                window.addEventListener('click', function (event) {
                    _this._menu.style.display = 'none';
                    menuButton.className = '';
                });
                // event for menu click
                this._menu.addEventListener('click', function (event) {
                    if (event.srcElement.nodeName === 'LI') {
                        if (event.srcElement.innerText === 'Start') {
                            _this._initMap();
                        } else {
                            _this.setLevel(event.srcElement.innerText);
                        }
                    }
                });
                // for custom level setter
                this._levelSel = document.createElement('div');
                this._levelSel.className = 'custom-level';
                this._levelSel.innerHTML = '\n            <form>\n                <p>Width: <input type="text" title="width"></p>\n                <p>Height: <input type="text" title="height"></p>\n                <p>Mines: <input type="text" title="mines"></p>\n                <div><input type="submit" value="Submit"></div>\n                <div><input type="button" value="Cancel"></div>\n            </form>';
                document.body.appendChild(this._levelSel);

                var mainGame = document.createElement('div');
                mainGame.className = 'main-game';
                //mines left, face, and timer;
                var digitalWrapper = document.createElement('div');
                digitalWrapper.className = 'digital-wrapper';
                this._mines = document.createElement('span');
                this._time = document.createElement('span');
                this._time.innerHTML = '000';
                this._face = document.createElement('div');

                digitalWrapper.appendChild(this._mines);
                digitalWrapper.appendChild(this._face);
                digitalWrapper.appendChild(this._time);
                mainGame.appendChild(digitalWrapper);

                this._face.addEventListener('click', function () {
                    _this._initMap();
                });

                // game canvas
                this.canvas = document.createElement('canvas');
                this.canvas.innerText = 'Your browser does not support canvas, please upgrade your browser.';
                mainGame.appendChild(this.canvas);

                this.gameArea.appendChild(mainGame);

                // init block
                _block2.default.size = this.options.blockSize;
                _block2.default.ctx = this.canvas.getContext('2d');
            }
        }, {
            key: '_initMap',
            value: function _initMap() {
                // set mines count
                this._mines.innerText = this._addZero(this.options.mineTotal);

                this.gameArea.style.width = this.options.blockSize * this.options.columns + 'px';
                // for retina display
                this.canvas.width = this.options.blockSize * this.options.columns;
                this.canvas.height = this.options.blockSize * this.options.rows;
                this.canvas.style.width = this.options.blockSize * this.options.columns + 'px';
                this.canvas.style.height = this.options.blockSize * this.options.rows + 'px';

                this.firstTouch = true;
                this.selectingLevel = false;
                this.gameOver = false;
                this.win = false;
                this._face.className = 'normal';
                clearInterval(this.timer);

                this.map = [];
                for (var i = 0; i < this.options.rows; i++) {
                    this.map[i] = [];
                    for (var j = 0; j < this.options.columns; j++) {
                        this.map[i][j] = new _block2.default('cover', 0, i, j);
                        this.map[i][j].draw(false);
                    }
                }
            }
        }, {
            key: '_setMines',
            value: function _setMines(coor) {
                var _this2 = this;

                // generate mines
                var mines = [];
                for (var i = 0; i < this.options.rows * this.options.columns; i++) {
                    if (i < this.options.mineTotal) {
                        mines[i] = -1;
                    } else {
                        mines[i] = 0;
                    }
                }

                // shuffle mines

                // use [Fisher-Yates shuffle] to shuffle mines
                for (var _i = this.options.rows * this.options.columns - 1; _i > 0; _i--) {
                    var ran = Math.floor(Math.random() * _i);

                    var temp = mines[_i];
                    mines[_i] = mines[ran];
                    mines[ran] = temp;
                }

                // the block at first touch position can not be mine
                var firstPosition = coor.i * this.options.columns + coor.j;
                while (mines[firstPosition] === -1) {
                    var _ran = Math.floor(Math.random() * this.options.rows * this.options.columns);
                    if (mines[_ran] === 0) {
                        var _temp = mines[firstPosition];
                        mines[firstPosition] = mines[_ran];
                        mines[_ran] = _temp;
                    }
                }

                // set mines
                for (var _i2 = 0; _i2 < this.options.rows; _i2++) {
                    for (var j = 0; j < this.options.columns; j++) {
                        this.map[_i2][j].number = mines[_i2 * this.options.columns + j];
                    }
                }

                // calculate numbers
                for (var _i3 = 0; _i3 < this.options.rows; _i3++) {
                    for (var _j = 0; _j < this.options.columns; _j++) {
                        if (this.map[_i3][_j].number !== -1) {
                            for (var x = _i3 - 1; x <= _i3 + 1; x++) {
                                for (var y = _j - 1; y <= _j + 1; y++) {
                                    if (x < this.options.rows && x >= 0 && y < this.options.columns && y >= 0 && this.map[x][y].number === -1) {
                                        this.map[_i3][_j].number++;
                                    }
                                }
                            }
                        }
                    }
                }

                // set timer
                this._time.innerText = '000';
                this.timer = setInterval(function () {
                    _this2.time = 'add';
                }, 1000);
            }
        }, {
            key: '_updateMap',
            value: function _updateMap(method, coor) {
                // gameover, do not respond any touch event
                if (this.gameOver || this.win || this.selectingLevel) {
                    return;
                }

                // for double tap on a unknown block
                if (method === 'db' && this.map[coor.i][coor.j].type !== 'blank' && this.map[coor.i][coor.j].type !== 'number') {
                    switch (this.map[coor.i][coor.j].type) {
                        case 'cover':
                            this.map[coor.i][coor.j].type = 'flag';
                            this.mines = -1;
                            break;
                        case 'flag':
                            this.map[coor.i][coor.j].type = 'question';
                            this.mines = 1;
                            break;
                        case 'question':
                            this.map[coor.i][coor.j].type = 'cover';
                            break;
                    }
                }

                // for single touch on unknown block
                if (coor !== false && method === 't' && this.map[coor.i][coor.j].type === 'cover') {
                    if (this.firstTouch) {
                        this.firstTouch = false;
                        this._setMines(coor);
                    }

                    if (this.map[coor.i][coor.j].number === -1) {
                        this._gameOver(coor);
                        return;
                    } else if (this.map[coor.i][coor.j].number === 0) {
                        this._expandMap(coor);
                    } else {
                        this.map[coor.i][coor.j].type = 'number';
                    }
                }

                // for double tap on a known block
                if (coor !== false && method === 'db' && (this.map[coor.i][coor.j].type === 'blank' || this.map[coor.i][coor.j].type === 'number')) {
                    if (this.map[coor.i][coor.j].type === 'number') {
                        // count flag around coor
                        var flags = 0;
                        for (var x = coor.i - 1; x <= coor.i + 1; x++) {
                            for (var y = coor.j - 1; y <= coor.j + 1; y++) {
                                if (x < this.options.rows && x >= 0 && y < this.options.columns && y >= 0 && this.map[x][y].type === 'flag') {
                                    flags++;
                                }
                            }
                        }
                        // expand map
                        if (flags === this.map[coor.i][coor.j].number) {
                            for (var _x = coor.i - 1; _x <= coor.i + 1; _x++) {
                                for (var _y = coor.j - 1; _y <= coor.j + 1; _y++) {
                                    if (_x < this.options.rows && _x >= 0 && _y < this.options.columns && _y >= 0 && this.map[_x][_y].type === 'cover') {
                                        switch (this.map[_x][_y].number) {
                                            case 0:
                                                this._expandMap({ i: _x, j: _y });
                                                break;
                                            case -1:
                                                this._gameOver({ i: _x, j: _y });
                                                return;
                                            default:
                                                this.map[_x][_y].type = 'number';
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // updateframe
                this.win = true;
                for (var i = 0; i < this.options.rows; i++) {
                    for (var j = 0; j < this.options.columns; j++) {
                        if (this.map[i][j].number !== -1 && this.map[i][j].type !== 'number' && this.map[i][j].type !== 'blank') {
                            this.win = false;
                        }

                        this.map[i][j].draw(false);
                    }
                }
                if (this.win) {
                    this._gameWin();
                }
            }
        }, {
            key: '_expandMap',
            value: function _expandMap(coor) {
                if (coor.i < this.options.rows && coor.i >= 0 && coor.j < this.options.columns && coor.j >= 0) {
                    // in map area
                    if (this.map[coor.i][coor.j].number === 0) {
                        if (this.map[coor.i][coor.j].type !== 'blank') {
                            // blank, expand
                            this.map[coor.i][coor.j].type = 'blank';
                            // expend at left, right, up, down
                            this._expandMap({ i: coor.i, j: coor.j - 1 });
                            this._expandMap({ i: coor.i, j: coor.j + 1 });
                            this._expandMap({ i: coor.i + 1, j: coor.j - 1 });
                            this._expandMap({ i: coor.i + 1, j: coor.j + 1 });
                            this._expandMap({ i: coor.i - 1, j: coor.j - 1 });
                            this._expandMap({ i: coor.i - 1, j: coor.j + 1 });
                            this._expandMap({ i: coor.i - 1, j: coor.j });
                            this._expandMap({ i: coor.i + 1, j: coor.j });
                        }
                    } else {
                        // number, stop expand
                        this.map[coor.i][coor.j].type = 'number';
                    }
                }
            }
        }, {
            key: '_startGame',
            value: function _startGame() {
                var _this3 = this;

                var timeGap = 300;
                var lastTouchCoor = { i: 0, j: 0 };
                var lastTouchTime = 0;
                var timer = null;

                var getBlockPosition = function getBlockPosition(x, y) {
                    var j = Math.floor(x / _this3.options.blockSize);
                    var i = Math.floor(y / _this3.options.blockSize);
                    if (i < _this3.options.rows && i >= 0 && j < _this3.options.columns && j >= 0) {
                        return { i: i, j: j };
                    } else {
                        return false;
                    }
                };

                this.canvas.addEventListener('touchstart', function (event) {
                    var coor = getBlockPosition(event.targetTouches[0].pageX - _this3.clientRect.left, event.targetTouches[0].pageY - _this3.clientRect.top);

                    var touchCancel = false;
                    var touchMethod = null;
                    // allow one block offset
                    console.log(Math.abs(lastTouchCoor.i - coor.i) + Math.abs(lastTouchCoor.j - coor.j));
                    console.log(Date.now() - lastTouchTime);
                    if (Math.abs(lastTouchCoor.i - coor.i) + Math.abs(lastTouchCoor.j - coor.j) < 2 && Date.now() - lastTouchTime < timeGap) {
                        // double touch
                        clearTimeout(timer);
                        touchMethod = 'db';
                    } else {
                        // single touch
                        touchMethod = 't';
                        lastTouchCoor.i = coor.i;
                        lastTouchCoor.j = coor.j;
                    }
                    // update current touch
                    lastTouchTime = Date.now();

                    var touchMove = function touchMove(event) {
                        if (touchCancel) {
                            return;
                        }
                        var rect = event.target.getBoundingClientRect();
                        var coor = getBlockPosition(event.changedTouches[0].pageX - _this3.clientRect.left, event.changedTouches[0].pageY - _this3.clientRect.top);
                        // offset more than two blocks
                        if (Math.abs(lastTouchCoor.i - coor.i) + Math.abs(lastTouchCoor.j - coor.j) >= 2) {
                            touchCancel = true;
                        }
                    };

                    var touchEnd = function touchEnd(event) {
                        if (!touchCancel) {
                            if (touchMethod === 'db') {
                                _this3._updateMap('db', coor);
                            } else {
                                timer = setTimeout(function () {
                                    _this3._updateMap('t', coor);
                                }, timeGap);
                            }
                        }
                        window.removeEventListener('touchmove', touchMove);
                        window.removeEventListener('touchend', touchEnd);
                    };
                    //
                    window.addEventListener('touchmove', touchMove);
                    window.addEventListener('touchend', touchEnd);
                });
            }
        }, {
            key: '_gameOver',
            value: function _gameOver(coor) {
                this.gameOver = true;
                // show all mines
                for (var i = 0; i < this.options.rows; i++) {
                    for (var j = 0; j < this.options.columns; j++) {
                        if (i === coor.i && j === coor.j) {
                            // the mine user clicked
                            this.map[i][j].drawBoom();
                        } else if (this.map[i][j].number === -1) {
                            // is mine, not shown
                            if (this.map[i][j].type === 'cover' || this.map[i][j].type === 'question') {
                                this.map[i][j].drawMine();
                            }
                        } else if (this.map[i][j].type === 'flag') {
                            // not mine, but flagged
                            this.map[i][j].drawWrong();
                        }
                    }
                }
                // stop timer
                clearInterval(this.timer);
                // change face
                this._face.className = 'failed';
            }
        }, {
            key: '_gameWin',
            value: function _gameWin() {
                // show all mines
                for (var i = 0; i < this.options.rows; i++) {
                    for (var j = 0; j < this.options.columns; j++) {
                        if (this.map[i][j].number === -1 && this.map[i][j].type !== 'flag') {
                            // mine, but not flagged
                            this.map[i][j].type = 'flag';
                            this.map[i][j].draw(false);
                        }
                    }
                }
                // stop timer
                clearInterval(this.timer);
                // clear mines
                this._mines.innerText = '000';
                // change face
                this._face.className = 'win';
            }
        }, {
            key: '_addZero',
            value: function _addZero(data, length) {
                length = length || 3;
                data = data + '';
                while (data.length < length) {
                    data = '0' + data;
                }
                return data;
            }
        }, {
            key: 'setLevel',
            value: function setLevel(level) {
                var _this4 = this;

                var _ret = function () {
                    switch (level) {
                        case 'Easy':
                            _this4.options.rows = 9;
                            _this4.options.columns = 9;
                            _this4.options.mineTotal = 10;
                            _this4._menu.innerHTML = '<li>Start</li><a class="gap"></a><li class="current">Easy</li><li>Normal</li><li>Hard</li><li>Custom</li>';
                            break;
                        case 'Normal':
                            _this4.options.rows = 16;
                            _this4.options.columns = 16;
                            _this4.options.mineTotal = 40;
                            _this4._menu.innerHTML = '<li>Start</li><a class="gap"></a><li>Easy</li><li class="current">Normal</li><li>Hard</li><li>Custom</li>';
                            break;
                        case 'Hard':
                            _this4.options.rows = 16;
                            _this4.options.columns = 30;
                            _this4.options.mineTotal = 99;
                            _this4._menu.innerHTML = '<li>Start</li><a class="gap"></a><li>Easy</li><li>Normal</li><li class="current">Hard</li><li>Custom</li>';
                            break;
                        case 'Custom':
                            clearInterval(_this4.timer);
                            _this4.selectingLevel = true;
                            // append current data
                            var inputs = _this4._levelSel.getElementsByTagName('input');
                            inputs[0].value = _this4.options.columns;
                            inputs[1].value = _this4.options.rows;
                            inputs[2].value = _this4.options.mineTotal;
                            // add button listener
                            inputs[3].addEventListener('click', function (event) {
                                _this4._menu.innerHTML = '<li>Start</li><a class="gap"></a><li>Easy</li><li>Normal</li><li>Hard</li><li class="current">Custom</li>';
                                _this4._levelSel.style.display = 'none';
                                var options = {
                                    rows: parseInt(inputs[1].value),
                                    columns: parseInt(inputs[0].value),
                                    mineTotal: parseInt(inputs[2].value)
                                };
                                _this4.options = options;
                                _this4._initMap();
                                event.preventDefault();
                            });
                            inputs[4].addEventListener('click', function (event) {
                                _this4._levelSel.style.display = 'none';
                                _this4.selectingLevel = false;
                            });
                            // show level selector
                            _this4._levelSel.style.display = 'block';
                            return {
                                v: void 0
                            };
                        default:
                            console.error('minesweeper: no such difficulty');
                    }
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
                window.scrollTo(0, 0);
                this.clientRect = this.canvas.getBoundingClientRect();

                this._initMap();
            }
        }, {
            key: 'mines',
            set: function set(num) {
                this._mines.innerText = this._addZero(parseInt(this._mines.innerText) + num);
            }
        }, {
            key: 'time',
            set: function set(str) {
                var time = parseInt(this._time.innerText) + 1;
                if (time >= 999) {
                    clearInterval(this.timer);
                }
                this._time.innerText = this._addZero(time);
            }
        }, {
            key: 'options',
            set: function set(_options) {
                var options = {
                    gameArea: '',
                    rows: 0,
                    columns: 0,
                    mineTotal: 0
                };

                for (var key in options) {
                    if (_options[key] !== undefined) {
                        options[key] = _options[key];
                    }
                }
                // max/min rows && colums && mines
                if (options.rows > 30) {
                    options.rows = 30;
                }
                if (options.rows < 9) {
                    options.rows = 9;
                }
                if (options.columns > 40) {
                    options.columns = 40;
                }
                if (options.columns < 9) {
                    options.columns = 9;
                }
                if (options.mineTotal > options.rows * options.columns / 4) {
                    options.mineTotal = Math.floor(options.rows * options.columns / 4);
                }
                if (options.mineTotal < options.rows * options.columns / 8) {
                    options.mineTotal = Math.floor(options.rows * options.columns / 8);
                }
                // can not set by users
                options.blockSize = 40;

                this._options = options;
            },
            get: function get() {
                return this._options;
            }
        }]);

        return MineSweeper;
    }();

    exports.default = MineSweeper;
});

//# sourceMappingURL=engineTouch.js.map