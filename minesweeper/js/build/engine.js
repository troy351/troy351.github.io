'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _block = require('block');

var _sound = require('sound');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MineSweeper = function () {
    function MineSweeper(options) {
        _classCallCheck(this, MineSweeper);

        this.options = options;
        if (options.rows * options.columns / 3 < options.mineCount) {
            console.log('There are too many mines setted.');
        }

        this.canvas = document.getElementById(this.options.gameCanvas);
        this.initSize();
    }

    _createClass(MineSweeper, [{
        key: 'initSize',
        value: function initSize() {
            if (this.options.rows > 50) {
                console.log('too much rows');
                return;
            } else if (this.options.rows > 40) {
                this.options.blockSize = 20;
            } else if (this.options.rows > 30) {
                this.options.blockSize = 25;
            } else if (this.options.rows > 20) {
                this.options.blockSize = 30;
            } else {
                this.options.blockSize = 35;
            }

            this.canvas.style.width = this.options.blockSize * this.options.columns;
            this.canvas.style.height = this.options.blockSize * this.options.rows;
        }
    }, {
        key: 'options',
        set: function set(_options) {
            var options = {
                gameCanvas: '',
                rows: 20,
                columns: 20,
                mineCount: 20,
                difficulty: 'easy'
            };

            for (var key in options) {
                if (_options[key] !== undefined) {
                    options[key] = _options[key];
                }
            }

            this._options = options;
        },
        get: function get() {
            return this._options;
        }
    }]);

    return MineSweeper;
}();
//# sourceMappingURL=engine.js.map
