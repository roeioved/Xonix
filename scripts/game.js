function Game(width, height, frameBorder, playerSize, numOfBalls, numOfMonsters, ballSize, monsterSize, speed) {
    this.width = width;
    this.height = height;
    this.frameBorder = frameBorder;
    this.playerSize = playerSize;
    this.speed = speed;
    
    this.init();
    this.level = new Level(width, height, frameBorder, numOfBalls, numOfMonsters, ballSize, monsterSize, speed);
    
    this.audio = [];
    this.audio['fail'] = new Audio('sounds/fail.mp3');
}

Game.prototype = {
    
    init: function () {
        this.outerBoundary = { top: 0, left: 0, right: this.width, bottom: this.height };
        this.innerBoundary = { top: this.frameBorder, left: this.frameBorder, right: this.width - this.frameBorder, bottom: this.height - this.frameBorder }
        
        //create player
        this.player = new Player(this.width / 2 - this.playerSize / 2, 0, this.playerSize, this.speed, 'White', '#901290', this.outerBoundary);
        this.player.addEventListener('fail', this.fail, this );
    },
    
    conquer: function (trackPoly, innerPath, outerPath) {
        var area = this.level.conquer(trackPoly, innerPath, outerPath);
        this._raiseEvent('conquer', area);
    },
    
    fail: function () {
        this._playAudio('fail');
        this.player.init();
    },
    
    levelUp: function () {
        this.level.levelUp();
        this.player.init();
    },
    
    _playAudio: function (a) {
        if (this.audio[a])
            this.audio[a].play();
    },
    
    step: function () {
        this.level.step();
        
        this.player.enemies = this.level.getEnemies();
        this.player.step();
    },
    
    draw: function (ctx) {
        this.level.draw(ctx);
        this.player.draw(ctx);
    }
    
};

Game.prototype = $.extend(
    {},
    EventHandler.prototype,
    Game.prototype
);