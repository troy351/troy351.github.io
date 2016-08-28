import Block from 'js/block';
import Action from 'js/action';

export default class Game2048 {
    constructor(options) {
        this.options = options;
    }

    set options(_options) {
        const options = {
            canvas: ''
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