function Game(width, height, frameBorder, numOfLives, playerSize, numOfBalls, numOfMonsters, ballSize, monsterSize, speed) {
    this._width = width;
    this._height = height;
    this._frameBorder = frameBorder;
    this._numOfLives = numOfLives;
    this._playerSize = playerSize;
    this._speed = speed;
    this._player = null;
    
    this.init();
    this._level = new Level(width, height, frameBorder, numOfBalls, numOfMonsters, ballSize, monsterSize, speed);
    
    this._score = 0;
    
    this._mute = true;
    this._audio = [];
    this._audio['fail'] = new Audio('sounds/fail.mp3');
    this._outerBoundary = null;
    this._innerBoundary = null;
}

Game.prototype = {
    
    init: function () {
        this._outerBoundary = new Rectangle(0, 0, this._width, this._height);// { top: 0, left: 0, right: this._width, bottom: this._height };
        this._innerBoundary = new Rectangle(this._frameBorder, this._frameBorder, this._width - this._frameBorder, this._height - this._frameBorder); //{ top: this._frameBorder, left: this._frameBorder, right: this._width - this._frameBorder, bottom: this._height - this._frameBorder }
        
        //create player
        this._player = new Player(this._width / 2 - this._playerSize / 2, 0, this._playerSize, this._speed, 'White', '#901290', this._outerBoundary);
        this._player.addEventListener('fail', this.onFail, this );
    },
    
    conquer: function (trackPoly, innerPath, outerPath) {
        var area = this._level.conquer(trackPoly, innerPath, outerPath);
        this._score += Math.round(area / this._width * this._height / 100);
        this._raiseEvent('conquer', this._level.get_conqueredPct());
        this._raiseEvent('score', this._score);
    },

    onFail: function () {
        this._numOfLives--;
        this._playAudio('fail');
        this._raiseEvent('fail', this._numOfLives);
        if (this._numOfLives == 0)
            this._raiseEvent('gameOver', this._score);
        this._player.init();
    },
    
    levelUp: function () {
        this._level.levelUp();
        this._player.init();
    },
    
    _playAudio: function (a) {
        if (!this._mute && this._audio[a])
            this._audio[a].play();
    },
    
    step: function () {
        this._level.step();
        
        this._player.set_enemies(this._level.get_enemies());
        this._player.step();
    },

    get_player: function() {
      return this._player;
    },
    
    draw: function (ctx) {
        this._level.draw(ctx);
        this._player.draw(ctx);
    }
    
};

Game.prototype = $.extend(
    {},
    EventHandler.prototype,
    Game.prototype
);