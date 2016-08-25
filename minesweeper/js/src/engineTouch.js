import Block from 'js/block';

export default class MineSweeper {
    constructor(options) {
        this.options = options;

        this._initGame();
        this.setLevel('Easy');
        this._startGame();
    }

    _initGame() {
        this.gameArea = document.getElementById(this.options.gameArea);

        // menu
        this._menuWrapper = document.createElement('div');
        this._menuWrapper.className = 'menu';
        this._menuWrapper.innerHTML = '<span>Menu</span>';
        this._menu = document.createElement('ul');
        this._menu.innerHTML = '<li>Start</li><a class="gap"></a><li class="current">Easy</li><li>Normal</li><li>Hard</li><li>Custom</li>';
        this._menuWrapper.appendChild(this._menu);
        this.gameArea.appendChild(this._menuWrapper);

        const menuButton = this._menuWrapper.getElementsByTagName('span')[0];
        // event for menu show
        menuButton.addEventListener('click', (event)=> {
            this._menu.style.display = 'block';
            menuButton.className = 'on';
            event.stopPropagation();
        });
        // event for menu hide
        window.addEventListener('click', (event)=> {
            this._menu.style.display = 'none';
            menuButton.className = '';
        });
        // event for menu click
        this._menu.addEventListener('click', (event)=> {
            if (event.srcElement.nodeName === 'LI') {
                if (event.srcElement.innerText === 'Start') {
                    this._initMap();
                } else {
                    this.setLevel(event.srcElement.innerText);
                }
            }
        });
        // for custom level setter
        this._levelSelector = document.createElement('div');
        this._levelSelector.className = 'custom-level';
        this._levelSelector.innerHTML = `
            <form>
                <p>Width: <input type="number" title="width"></p>
                <p>Height: <input type="number" title="height"></p>
                <p>Mines: <input type="number" title="mines"></p>
                <div><input type="submit" value="Submit"></div>
                <div><input type="button" value="Cancel"></div>
            </form>`;
        document.body.appendChild(this._levelSelector);


        const mainGame = document.createElement('div');
        mainGame.className = 'main-game';
        //mines left, face, and timer;
        const digitalWrapper = document.createElement('div');
        digitalWrapper.className = 'digital-wrapper';
        this._mines = document.createElement('span');
        this._time = document.createElement('span');
        this._time.innerHTML = '000';
        this._face = document.createElement('div');

        digitalWrapper.appendChild(this._mines);
        digitalWrapper.appendChild(this._face);
        digitalWrapper.appendChild(this._time);
        mainGame.appendChild(digitalWrapper);

        this._face.addEventListener('click', ()=> {
            this._initMap();
        });

        // game canvas
        this.canvas = document.createElement('canvas');
        this.canvas.innerText = 'Your browser does not support canvas, please upgrade your browser.';
        mainGame.appendChild(this.canvas);

        this.gameArea.appendChild(mainGame);

        // init block
        Block.size = this.options.blockSize;
        Block.ctx = this.canvas.getContext('2d');
    }

    _initMap() {
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
        for (let i = 0; i < this.options.rows; i++) {
            this.map[i] = [];
            for (let j = 0; j < this.options.columns; j++) {
                this.map[i][j] = new Block('cover', 0, i, j);
                this.map[i][j].draw(false);
            }
        }
    }

    _setMines(coor) {
        // generate mines
        const mines = [];
        for (let i = 0; i < this.options.rows * this.options.columns; i++) {
            if (i < this.options.mineTotal) {
                mines[i] = -1;
            } else {
                mines[i] = 0;
            }
        }

        // shuffle mines

        // use [Fisher-Yates shuffle] to shuffle mines
        for (let i = this.options.rows * this.options.columns - 1; i > 0; i--) {
            const ran = Math.floor(Math.random() * i);

            let temp = mines[i];
            mines[i] = mines[ran];
            mines[ran] = temp;
        }

        // the block at first touch position can not be mine
        const firstPosition = coor.i * this.options.columns + coor.j;
        while (mines[firstPosition] === -1) {
            const ran = Math.floor(Math.random() * this.options.rows * this.options.columns)
            if (mines[ran] === 0) {
                let temp = mines[firstPosition];
                mines[firstPosition] = mines[ran];
                mines[ran] = temp;
            }
        }

        // set mines
        for (let i = 0; i < this.options.rows; i++) {
            for (let j = 0; j < this.options.columns; j++) {
                this.map[i][j].number = mines[i * this.options.columns + j];
            }
        }

        // calculate numbers
        for (let i = 0; i < this.options.rows; i++) {
            for (let j = 0; j < this.options.columns; j++) {
                if (this.map[i][j].number !== -1) {
                    for (let x = i - 1; x <= i + 1; x++) {
                        for (let y = j - 1; y <= j + 1; y++) {
                            if (x < this.options.rows && x >= 0 && y < this.options.columns && y >= 0 && this.map[x][y].number === -1) {
                                this.map[i][j].number++;
                            }
                        }
                    }
                }
            }
        }

        // set timer
        this._time.innerText = '000';
        this.timer = setInterval(()=> {
            this.time = 'add';
        }, 1000);
    }

    _updateMap(method, coor) {
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
        if (coor !== false && method === 't' && this.map[coor.i][coor.j].type !== 'blank' && this.map[coor.i][coor.j].type !== 'number') {
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
        if (coor !== false && method === 'db' && ( this.map[coor.i][coor.j].type === 'blank' || this.map[coor.i][coor.j].type === 'number')) {
            if (this.map[coor.i][coor.j].type === 'number') {
                // count flag around coor
                let flags = 0;
                for (let x = coor.i - 1; x <= coor.i + 1; x++) {
                    for (let y = coor.j - 1; y <= coor.j + 1; y++) {
                        if (x < this.options.rows && x >= 0 && y < this.options.columns && y >= 0 && this.map[x][y].type === 'flag') {
                            flags++;
                        }
                    }
                }
                // show blocks around coor
                if (flags === this.map[coor.i][coor.j].number) {
                    for (let x = coor.i - 1; x <= coor.i + 1; x++) {
                        for (let y = coor.j - 1; y <= coor.j + 1; y++) {
                            if (x < this.options.rows && x >= 0 && y < this.options.columns && y >= 0 && this.map[x][y].type === 'cover') {
                                switch (this.map[x][y].number) {
                                    case 0:
                                        this._expandMap({i: x, j: y});
                                        break;
                                    case -1:
                                        this._gameOver({i: x, j: y});
                                        return;
                                    default:
                                        this.map[x][y].type = 'number';
                                }
                            }
                        }
                    }
                }
            }
        }

        // updateframe
        this.win = true;
        for (let i = 0; i < this.options.rows; i++) {
            for (let j = 0; j < this.options.columns; j++) {
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

    _expandMap(coor) {
        if (coor.i < this.options.rows && coor.i >= 0 && coor.j < this.options.columns && coor.j >= 0) {
            // in map area
            if (this.map[coor.i][coor.j].number === 0) {
                if (this.map[coor.i][coor.j].type !== 'blank') {
                    // blank, expand
                    this.map[coor.i][coor.j].type = 'blank';
                    // expend at left, right, up, down
                    this._expandMap({i: coor.i, j: coor.j - 1});
                    this._expandMap({i: coor.i, j: coor.j + 1});
                    this._expandMap({i: coor.i + 1, j: coor.j - 1});
                    this._expandMap({i: coor.i + 1, j: coor.j + 1});
                    this._expandMap({i: coor.i - 1, j: coor.j - 1});
                    this._expandMap({i: coor.i - 1, j: coor.j + 1});
                    this._expandMap({i: coor.i - 1, j: coor.j});
                    this._expandMap({i: coor.i + 1, j: coor.j});
                }
            } else {
                // number, stop expand
                this.map[coor.i][coor.j].type = 'number';
            }
        }
    }

    _startGame() {
        const timeGap = 200;
        let lastTouchCoor = {i: 0, j: 0};
        let lastTouchTime = 0;
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

        this.canvas.addEventListener('touchstart', (event)=> {
            const coor = getBlockPosition(event.targetTouches[0].pageX - this.clientRect.left, event.targetTouches[0].pageY - this.clientRect.top);

            let touchCancel = false;
            let touchMethod = null;
            if (lastTouchCoor.i === coor.i && lastTouchCoor.j === coor.j && Date.now() - lastTouchTime < timeGap) {
                // double touch
                clearTimeout(timer);
                touchMethod = 'db';
            } else {
                // single touch
                touchMethod = 't';
            }
            // update current touch
            lastTouchTime = Date.now();
            lastTouchCoor.i = coor.i;
            lastTouchCoor.j = coor.j;
            // update face
            this._face.className = 'click';

            const touchMove = (event)=> {
                if (touchCancel) {
                    return;
                }
                var rect = event.target.getBoundingClientRect();
                const coor = getBlockPosition(event.changedTouches[0].pageX - this.clientRect.left, event.changedTouches[0].pageY - this.clientRect.top);

                if (lastTouchCoor.i !== coor.i || lastTouchCoor.j !== coor.j) {
                    touchCancel = true;
                }
            };

            const touchEnd = (event)=> {
                if (!touchCancel) {
                    if (touchMethod === 'db') {
                        this._updateMap('db', coor);
                    } else {
                        timer = setTimeout(()=> {
                            this._updateMap('t', coor);
                        }, timeGap)
                    }
                }
                // update face
                this._face.className = 'normal';
                window.removeEventListener('touchmove', touchMove);
                window.removeEventListener('touchend', touchEnd);
            };
            //
            window.addEventListener('touchmove', touchMove);
            window.addEventListener('touchend', touchEnd);
        });
    }

    _gameOver(coor) {
        this.gameOver = true;
        // show all mines
        for (let i = 0; i < this.options.rows; i++) {
            for (let j = 0; j < this.options.columns; j++) {
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

    _gameWin() {
        // show all mines
        for (let i = 0; i < this.options.rows; i++) {
            for (let j = 0; j < this.options.columns; j++) {
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

    _addZero(data, length) {
        length = length || 3;
        data = data + '';
        while (data.length < length) {
            data = '0' + data;
        }
        return data;
    }

    setLevel(level) {
        switch (level) {
            case 'Easy':
                this.options.rows = 9;
                this.options.columns = 9;
                this.options.mineTotal = 10;
                this._menu.innerHTML = '<li>Start</li><a class="gap"></a><li class="current">Easy</li><li>Normal</li><li>Hard</li><li>Custom</li>';
                break;
            case 'Normal':
                this.options.rows = 16;
                this.options.columns = 16;
                this.options.mineTotal = 40;
                this._menu.innerHTML = '<li>Start</li><a class="gap"></a><li>Easy</li><li class="current">Normal</li><li>Hard</li><li>Custom</li>';
                break;
            case 'Hard':
                this.options.rows = 16;
                this.options.columns = 30;
                this.options.mineTotal = 99;
                this._menu.innerHTML = '<li>Start</li><a class="gap"></a><li>Easy</li><li>Normal</li><li class="current">Hard</li><li>Custom</li>';
                break;
            case 'Custom':
                clearInterval(this.timer);
                this.selectingLevel = true;
                // append current data
                const inputs = this._levelSelector.getElementsByTagName('input');
                inputs[0].value = this.options.columns;
                inputs[1].value = this.options.rows;
                inputs[2].value = this.options.mineTotal;
                // add button listener
                inputs[3].addEventListener('click', (event)=> {
                    this._menu.innerHTML = '<li>Start</li><a class="gap"></a><li>Easy</li><li>Normal</li><li>Hard</li><li class="current">Custom</li>';
                    this._levelSelector.style.display = 'none';
                    const options = {
                        rows: parseInt(inputs[1].value),
                        columns: parseInt(inputs[0].value),
                        mineTotal: parseInt(inputs[2].value)
                    };
                    this.options = options;
                    this._initMap();
                    event.preventDefault();
                });
                inputs[4].addEventListener('click', (event)=> {
                    this._levelSelector.style.display = 'none';
                    this.selectingLevel = false;
                });
                // show level selector
                this._levelSelector.style.display = 'block';
                return;
            default:
                console.error('minesweeper: no such difficulty');
        }

        window.scrollTo(0, 0);
        this.clientRect = this.canvas.getBoundingClientRect();

        this._initMap();
    }

    set mines(num) {
        this._mines.innerText = this._addZero(parseInt(this._mines.innerText) + num);
    }

    set time(str) {
        const time = parseInt(this._time.innerText) + 1;
        if (time >= 999) {
            clearInterval(this.timer);
        }
        this._time.innerText = this._addZero(time);
    }

    set options(_options) {
        const options = {
            gameArea: '',
            rows: 0,
            columns: 0,
            mineTotal: 0
        };

        for (let key in options) {
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
    }

    get options() {
        return this._options;
    }
}