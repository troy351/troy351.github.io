'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Block = exports.Block = function () {
    function Block(width, height) {
        _classCallCheck(this, Block);

        this.width = width;
        this.height = height;

        this.pics = {
            default: '',
            active: '',
            mine: ''
        };
    }

    _createClass(Block, [{
        key: 'drawDefault',
        value: function drawDefault(ctx, x, y) {}
    }, {
        key: 'drawActive',
        value: function drawActive() {}
    }, {
        key: 'drawNumber',
        value: function drawNumber() {}
    }, {
        key: 'drawMine',
        value: function drawMine() {}
    }]);

    return Block;
}();
//# sourceMappingURL=block.js.map
