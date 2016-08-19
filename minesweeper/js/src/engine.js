import _ from 'js/underscore.min';
import Block from 'js/block';
import Sound from 'js/sound';

export default class MineSweeper {
    constructor(options) {
        this.options = options;

        this._initGame();
        this._initMap();
        this._startGame();
    }

    _initGame() {
        this.gameArea = document.getElementById(this.options.gameArea);

        this.difficultySeletor = document.createElement('form');
        this.difficultySeletor.innerHTML = '<input type="button" name="easy" value="easy"><input type="button" name="normal" value="normal"><input type="button" name="hard" value="hard">';
        this.gameArea.appendChild(this.difficultySeletor);

        this.difficultySeletor.addEventListener('click', (event)=> {
            if (event.srcElement.nodeName === 'INPUT') {
                this.setDifficulty(event.srcElement.getAttribute('name'));
            }
        });

        this.canvas = document.createElement('canvas');
        this.canvas.innerText = 'Your browser does not support canvas, please upgrade your browser.';
        this.gameArea.appendChild(this.canvas);

        Block.size = this.options.blockSize;
        Block.ctx = this.canvas.getContext('2d');

        // window prevent context menu
        document.body.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
    }

    _initMap() {
        this.gameArea.style.width = this.options.blockSize * this.options.columns + 'px';
        // attention: do not use style.width && style.height
        this.canvas.width = this.options.blockSize * this.options.columns;
        this.canvas.height = this.options.blockSize * this.options.rows;

        this.map = [];
        for (let i = 0; i < this.options.rows; i++) {
            this.map[i] = [];
            for (let j = 0; j < this.options.columns; j++) {
                this.map[i][j] = new Block('cover', 0, i, j);
                this.map[i][j].draw();
            }
        }
    }


    _updateMap(button, method, coor) {
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
        const updateFrame = ()=> {
            for (let i = 0; i < this.options.rows; i++) {
                for (let j = 0; j < this.options.columns; j++) {
                    if (button === 'lr' && (method === 'down' || method === 'move')) {
                        // for lr & down/move
                        if (Math.abs(coor.i - i) < 2 && Math.abs(coor.j - j) < 2) {
                            this.map[i][j].draw(true);
                        } else {
                            this.map[i][j].draw(false);
                        }
                    } else if (button === 'l' && (method === 'down' || method === 'move')) {
                        // for l & down/move
                        if (i === coor.i && j === coor.j) {
                            this.map[i][j].draw(true);
                        } else {
                            this.map[i][j].draw(false);
                        }
                    } else {
                        // for others
                        this.map[i][j].draw(false);
                    }
                }
            }
        }

        window.requestAnimationFrame(updateFrame);
    }

    _expandMap(coor) {
    }

    _startGame() {
        const timeGap = 50;
        let lastClickButton = -1;
        let lastClickTime = 0;
        let timer = null;

        const getBlockPosition = (x, y)=> {
            const j = Math.floor(x / this.options.blockSize);
            const i = Math.floor(y / this.options.blockSize);
            if (i < this.options.rows && i >= 0 && j < this.options.columns && j >= 0) {
                return {i: i, j: j};
            } else {
                return false;
            }
        };

        const mouseDown = (event)=> {
            const coor = getBlockPosition(event.offsetX, event.offsetY);
            let currentButton = null;
            if (event.button + lastClickButton === 2 && Date.now() - lastClickTime < timeGap) {
                // left && right click
                clearTimeout(timer);
                currentButton = 'lr';
                this._updateMap(currentButton, 'down', coor);
            } else if (event.button === 0) {
                // left click
                timer = setTimeout(()=> {
                    currentButton = 'l';
                    this._updateMap(currentButton, 'down', coor);
                }, timeGap)
            } else if (event.button === 2) {
                // right click
                timer = setTimeout(()=> {
                    currentButton = 'r';
                    this._updateMap(currentButton, 'down', coor);
                }, timeGap)
            }

            lastClickTime = Date.now();
            lastClickButton = event.button;

            const mouseMove = (event)=> {
                console.log('move')
                const coor = getBlockPosition(event.offsetX, event.offsetY);
                if (currentButton === 'l' || currentButton === 'lr') {
                    this._updateMap(currentButton, 'move', coor);
                }
            };

            const mouseUp = (event)=> {
                const coor = getBlockPosition(event.offsetX, event.offsetY);
                if (currentButton === 'l' || currentButton === 'lr') {
                    this._updateMap(currentButton, 'up', coor);
                }

                window.removeEventListener('mousemove', mouseMove);
                window.removeEventListener('mouseup', mouseUp);
            };

            window.addEventListener('mousemove', mouseMove);
            window.addEventListener('mouseup', mouseUp);
        };

        this.canvas.addEventListener('mousedown', mouseDown);
    }

    _gameOver() {
    }

    setDifficulty(difficulty) {
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

    set options(_options) {
        const options = {
            gameArea: '',
            rows: 9,
            columns: 9,
            mineCount: 10
        };

        for (let key in options) {
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
    }

    get options() {
        return this._options;
    }
}