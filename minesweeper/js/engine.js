define(['exports', 'js/underscore.min', 'js/block', 'js/sound'], function (exports, _underscore, _block, _sound) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _underscore2 = _interopRequireDefault(_underscore);

    var _block2 = _interopRequireDefault(_block);

    var _sound2 = _interopRequireDefault(_sound);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

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
            this._initMap();
            this._startGame();
        }

        _createClass(MineSweeper, [{
            key: '_initGame',
            value: function _initGame() {
                var _this = this;

                this.gameArea = document.getElementById(this.options.gameArea);

                this.difficultySeletor = document.createElement('form');
                this.difficultySeletor.innerHTML = '<input type="button" name="easy" value="easy"><input type="button" name="normal" value="normal"><input type="button" name="hard" value="hard">';
                this.gameArea.appendChild(this.difficultySeletor);

                this.difficultySeletor.addEventListener('click', function (event) {
                    if (event.srcElement.nodeName === 'INPUT') {
                        _this.setDifficulty(event.srcElement.getAttribute('name'));
                    }
                });

                this.canvas = document.createElement('canvas');
                this.canvas.innerText = 'Your browser does not support canvas, please upgrade your browser.';
                this.gameArea.appendChild(this.canvas);

                _block2.default.size = this.options.blockSize;
                _block2.default.ctx = this.canvas.getContext('2d');

                // window prevent context menu
                document.body.addEventListener('contextmenu', function (event) {
                    event.preventDefault();
                });
            }
        }, {
            key: '_initMap',
            value: function _initMap() {
                this.gameArea.style.width = this.options.blockSize * this.options.columns + 'px';
                // attention: do not use style.width && style.height
                this.canvas.width = this.options.blockSize * this.options.columns;
                this.canvas.height = this.options.blockSize * this.options.rows;

                this.map = [];
                for (var i = 0; i < this.options.rows; i++) {
                    this.map[i] = [];
                    for (var j = 0; j < this.options.columns; j++) {
                        this.map[i][j] = new _block2.default('cover', 0, i, j);
                        this.map[i][j].draw();
                    }
                }
            }
        }, {
            key: '_updateMap',
            value: function _updateMap(button, method, coor) {
                var _this2 = this;

                // for r & down
                if (button === 'r') {
                    switch (this.map[coor.i][coor.j].type) {
                        case 'cover':
                            this.map[coor.i][coor.j].type = 'flag';
                            break;
                        case 'flag':
                            this.map[coor.i][coor.j].type = 'question';
                            break;
                        case 'question':
                            this.map[coor.i][coor.j].type = 'cover';
                            break;
                    }
                }
                // for l & up
                if (button === 'l' && method === 'up' && coor !== false) {
                    if (this.map[coor.i][coor.j].number === -1) {
                        this._gameOver();
                    } else if (this.map[coor.i][coor.j].number === 0) {
                        this._expandMap(coor);
                    } else {
                        this.map[coor.i][coor.j].type = 'number';
                    }
                }
                // for lr & up, do nothing

                // for l/lr & down/move, and updateframe
                var updateFrame = function updateFrame() {
                    for (var i = 0; i < _this2.options.rows; i++) {
                        for (var j = 0; j < _this2.options.columns; j++) {
                            if (button === 'lr' && (method === 'down' || method === 'move')) {
                                // for lr & down/move
                                if (Math.abs(coor.i - i) < 2 && Math.abs(coor.j - j) < 2) {
                                    _this2.map[i][j].draw(true);
                                } else {
                                    _this2.map[i][j].draw(false);
                                }
                            } else if (button === 'l' && (method === 'down' || method === 'move')) {
                                // for l & down/move
                                if (i === coor.i && j === coor.j) {
                                    _this2.map[i][j].draw(true);
                                } else {
                                    _this2.map[i][j].draw(false);
                                }
                            } else {
                                // for others
                                _this2.map[i][j].draw(false);
                            }
                        }
                    }
                };

                window.requestAnimationFrame(updateFrame);
            }
        }, {
            key: '_expandMap',
            value: function _expandMap(coor) {}
        }, {
            key: '_startGame',
            value: function _startGame() {
                var _this3 = this;

                var timeGap = 50;
                var lastClickButton = -1;
                var lastClickTime = 0;
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

                var mouseDown = function mouseDown(event) {
                    var coor = getBlockPosition(event.offsetX, event.offsetY);
                    var currentButton = null;
                    if (event.button + lastClickButton === 2 && Date.now() - lastClickTime < timeGap) {
                        // left && right click
                        clearTimeout(timer);
                        currentButton = 'lr';
                        _this3._updateMap(currentButton, 'down', coor);
                    } else if (event.button === 0) {
                        // left click
                        timer = setTimeout(function () {
                            currentButton = 'l';
                            _this3._updateMap(currentButton, 'down', coor);
                        }, timeGap);
                    } else if (event.button === 2) {
                        // right click
                        timer = setTimeout(function () {
                            currentButton = 'r';
                            _this3._updateMap(currentButton, 'down', coor);
                        }, timeGap);
                    }

                    lastClickTime = Date.now();
                    lastClickButton = event.button;

                    var mouseMove = function mouseMove(event) {
                        console.log('move');
                        var coor = getBlockPosition(event.offsetX, event.offsetY);
                        if (currentButton === 'l' || currentButton === 'lr') {
                            _this3._updateMap(currentButton, 'move', coor);
                        }
                    };

                    var mouseUp = function mouseUp(event) {
                        var coor = getBlockPosition(event.offsetX, event.offsetY);
                        if (currentButton === 'l' || currentButton === 'lr') {
                            _this3._updateMap(currentButton, 'up', coor);
                        }

                        window.removeEventListener('mousemove', mouseMove);
                        window.removeEventListener('mouseup', mouseUp);
                    };

                    window.addEventListener('mousemove', mouseMove);
                    window.addEventListener('mouseup', mouseUp);
                };

                this.canvas.addEventListener('mousedown', mouseDown);
            }
        }, {
            key: '_gameOver',
            value: function _gameOver() {}
        }, {
            key: 'setDifficulty',
            value: function setDifficulty(difficulty) {
                switch (difficulty) {
                    case 'easy':
                        this.options.rows = 9;
                        this.options.columns = 9;
                        this.options.mineCount = 10;
                        break;
                    case 'normal':
                        this.options.rows = 16;
                        this.options.columns = 16;
                        this.options.mineCount = 40;
                        break;
                    case 'hard':
                        this.options.rows = 16;
                        this.options.columns = 30;
                        this.options.mineCount = 99;
                        break;
                    default:
                        console.error('minesweeper: no such difficulty');
                }

                this._initMap();
            }
        }, {
            key: 'options',
            set: function set(_options) {
                var options = {
                    gameArea: '',
                    rows: 9,
                    columns: 9,
                    mineCount: 10
                };

                for (var key in options) {
                    if (_options[key] !== undefined) {
                        options[key] = _options[key];
                    }
                }
                // max rows && colums && mines
                if (options.rows > 30) {
                    options.rows = 30;
                }
                if (options.columns > 40) {
                    options.columns = 40;
                }
                if (options.rows * options.columns / 4 < options.mineCount) {
                    options.mineCount = Math.floor(options.rows * options.columns / 4);
                }
                // can not set by users
                options.blockSize = 20;

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

//# sourceMappingURL=engine.js.map