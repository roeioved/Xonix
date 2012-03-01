function Level(width, height, frameBorder, numOfBalls, numOfMonsters, ballSize, monsterSize, speed) {
    this.width = width;
    this.height = height;
    this.frameBorder = frameBorder;
    this.numOfBalls = numOfBalls;
    this.numOfMonsters = numOfMonsters;
    this.ballSize = ballSize;
    this.monsterSize = monsterSize;
    this.speed = speed;
    
    this.reset();
}

Level.prototype = {
    
    reset: function () {
        this.arrFree = [];
        this.arrConquered = [];
        this.arrBalls = [];
        this.arrMonsters = [];
        
        this.outerBoundary = { top: 0, left: 0, right: this.width, bottom: this.height };
        this.innerBoundary = { top: this.frameBorder, left: this.frameBorder, right: this.width - this.frameBorder, bottom: this.height - this.frameBorder }
        
        this._totalPixels = (this.width - this.frameBorder) * (this.height - this.frameBorder);
        this._conquredPixels = 0;
        this._freePixels = this._totalPixels - this._conquredPixels;
            
        //create start free area
        var free = new Polygon([
            new Point(this.frameBorder, this.frameBorder),
            new Point(this.width - this.frameBorder, this.frameBorder),
            new Point(this.width - this.frameBorder, this.height - this.frameBorder),
            new Point(this.frameBorder, this.height - this.frameBorder)
        ]);
        this.arrFree.push(free);
            
        //create balls
        for (var i = 0; i < this.numOfBalls; i++) {
            var x = random(this.frameBorder * 2, this.width - this.frameBorder * 2);
            var y = random(this.frameBorder * 2, this.height - this.frameBorder * 2);
            var velocityX = this.speed * (random(0, 1) == 0 ? -1 : 1);
            var velocityY = this.speed * (random(0, 1) == 0 ? -1 : 1);            
            var ball = new Ball(x, y, this.ballSize / 2, '#00A8A8', 'White', new Vector(velocityX, velocityY), this.innerBoundary, this.arrConquered);
            this.arrBalls.push(ball);
        }
            
        //create monsters
        for (var i = 0; i < this.numOfMonsters; i++) {
            var left = random(0, this.width - this.monsterSize);
            var top = random(this.height - this.frameBorder, this.height - this.monsterSize);
            var velocityX = this.speed * (random(0, 1) == 0 ? -1 : 1);
            var velocityY = this.speed * (random(0, 1) == 0 ? -1 : 1);            
            var monster = new Monster(left, top, this.monsterSize, '#00A8A8', 'Black', new Vector(velocityX, velocityY), this.outerBoundary, this.arrFree);
            this.arrMonsters.push(monster);
        }
    },
    
    getConqueredPct: function () {
        return Math.round(this._conquredPixels / this._totalPixels * 100);
    },
    
    getEnemies: function () {
        var obstacles = [];
        
        for (var ball in this.arrBalls) {
            obstacles.push(this.arrBalls[ball].getBox());
        }
        for (var monster in this.arrMonsters) {
            obstacles.push(this.arrMonsters[monster].getBox());
        }
        
        return obstacles;
    },
    
    conquer: function (trackPoly, innerPath, outerPath) {
        var area = 0;
        
        //todo:split and remove the polygon that we split!!!
        
        //split
        var result = [];
        var firstPoly = this.arrFree[0].split(innerPath)[0];
        var secondPoly = this.arrFree[0].split(outerPath)[1];
        result.push(firstPoly);
        result.push(secondPoly);
        
        this.arrFree = [];
        for (var i=0; i<result.length; i++) {
            var poly = result[i];
            var containsBall = false;
            for (var b=0; b<this.arrBalls.length; b++) {
                if (poly.containsPoint(this.arrBalls[b])) {
                    containsBall = true;
                    break;
                }
            }
            if (containsBall) {
                this.arrFree.push(poly);
            } else {
                this.arrConquered.push(poly);
                area += Math.abs(poly.getArea());
            }
        }
        this.arrConquered.push(trackPoly);
        area += Math.abs(trackPoly.getArea());
        
        this._freePixels -= area;
        this._conquredPixels += area;
        
        return area;
    },
    
    levelUp: function () {
        this.numOfBalls++;
        this.numOfMonsters++;
        this.reset();
    },
    
    step: function () {
        for (var ball in this.arrBalls) {
            this.arrBalls[ball].obstacles = this.arrConquered;
            this.arrBalls[ball].step();
        }
        for (var monster in this.arrMonsters) {
            this.arrMonsters[monster].obstacles = this.arrFree;
            this.arrMonsters[monster].step();
        }
    },
    
    _drawArray: function (ctx, array, fillStyle) {
        for (var i=0; i<array.length; i++) {
            var obj = array[i];
            obj.draw(ctx, fillStyle);
        }
    },
    
    draw: function (ctx) {
        this._drawArray(ctx, this.arrFree, 'Black');
        this._drawArray(ctx, this.arrConquered, '#00A8A8');
        this._drawArray(ctx, this.arrBalls);
        this._drawArray(ctx, this.arrMonsters);
    }
    
};

Level.prototype = $.extend(
    {},
    EventHandler.prototype,
    Level.prototype
);