function Game(width, height, frameBorder, ctx) {
    this._width = width;
    this._height = height;
    this._frameBorder = frameBorder;
    this._ctx = ctx;
    this._numOfLives = Game.NUM_OF_LIVES;
    this._playerSize = Game.PLAYER_SIZE;
    this._speed = Game.SPEED;
    this._player = null;
    this._numOfMonsters = Game.NUM_OF_MONSTERS;
    this._monsterSize = 9;
    this._numOfBalls = 3;
    this._ballSize = 8;
    this._arrFree = [];
    this._arrConquered = [];
    this._arrBalls = [];
    this._arrMonsters = [];
    this._outerBoundary = null;
    this._innerBoundary = null;
    this._totalArea = 0;
    this._conquredArea = 0;
    this._arrFree = [];

    this._score = 0;

    this._mute = false;
    this._audio = [];
    this._audio['fail'] = new Audio('sounds/fail.mp3');
    this._outerBoundary = null;
    this._innerBoundary = null;

    this.init();
}

Game.NUM_OF_LIVES = 3;
Game.PLAYER_SIZE = 9;
Game.SPEED = 4;
Game.CONQUERED_PERCENT_MINIMUM_LIMIT = 75;
Game.NUM_OF_MONSTERS = 1;

Game.prototype = {

    init:function () {

        this._arrFree = [];
        this._arrConquered = [];
        this._arrBalls = [];
        this._arrMonsters = [];

        this._totalArea = (this._width - this._frameBorder) * (this._height - this._frameBorder);
        this._conquredArea = 0;

        this._outerBoundary = new Rectangle(0, 0, this._width, this._height);
        this._innerBoundary = new Rectangle(this._frameBorder, this._frameBorder, this._width - this._frameBorder, this._height - this._frameBorder);

        //create player
        this._player = new Player(this._width / 2 - this._playerSize / 2, 0, this._playerSize, this._speed, 'White', '#901290', this._outerBoundary);
        this._player.addEventListener('conquer', this.onConquer, this);
        this._player.addEventListener('fail', this.onFail, this);

        var self = this;

        //create start free area
        var free = new Polygon([
            new Point(this._frameBorder, this._frameBorder),
            new Point(this._width - this._frameBorder, this._frameBorder),
            new Point(this._width - this._frameBorder, this._height - this._frameBorder),
            new Point(this._frameBorder, this._height - this._frameBorder)
        ]);
        this._arrFree.push(free);

        //create balls
        for (var i = 0; i < this._numOfBalls; i++) {
            var x = random(this._frameBorder * 2, this._width - this._frameBorder * 2);
            var y = random(this._frameBorder * 2, this._height - this._frameBorder * 2);
            var velocityX = this._speed * (random(0, 1) == 0 ? -1 : 1);
            var velocityY = this._speed * (random(0, 1) == 0 ? -1 : 1);

            var ball = new Ball(x, y, this._ballSize / 2, '#00A8A8', 'White', new Vector(velocityX, velocityY), this._innerBoundary, this._arrConquered);

            this._arrBalls.push(ball);
        }

        //create monsters
        for (var i = 0; i < this._numOfMonsters; i++) {
            var left = random(0, this._width - this._monsterSize);
            var top = random(this._height - this._frameBorder, this._height - this._monsterSize);
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

        this._state = GAME_STATES.RUNNING;

        this._intervalId = setInterval(function () {
            self._ctx.clearRect(0, 0, self._width, self._height);
            self.step();
            self.draw();
        }, 1000 / 60);
    },

    stop:function () {
        clearInterval(this._intervalId);
        this._state = GAME_STATES.STOPPED;
    },

    end:function () {
        this._state = GAME_STATES.ENDED;
        this.stop();
    },

    step:function () {

        //update ball's obstacles
        for (var ball in this._arrBalls) {
            this._arrBalls[ball].set_obstacles(this._arrConquered);
            this._arrBalls[ball].step();
        }

        //update monster's obstacles
        for (var monster in this._arrMonsters) {
            this._arrMonsters[monster].set_obstacles(this._arrFree);
            this._arrMonsters[monster].step();
        }

        //update player's enemies
        this._player.set_enemies(this.get_enemies());
        this._player.set_conqueredAreas(this._arrConquered);
        this._player.set_freeAreas(this._arrFree);
        this._player.step();
    },

    draw:function () {
        this._drawArray(this._ctx, this._arrFree, 'Black');
        this._drawArray(this._ctx, this._arrConquered, '#00A8A8');
        this._drawArray(this._ctx, this._arrBalls);
        this._drawArray(this._ctx, this._arrMonsters);
        this._player.draw(this._ctx);
    },

    _drawArray:function (ctx, array, fillStyle) {
        for (var i = 0; i < array.length; i++) {
            var obj = array[i];
            obj.draw(ctx, fillStyle);
        }
    },

    get_enemies:function () {
        var obstacles = [];

        for (var ball in this._arrBalls) {
            obstacles.push(this._arrBalls[ball].get_box());
        }
        for (var monster in this._arrMonsters) {
            obstacles.push(this._arrMonsters[monster].get_box());
        }

        return obstacles;
    },

    onConquer:function (sourcePolyIndex, trackPoly, innerPath, outerPath) {
        var area = 0;

        //split
        var result = [];
        var firstPoly = this._arrFree[sourcePolyIndex].split(innerPath)[0];
        var secondPoly = this._arrFree[sourcePolyIndex].split(outerPath)[1];

        result.push(firstPoly);
        result.push(secondPoly);

        //since we now conquered part of the free area, we'll remove it from the list of free areas
        this._arrFree.splice(sourcePolyIndex, 1);

        for (var i = 0; i < result.length; i++) {
            var poly = result[i];
            var containsBall = false;
            for (var b = 0; b < this._arrBalls.length; b++) {
                if (poly.containsPoint(this._arrBalls[b].get_center())) {
                    containsBall = true;
                    break;
                }
            }
            if (containsBall) {
                this._arrFree.push(poly);
            } else {
                this._arrConquered.push(poly);
                area += Math.abs(poly.get_area());
            }
        }

        this._arrConquered.push(trackPoly);
        area += Math.abs(trackPoly.get_area());
        this._conquredArea += area;

        //update score
        this._score += Math.round(area / this._width * this._height / 100);

        var conqueredPercent = Math.round(this._conquredArea / this._totalArea * 100);

        if (conqueredPercent >= Game.CONQUERED_PERCENT_MINIMUM_LIMIT) //did we reach the minimum limit and going to next level
        {
            this.stop();

            this._numOfBalls++;
            this._numOfMonsters++;

            this.init();

            this.start();
        }

        //raise event on changes in score and conquered area
        this._raiseEvent('conquer', conqueredPercent);
        this._raiseEvent('score', this._score);
    },


    onFail:function () {
        this.stop();
        this._numOfLives--;
        this._playAudio('fail');
        this._raiseEvent('fail', this._numOfLives);
        if (this._numOfLives == 0) {
            this.end();
            this._raiseEvent('gameOver', this._score);
        }
        else {
            var self = this;
            setTimeout(function() { self.init(); self.start(); }, 1000);
        }
    },

    _playAudio:function (a) {
        if (!this._mute && this._audio[a])
            this._audio[a].play();
    }

};

Game.prototype = $.extend(
    {},
    EventHandler.prototype,
    Game.prototype
);