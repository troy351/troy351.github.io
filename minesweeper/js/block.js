define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

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

    var Block = function () {
        /**
         * construtor of block class
         * @param type the type of block on display enum['blank','cover','flag','question','number']
         * @param number the number of block(if blank, set 0; if mine, set -1)
         * @param x row number
         * @param y column number
         */
        function Block(type, number, y, x) {
            _classCallCheck(this, Block);

            this.type = type;
            this.number = number;
            this.x = x * Block.size;
            this.y = y * Block.size;
        }

        _createClass(Block, [{
            key: 'draw',
            value: function draw(isActive) {
                isActive = isActive || false;

                switch (this.type) {
                    case 'blank':
                        this._drawBlank();
                        break;
                    case 'cover':
                        if (isActive) {
                            this._drawActive();
                        } else {
                            this._drawCover();
                        }
                        break;
                    case 'flag':
                        this._drawFlag();
                        break;
                    case 'question':
                        this._drawQuestion();
                        break;
                    case 'number':
                        this._drawNumber();
                        break;
                    default:
                        console.error('block draw error');
                }
            }
        }, {
            key: 'drawMine',
            value: function drawMine() {
                this._drawMine();
            }
        }, {
            key: 'drawWrong',
            value: function drawWrong() {
                this._drawMine();
                Block.ctx.drawImage(Block.pics.redcross, this.x, this.y, Block.size, Block.size);
            }
        }, {
            key: 'drawBoom',
            value: function drawBoom() {
                Block.ctx.fillStyle = '#808080';
                Block.ctx.fillRect(this.x, this.y, Block.size, Block.size);
                Block.ctx.fillStyle = '#ff0000';
                Block.ctx.fillRect(this.x + 2, this.y + 2, Block.size - 4, Block.size - 4);
                Block.ctx.drawImage(Block.pics.mine, this.x, this.y, Block.size, Block.size);
            }
        }, {
            key: '_drawBlank',
            value: function _drawBlank() {
                Block.ctx.fillStyle = '#808080';
                Block.ctx.fillRect(this.x, this.y, Block.size, Block.size);
                Block.ctx.fillStyle = '#c0c0c0';
                Block.ctx.fillRect(this.x + 2, this.y + 2, Block.size - 4, Block.size - 4);
            }
        }, {
            key: '_drawCover',
            value: function _drawCover() {
                Block.ctx.drawImage(Block.pics.cover, this.x, this.y, Block.size, Block.size);
            }
        }, {
            key: '_drawMine',
            value: function _drawMine() {
                this._drawBlank();
                Block.ctx.drawImage(Block.pics.mine, this.x, this.y, Block.size, Block.size);
            }
        }, {
            key: '_drawNumber',
            value: function _drawNumber() {
                this._drawBlank();
                Block.ctx.drawImage(Block.pics.number[this.number - 1], this.x, this.y, Block.size, Block.size);
            }
        }, {
            key: '_drawFlag',
            value: function _drawFlag() {
                this._drawCover();
                Block.ctx.drawImage(Block.pics.flag, this.x, this.y, Block.size, Block.size);
            }
        }, {
            key: '_drawQuestion',
            value: function _drawQuestion() {
                this._drawCover();
                Block.ctx.drawImage(Block.pics.question, this.x, this.y, Block.size, Block.size);
            }
        }, {
            key: '_drawActive',
            value: function _drawActive() {
                this._drawBlank();
            }
        }]);

        return Block;
    }();

    exports.default = Block;


    var getImgElement = function getImgElement(data) {
        var elem = document.createElement('img');
        elem.src = data;
        return elem;
    };
    // static value
    var pics = {};
    pics.cover = getImgElement('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAgMAAADxkFD+AAAADFBMVEUAAADAwMCAgID///95JNgBAAAAAXRSTlMAQObYZgAAADBJREFUGNNjsP8PBVfhzL9ZDP+xM6+GgkHYqlEmZcyvWasgAIV5axU2ZhSCmQVnAgCELtzEEJni7QAAAABJRU5ErkJggg==');
    pics.mine = getImgElement('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAgMAAADxkFD+AAAACVBMVEUAAAAAAAD///+D3c/SAAAAAXRSTlMAQObYZgAAADtJREFUGNNjIBUwOpDBFGENDQ0QQWcyhgKBAx6maNTK0NAQUpmhUIDEBCsA0kAFpDEJOxLTb+QFFIkAAIcoKRTKBM2sAAAAAElFTkSuQmCC');
    pics.flag = getImgElement('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAgMAAADxkFD+AAAACVBMVEUAAAAAAAD/AAA9+90tAAAAAXRSTlMAQObYZgAAAC5JREFUGNNjoDrgWoGfqbUKC5NpFT4mpjbCtsGBCFnM0NAADCZjKBCEkMSkGQAAh9savIvXtfMAAAAASUVORK5CYII=');
    pics.question = getImgElement('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAACVJREFUCNdjIAX8P4BGsh/8gIdkYEQi2Q+gk3YMuEkEwK+SZAAAZh0Ued+H/kEAAAAASUVORK5CYII=');
    pics.redcross = getImgElement('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEUAAAD/AAAb/40iAAAAAXRSTlMAQObYZgAAAD5JREFUCNdjIAbwNzAwfkAhmR8wsB+Akgw1DHYMqKQ8ww84yfz8ABrJ8J8BD4lQiTAHQSJsgdiOTKK4EAcAAOI6JjXKKpCIAAAAAElFTkSuQmCC');

    pics.number = [];
    pics.number.push(getImgElement('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEUAAAAAAP+IZVZCAAAAAXRSTlMAQObYZgAAACBJREFUCNdjIAXIY5D/ESQzBimPRDKQR0JN+IGTJBUAAIRAHAIBPIiBAAAAAElFTkSuQmCC'));
    pics.number.push(getImgElement('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEUAAAAAgQCH/xDFAAAAAXRSTlMAQObYZgAAADNJREFUCNdjIAHI//+HRv7//78BTjLYo5EMyCQ7UD0q+f8DnJQHCqCS/w9ASagtOEkSAQBw/DM6jbNS2QAAAABJRU5ErkJggg=='));
    pics.number.push(getImgElement('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEUAAAD/AAAb/40iAAAAAXRSTlMAQObYZgAAACZJREFUCNdjIAH8//8Pg/zfACWBwB4fCVSPi8SvF2ELgkS4gVQAALbSMcUBalaCAAAAAElFTkSuQmCC'));
    pics.number.push(getImgElement('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEUAAAAAAIKm0VvDAAAAAXRSTlMAQObYZgAAACJJREFUCNdjIAGw//yHh5Q/iI/8//9/A26SgRGohiySVAAAB70utGuWOfQAAAAASUVORK5CYII='));
    pics.number.push(getImgElement('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEUAAACCAABH1nYhAAAAAXRSTlMAQObYZgAAACZJREFUCNdjIAH8//+/AQ8JVIGH/P8PRmLqBQJ7nCS6+n8oppEKAJT5OoUE+mkuAAAAAElFTkSuQmCC'));
    pics.number.push(getImgElement('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEUAAAAAgIEEW5IyAAAAAXRSTlMAQObYZgAAAChJREFUCNdjIAHI//+HRv5HJoEYD4mp/v//BjjJYI+TRKhEkAg3kAoAL7s4m4dq9kcAAAAASUVORK5CYII='));
    pics.number.push(getImgElement('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAACRJREFUCNdjIAH8//+/AScJBPb4SMZ/DHhI9g/4SPsDOElSAQD6+yP2rjzIZAAAAABJRU5ErkJggg=='));
    pics.number.push(getImgElement('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAABlBMVEUAAACAgICSabkkAAAAAXRSTlMAQObYZgAAACdJREFUCNdjIAHI//+HRv7//78BTjLY4yERujBJ/HoRtiBIhF5SAQCCOzf2NZO6BwAAAABJRU5ErkJggg=='));

    Block.ctx = null;
    Block.size = 0;
    Block.pics = pics;
});

//# sourceMappingURL=block.js.map