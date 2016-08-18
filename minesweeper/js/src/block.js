export class Block {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.pics = {
            default: '',
            active: '',
            mine: ''
        }
    }

    drawDefault(ctx, x, y) {

    };

    drawActive() {
    };

    drawNumber() {
    };

    drawMine() {
    };
}