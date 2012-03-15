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

    this._levelScore;
    this._totalScore;
    this._numOfLives;
    this._level;

    this._mute = false;
    this._audio = [];
    this._audio['fail'] = new Audio('sounds/fail.wav');
    this._audio['end'] = new Audio('sounds/end.wav');
    this._audio['timeout'] = new Audio('sounds/timeout.wav');
    this._audio['level'] = new Audio('sounds/level.wav');
    this._loadAudio();
    
    this._intervalId;
    this._timerIntervalId;
    this._time;

    this.init();
}

Game.NUM_OF_LIVES = 3;
Game.CONQUERED_PERCENT_MINIMUM_LIMIT = 75;
Game.NUM_OF_BALLS = 1;
Game.NUM_OF_MONSTERS = 1;
Game.INITIAL_TIME_SEC = 90;

Game.FREE_FILL_COLOR = '#000000';
Game.CONQUERED_FILL_COLOR = '#00A8A8';
Game.TRACK_FILL_COLOR = '#901290';
Game.PLAYER_FILL_COLOR = '#FFFFFF';
Game.PLAYER_STROKE_COLOR = '#901290';
Game.BALL_FILL_COLOR = '#00A8A8';
Game.BALL_STROKE_COLOR = '#ffffff';
Game.MONSTER_FILL_COLOR = '#00A8A8';
Game.MONSTER_STROKE_COLOR = '#000000';

Game.FREE_STATE = 0;
Game.CONQUERED_STATE = 1;
Game.TRACK_STATE = 2;
Game.FLOOD_STATE = 1000;

Game.KEY_CODES = {LEFT:37, UP:38, RIGHT:39, DOWN:40};

Game.prototype = {
    
    init: function () {
        this._score = 0;
        this._numOfLives = Game.NUM_OF_LIVES;
        
        //reset level
        this.resetLevel(1);
        
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
    
    resetLevel: function (level) {
        this._level = level;
        
        this._grid = new Grid(this._rows, this._cols, Game.FREE_STATE);
        
        this._balls = [];
        this._monsters = [];
        
        this._levelScore = 0;
        
        //build frames
        for (var i = 0, j = this._cols - 1, k = this._rows - 1; i < this._frame; i++, j--, k--) {
            this._grid.set_row(i, Game.CONQUERED_STATE);
            this._grid.set_row(k, Game.CONQUERED_STATE);
            this._grid.set_col(i, Game.CONQUERED_STATE);
            this._grid.set_col(j, Game.CONQUERED_STATE);
        }
        
        //create player
        this._player = new Player(0, Math.floor(this._cols / 2), new Vector(0, 0), this._grid);
        this._playerState = Game.CONQUERED_STATE;
        
        //create balls
        var numOfBalls = Game.NUM_OF_BALLS * this._level;
        for (var i = 0; i < numOfBalls; i++) {
            this._createBall();
        }
        
        //create monsters
        this._resetMonsters();
        
        //update score
        this.updateScore();
        
        this._resetTimer();
    },
    
    updateScore: function () {
        //todo: find last conquer to increase score
        
        var total = (this._rows - 2 * this._frame) * (this._cols - 2 * this._frame);
        var frame = (this._frame * this._cols * 2) + (this._rows - 2 * this._frame ) * this._frame * 2;
        var conqured = this._grid.get_count(Game.CONQUERED_STATE) - frame;
        console.log('conqured - ' + conqured);
        var pct = Math.round(conqured / total * 100);
        this._levelScore = Math.round(pct/100 * 2200) - this._levelScore;
        this._score += this._levelScore;
        
        this._raiseEvent('conquer', pct);
        this._raiseEvent('score', this._score);
        
        if (pct >= Game.CONQUERED_PERCENT_MINIMUM_LIMIT) {
            this.nextLevel();
        }
    },
        
    fail: function () {
        this.stop();
        this._numOfLives--;
        this._raiseEvent('fail', this._numOfLives);
        
        if (this._numOfLives == 0) {
            this.end();
        } else {
            this._playAudio('fail');
            
            var self = this;
            setTimeout(function() {
                self._resetMonsters();
                self._resetPlayer();
                self._grid.replace(Game.TRACK_STATE, Game.FREE_STATE);
                self.start();
                self._resetTimer();
            }, 1000);
        }
    },
    
    nextLevel: function () {
        this.stop();
        this._playAudio('level');
        
        var self = this;
        setTimeout(function() {
            self.resetLevel(self._level + 1);
            self.start();
        }, 1000); 
    },
    
    end: function () {
        this._playAudio('end');
        this._raiseEvent('end', this._score);
        
        var self = this;
        setTimeout(function() {
            //todo
        }, 2000); 
    },

    start: function () {
        var self = this;
        
        this._intervalId = setInterval(function () {
            self._ctx.clearRect(0, 0, self._cols * self._blockSize, self._rows * self._blockSize);
            self.step();
            self.draw();
        }, 1000 / 35);
        
        this._timerIntervalId = setInterval(function() {
            self._updateTimer();
        }, 1000);
    },
    
    stop: function () {
        clearInterval(this._intervalId);
        clearInterval(this._timerIntervalId);
    },
    
    step: function () {
        var player = this._player;
        var grid = this._grid;
        
        player.step();
        
        var row = player.get_row();
        var col = player.get_col();
        var state = grid.get_state(row, col);
        if (state == Game.FREE_STATE) {            
            this._playerState = Game.TRACK_STATE;
            grid.set_state(row, col, Game.TRACK_STATE);
        } else if (state == Game.TRACK_STATE) {
            this.fail();
        } else if (state == Game.CONQUERED_STATE && this._playerState == Game.TRACK_STATE) {
            this._playerState = Game.CONQUERED_STATE;
            player.stop();
            grid.replace(Game.TRACK_STATE, Game.CONQUERED_STATE);
            
            var floodStates = {};
            var floodState = Game.FLOOD_STATE;
            
            var cell = grid.findFirst(Game.FREE_STATE);            
            while (cell) {
                grid.flood(cell.row, cell.col, Game.FREE_STATE, floodState);
                floodStates[floodState++] = false;
                cell = grid.findFirst(Game.FREE_STATE);
            }
            
            for (var ball in this._balls) {
                ball = this._balls[ball];
                var state = grid.get_state(ball.get_row(), ball.get_col());
                floodStates[state] = true;
            }
            
            for (var floodIndex in floodStates) {
                floodState = floodStates[floodIndex];
                
                if (floodState) {
                    grid.replace(floodIndex, Game.FREE_STATE);
                } else {
                    grid.replace(floodIndex, Game.CONQUERED_STATE);
                }
            }
            
            //update score
            this.updateScore();
        }
        
        var playerState = grid.get_state(player.get_row(), player.get_col());
        
        for (var i = 0; i < this._monsters.length; i++) {
            var monster = this._monsters[i];
            
            if (playerState == Game.CONQUERED_STATE) {
                for (var k = -1; k <= 1; k++) {
                    var row = player.get_row() + k;
                    for (var j = -1; j <= 1; j++) {
                        var col = player.get_col() + j;
                        if (row >= 0 && row < this._rows && col >= 0 && col < this._cols) {
                            if (row == monster.get_row() && col == monster.get_col()) {
                                this.fail();
                                return;
                            }
                        }
                    }
                }
            }
            
            monster.step();
        }
        
        for (var i = 0; i < this._balls.length; i++) {
            var ball = this._balls[i];
            
            var state = grid.get_state(ball.get_row() + ball.get_velocity().get_y(), ball.get_col() + ball.get_velocity().get_x());
            if (state == Game.TRACK_STATE) {
                this.fail();
                return;
            }
            
            ball.step();
        }
    },

    draw: function () {
        //draw grid
        this._grid.draw(this._ctx, this._blockSize, Game.FREE_FILL_COLOR, Game.CONQUERED_FILL_COLOR, Game.TRACK_FILL_COLOR);
        
        //draw monsters
        for (var i = 0; i < this._monsters.length; i++) {
            this._monsters[i].draw(this._ctx, this._blockSize, Game.MONSTER_FILL_COLOR, Game.MONSTER_STROKE_COLOR);
        }
        
        //draw balls
        for (var i = 0; i < this._balls.length; i++) {
            this._balls[i].draw(this._ctx, this._blockSize, Game.BALL_FILL_COLOR, Game.BALL_STROKE_COLOR);
        }
        
        //draw player
        var fillStyle = this._playerState == Game.TRACK_STATE ? Game.PLAYER_STROKE_COLOR : Game.PLAYER_FILL_COLOR;
        var strokeStyle = this._playerState == Game.TRACK_STATE ? Game.PLAYER_FILL_COLOR : Game.PLAYER_STROKE_COLOR;
        this._player.draw(this._ctx, this._blockSize, fillStyle, strokeStyle);
    },
    
    _createBall: function () {
        var col = this._random(this._frame, this._cols - this._frame);
        var row = this._random(this._frame, this._rows - this._frame);
        var velocityX = (this._random(0, 1) == 0 ? -1 : 1);
        var velocityY = (this._random(0, 1) == 0 ? -1 : 1);
        
        var ball = new Ball(row, col, new Vector(velocityX, velocityY), this._grid, Game.CONQUERED_STATE);
        
        this._balls.push(ball);
    },
    
    _createMonster: function () {
        
        var row = this._rows - 1;
        var col = this._cols / 2 - 1;
        
        var player_col = this._player.get_col();
        var player_row = this._player.get_row();
        
        var velocityX = this._random(0, 1) == 0 ? -1 : 1;
        var velocityY = this._random(0, 1) == 0 ? -1 : 1;
        
        /*if ( Math.sqrt(Math.pow(col - player_col, 2) + Math.pow(row - player_row, 2)) < this._cols / 2)
        {
            console.log("too close !!!");
            
            if ((player_col - col) / velocityX > 0)
            {
                velocityX *= -1;
            }
        }*/
        
        var monster = new Monster(row, col, new Vector(velocityX, velocityY), this._grid, Game.FREE_STATE);
        
        this._monsters.push(monster);
    },
    
    _resetMonsters: function () {
        var numOfMonsters = this._monsters.length || Game.NUM_OF_MONSTERS;
        
        this._monsters = [];
        
        for (var i = 0; i < numOfMonsters; i++) {
            this._createMonster();
        }
    },
    
    _resetPlayer: function () {
        this._player.stop();
        this._player.moveTo(0, Math.floor(this._cols / 2));
    },
    
    _loadAudio: function () {
        for (var idx in this._audio) {
            this._audio[idx].load();
        }
    },
    
    _playAudio: function (a) {
        if (!this._mute && this._audio[a])
            this._audio[a].play();
    },
    
        
    _updateTimer: function() {
        if (! --this._time)
            {
                this._playAudio('timeout');
                this._createMonster();
                this._time = Game.INITIAL_TIME_SEC;
            }
            this._raiseEvent("timer", this._time);       
    },
    
    _resetTimer: function() {
        //Initialize the timer
        this._time = Game.INITIAL_TIME_SEC;        
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