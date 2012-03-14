function Game(rows, cols, blockSize, frame, ctx) {
    this._blockSize = blockSize;
    this._frame = frame;
    this._rows = rows;
    this._cols = cols;
    this._ctx = ctx;
    this._grid;
    this._monsters = [];
    this._balls = [];
    this._intervalId;
}

Game.NUM_OF_LIVES = 10;
Game.CONQUERED_PERCENT_MINIMUM_LIMIT = 75;
Game.NUM_OF_MONSTERS = 1;
Game.NUM_OF_BALLS = 1;

Game.prototype = {

    init:function () {
        this._grid = new Grid(this._cols, this._rows, 0);

        for (var i = 0, j = this._cols - 1, k = this._rows - 1; i < this._frame; i++, j--, k--) {
            this._grid.set_row(i, 1);
            this._grid.set_row(j, 1);
            this._grid.set_col(i, 1);
            this._grid.set_col(k, 1);
        }

        //create balls
        for (var i = 0; i < Game.NUM_OF_BALLS; i++) {
            var col = this._random(this._frame , this._cols - this._frame);
            var row = this._random(this._frame, this._rows - this._frame);
            var velocityX = this._speed * (random(0, 1) == 0 ? -1 : 1);
            var velocityY = this._speed * (random(0, 1) == 0 ? -1 : 1);

            var ball = new Ball(x, y, this._ballSize / 2, '#00A8A8', 'White', new Vector(velocityX, velocityY), this._innerBoundary, this._arrConquered);

            this._arrBalls.push(ball);
        }

        //create monsters
        for (var i = 0; i < this._numOfMonsters; i++) {
            var left = random(0, this._rows - this._monsterSize);
            var top = random(this._cols - this._frameBorder, this._cols - this._monsterSize);
            var velocityX = this._speed * (random(0, 1) == 0 ? -1 : 1);
            var velocityY = this._speed * (random(0, 1) == 0 ? -1 : 1);
            var monster = new Monster(left, top, this._monsterSize, '#00A8A8', 'Black', new Vector(velocityX, velocityY), this._outerBoundary, this._arrFree);
            this._arrMonsters.push(monster);
        }

        $(document).keydown(function (event) {
            switch (event.keyCode) {
                case KEY_CODES.LEFT:
                    if (self._state == GAME_STATES.RUNNING) {
                        self._player.moveLeft();
                    }
                    break;
                case KEY_CODES.UP:
                    if (self._state == GAME_STATES.RUNNING) {
                        self._player.moveUp();
                    }
                    break;
                case KEY_CODES.RIGHT:
                    if (self._state == GAME_STATES.RUNNING) {
                        self._player.moveRight();
                    }
                    break;
                case KEY_CODES.DOWN:
                    if (self._state == GAME_STATES.RUNNING) {
                        self._player.moveDown();
                    }
                    break;
            }
        });
    },

    start:function () {

        var self = this;

        this._intervalId = setInterval(function () {
            try {
                self._ctx.clearRect(0, 0, self._rows * this._blockSize, self._cols * this._blockSize);
                self.step();
                self.draw();
            } catch (err) {
                clearInterval(self._intervalId);
                console.log(err.message);
            }
        }, 1000 / 30);

    },

    step:function () {

    },

    draw:function () {

    },

    _random:function (min, max) {
        var val = min + Math.random() * (max - min);
        return Math.round(val);
    }

}