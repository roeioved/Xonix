function Level(width, height, frameBorder, numOfBalls, numOfMonsters, ballSize, monsterSize, speed) {
    this._width = width;
    this._height = height;
    this._frameBorder = frameBorder;
    this._numOfBalls = numOfBalls;
    this._numOfMonsters = numOfMonsters;
    this._ballSize = ballSize;
    this._monsterSize = monsterSize;
    this._speed = speed;
    this._freePixels = 0;
    this._totalPixels = 0;
    this._conquredPixels = 0;
    this._arrFree = [];
    this._arrConquered = [];
    this._arrBalls = [];
    this._arrMonsters = [];
    this._outerBoundary = null;
    this._innerBoundary = null;

    this.reset();
}

Level.prototype = {
    
    reset: function () {
        this._arrFree = [];
        this._arrConquered = [];
        this._arrBalls = [];
        this._arrMonsters = [];
        
        this._outerBoundary = new Rectangle(0, 0, this._width, this._height); //{ top: 0, left: 0, right: this._width, bottom: this._height };
        this._innerBoundary = new Rectangle(this._frameBorder, this._frameBorder, this._width - this._frameBorder, this._height - this._frameBorder); //{ top: this._frameBorder, left: this._frameBorder, right: this._width - this._frameBorder, bottom: this._height - this._frameBorder }
        
        this._totalPixels = (this._width - this._frameBorder) * (this._height - this._frameBorder);
        this._conquredPixels = 0;
        this._freePixels = this._totalPixels - this._conquredPixels;
            
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
    },
    
    get_conqueredPct: function () {
        return Math.round(this._conquredPixels / this._totalPixels * 100);
    },
    
    get_enemies: function () {
        var obstacles = [];
        
        for (var ball in this._arrBalls) {
            obstacles.push(this._arrBalls[ball].get_box());
        }
        for (var monster in this._arrMonsters) {
            obstacles.push(this._arrMonsters[monster].get_box());
        }
        
        return obstacles;
    },
    
    conquer: function (trackPoly, innerPath, outerPath) {
        var area = 0;
        
        //todo:split and remove the polygon that we split!!!
        
        //split
        var result = [];
        var firstPoly = this._arrFree[0].split(innerPath)[0];
        var secondPoly = this._arrFree[0].split(outerPath)[1];
        result.push(firstPoly);
        result.push(secondPoly);
        
        this._arrFree = [];
        for (var i=0; i<result.length; i++) {
            var poly = result[i];
            var containsBall = false;
            for (var b=0; b<this._arrBalls.length; b++) {
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
        
        this._freePixels -= area;
        this._conquredPixels += area;
        
        return area;
    },
    
    levelUp: function () {
        this._numOfBalls++;
        this._numOfMonsters++;
        this.reset();
    },
    
    step: function () {
        for (var ball in this._arrBalls) {
            this._arrBalls[ball].set_obstacles(this._arrConquered);
            this._arrBalls[ball].step();
        }
        for (var monster in this._arrMonsters) {
            this._arrMonsters[monster].set_obstacles(this._arrFree);
            this._arrMonsters[monster].step();
        }
    },
    
    _drawArray: function (ctx, array, fillStyle) {
        for (var i=0; i<array.length; i++) {
            var obj = array[i];
            obj.draw(ctx, fillStyle);
        }
    },
    
    draw: function (ctx) {
        this._drawArray(ctx, this._arrFree, 'Black');
        this._drawArray(ctx, this._arrConquered, '#00A8A8');
        this._drawArray(ctx, this._arrBalls);
        this._drawArray(ctx, this._arrMonsters);
    }
    
};

Level.prototype = $.extend(
    {},
    EventHandler.prototype,
    Level.prototype
);