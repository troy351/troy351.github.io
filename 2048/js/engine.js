define(['exports', 'js/block', 'js/action'], function (exports, _block, _action) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _block2 = _interopRequireDefault(_block);

    var _action2 = _interopRequireDefault(_action);

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

    var Game2048 = function () {
        function Game2048(options) {
            _classCallCheck(this, Game2048);

            this.options = options;
        }

        _createClass(Game2048, [{
            key: 'options',
            set: function set(_options) {
                var options = {
                    canvas: ''
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

        return Game2048;
    }();

    exports.default = Game2048;
});

//# sourceMappingURL=engine.js.map