function Game(rows, cols, blockSize, frame, ctx) {
    this._rows = rows;
    this._cols = cols;
    this._blockSize = blockSize;
    this._frame = frame;
    this._ctx = ctx;
    
    this._grid;
    
    this._player;
    this._playerState;
    
    this._balls = [];
    this._monsters = [];
    
    this._score = 0;
    this._level = 1;
    
    this._mute = true;
    this._audio = [];
    this._audio['fail'] = new Audio('sounds/fail.mp3');

    this._intervalId;
    
    this.init();
}

Game.NUM_OF_LIVES = 10;
Game.CONQUERED_PERCENT_MINIMUM_LIMIT = 75;
Game.NUM_OF_BALLS = 1;
Game.NUM_OF_MONSTERS = 1;

Game.FREE_FILL_COLOR = '#000000';
Game.CONQUERED_FILL_COLOR = '#00A8A8';
Game.TRACK_FILL_COLOR = '#00A8A8';
Game.PLAYER_FILL_COLOR = '#FFFFFF';
Game.PLAYER_STROKE_COLOR = '#901290';
Game.BALL_FILL_COLOR = '#00A8A8';
Game.BALL_STROKE_COLOR = '#ffffff';
Game.MONSTER_FILL_COLOR = '#00A8A8';
Game.MONSTER_STROKE_COLOR = '#000000';

Game.FREE_STATE = 0;
Game.CONQUERED_STATE = 1;
Game.TRACK_STATE = 2;

Game.KEY_CODES = {LEFT:37, UP:38, RIGHT:39, DOWN:40};

Game.prototype = {
    
    init: function () {
        this._grid = new Grid(this._rows, this._cols, Game.FREE_STATE);        
        
        this._balls = [];
        this._monsters = [];
        
        //build frames
        for (var i = 0, j = this._cols - 1, k = this._rows - 1; i < this._frame; i++, j--, k--) {
            this._grid.set_row(i, Game.CONQUERED_STATE);
            this._grid.set_row(k, Game.CONQUERED_STATE);
            this._grid.set_col(i, Game.CONQUERED_STATE);
            this._grid.set_col(j, Game.CONQUERED_STATE);
        }
        
        //create player
        this._player = new Player(0, Math.floor(this._cols / 2), new Vector(0, 0), this._grid);
        this._player.addEventListener('conquer', this.onConquer, this);
        this._player.addEventListener('fail', this.onFail, this);
        this._playerState = Game.CONQUERED_STATE;
        
        //create balls
        for (var i = 0; i < Game.NUM_OF_BALLS; i++) {
            var col = this._random(this._frame, this._cols - this._frame);
            var row = this._random(this._frame, this._rows - this._frame);
            var velocityX = (this._random(0, 1) == 0 ? -1 : 1);
            var velocityY = (this._random(0, 1) == 0 ? -1 : 1);
            
            var ball = new Ball(row, col, new Vector(velocityX, velocityY), this._grid, Game.CONQUERED_STATE);
            
            this._balls.push(ball);
        }
        
        //create monsters
        for (var i = 0; i < Game.NUM_OF_MONSTERS; i++) {
            var cols_1 = this._random(0, this._frame - 1);
            var cols_2 = this._random(this._cols - this._frame, this._cols - 1);
            var col = this._random(0, 1) == 0 ? cols_1 : cols_2;
            
            var rows_1 = this._random(0, this._frame - 1);
            var rows_2 = this._random(this._rows - this._frame, this._rows - 1);
            var row = this._random(0, 1) == 0 ? rows_1 : rows_2;
            
            var velocityX = this._random(0, 1) == 0 ? -1 : 1;
            var velocityY = this._random(0, 1) == 0 ? -1 : 1;
            
            var monster = new Monster(row, col, new Vector(velocityX, velocityY), this._grid, Game.FREE_STATE);
            this._monsters.push(monster);
        }
        
        //refresh score
        this.refreshScore();
        
        var self = this;
        
        $(document).keydown(function (event) {
            switch (event.keyCode) {
                case Game.KEY_CODES.LEFT:
                    self._player.moveLeft();
                    break;
                case Game.KEY_CODES.UP:
                    self._player.moveUp();
                    break;
                case Game.KEY_CODES.RIGHT:
                    self._player.moveRight();
                    break;
                case Game.KEY_CODES.DOWN:
                    self._player.moveDown();
                    break;
            }
        });
    },
    
    refreshScore: function () {
        var total = this._grid.get_size();
        var conqured = this._grid.get_count(Game.CONQUERED_STATE);
        conqured -= (2 * this._rows * this._frame) + (2 * (this._cols - this._frame) * this._frame);
        
        var pct = Math.round(conqured / total * 100);
        this._score += pct * 10;
        
        this._raiseEvent('conquer', pct);
        this._raiseEvent('score', this._score);
    },
    
    start: function () {
        var self = this;
        
        this._intervalId = setInterval(function () {
            self._ctx.clearRect(0, 0, self._cols * self._blockSize, self._rows * self._blockSize);
            self.step();
            self.draw();
        }, 1000 / 30);
    },

    step: function () {
        for (var i = 0; i < this._monsters.length; i++) {
            this._monsters[i].step();
        }
        
        for (var i = 0; i < this._balls.length; i++) {
            this._balls[i].step();
        }
        
        this._player.step();
        
        var row = this._player.get_row();
        var col = this._player.get_col();
        var state = this._grid.get_state(row, col);
        if (state == Game.FREE_STATE) {
            this._playerState = Game.TRACK_STATE;
            this._grid.set_state(row, col, Game.TRACK_STATE);
        } else if (state == Game.CONQUERED_STATE && this._playerState == Game.TRACK_STATE) {
            this._playerState = Game.CONQUERED_STATE;
            this._player.stop();            
            this._grid.replace(Game.TRACK_STATE, Game.CONQUERED_STATE);
            
            //todo:fill algorithm
            
            this.refreshScore();
        }
    },

    draw: function () {
        this._grid.draw(this._ctx, this._blockSize, Game.FREE_FILL_COLOR, Game.CONQUERED_FILL_COLOR, Game.TRACK_FILL_COLOR);
        
        for (var i = 0; i < this._monsters.length; i++) {
            this._monsters[i].draw(this._ctx, this._blockSize, Game.MONSTER_FILL_COLOR, Game.MONSTER_STROKE_COLOR);
        }
        
        for (var i = 0; i < this._balls.length; i++) {
            this._balls[i].draw(this._ctx, this._blockSize, Game.BALL_FILL_COLOR, Game.BALL_STROKE_COLOR);
        }
        
        this._player.draw(this._ctx, this._blockSize, Game.PLAYER_FILL_COLOR, Game.PLAYER_STROKE_COLOR);
    },
    
    _random: function (min, max) {
        var val = min + Math.random() * (max - min);
        return Math.round(val);
    }
    
}

Game.prototype = $.extend(
    {},
    EventHandler.prototype,
    Game.prototype
);