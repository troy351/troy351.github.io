import {Block} from 'block';
import {Sound} from 'sound';

class MineSweeper {
    constructor(options) {
        this.options = options;
        if (options.rows * options.columns / 3 < options.mineCount) {
            console.log('There are too many mines setted.')
        }

        this.canvas = document.getElementById(this.options.gameCanvas);
        this.initSize();
    }

    initSize() {
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

    set options(_options) {
        const options = {
            gameCanvas: '',
            rows: 20,
            columns: 20,
            mineCount: 20,
            difficulty: 'easy'
        };

        for (let key in options) {
            if (_options[key] !== undefined) {
                options[key] = _options[key];
            }
        }

        this._options = options;
    }

    get options() {
        return this._options;
    }
}