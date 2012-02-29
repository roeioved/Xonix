/// <reference path="point.js" />

function Rectangle(a, b, c, d) {
	// a=x1,b=y1,c=x2,d=y2
	if (d!==undefined) {
		this.tl = new Point(a, b);
		this.br = new Point(c, d);
	}
	// a=Point, b=Point
	else if (b!==undefined) {
		var mn = Math.min;
		var mx = Math.max;
		this.tl = new Point(mn(a.x, b.x), mn(a.y, b.y));
		this.br = new Point(mx(a.x, b.x), mx(a.y, b.y));
	}
	// a=Rectangle
	else if (a) {
		this.tl = new Point(a.tl);
		this.br = new Point(a.br);
	}
	// empty
	else {
		this.tl = new Point();
		this.br = new Point();
	}
}
Rectangle.prototype = {
    
    toString: function() {
        return "{tl:" + this.tl + ",br:" + this.br + "}";
    },
    
    clone: function() {
        return new Rectangle(this);
    },
    
    getTopleft: function() {
        return new Point(this.tl);
    },
    
    getBottomright: function() {
        return new Point(this.br);
    },
        
    width: function() {
        return this.br.x - this.tl.x;
    },
    
    height: function() {
        return this.br.y - this.tl.y;
    },
        
    set: function(a) {
        // array of Points
        var mx = self.Math.max;
        var mn = self.Math.min;
        this.tl.x = this.br.x = a[0].x;
        this.tl.y = this.br.y = a[0].y;
        for (var i=1; i<a.length; i++ ) {
            var p = a[i];
            this.tl.x = mn(this.tl.x,p.x);
            this.tl.y = mn(this.tl.y,p.y);
            this.br.x = mx(this.br.x,p.x);
            this.br.y = mx(this.br.y,p.y);
        }
    },
    
    pointIn: function(p) {
        return p.x > this.tl.x && p.x < this.br.x && p.y > this.tl.y && p.y < this.br.y;
    },
    
    doesIntersect: function(other) {
        var mn = self.Math.min;
        var mx = self.Math.max;
        return (mn(other.br.x,this.br.x)-mx(other.tl.x,this.tl.x)) > 0 && (mn(other.br.y,this.br.y)-mx(other.tl.y,this.tl.y)) > 0;
    },
        
    isEmpty: function() {
        return this.width() <= 0 || this.height() <= 0;
    },
    
    unionPoint: function(p) {
        var mn = Math.min;
        var mx = Math.max;
        this.tl.x = mn(this.tl.x, p.x);
        this.tl.y = mn(this.tl.y, p.y);
        this.br.x = mx(this.br.x, p.x);
        this.br.y = mx(this.br.y, p.y);
    },
    
    union: function(other) {
        // this rectangle is empty
        if (this.isEmpty()) {
            this.tl = new Point(other.tl);
            this.br = new Point(other.br);
        }
        // union only if other rectangle is not empty
        else if (!other.isEmpty()) {
            var mn = self.Math.min;
            var mx = self.Math.max;
            this.tl.x = mn(this.tl.x, other.tl.x);
            this.tl.y = mn(this.tl.y, other.tl.y);
            this.br.x = mx(this.br.x, other.br.x);
            this.br.y = mx(this.br.y, other.br.y);
        }
        return this;
    },
    
    draw: function(ctx, fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.rect(this.tl.x, this.tl.y, this.width(), this.height());
        ctx.fill();
        ctx.closePath();
    }
    
    /*
    
    offset: function(dx, dy) {
        this.tl.offset(dx, dy);
        this.br.offset(dx, dy);
    },

    inflate: function(a) {
        this.tl.x -= a;
        this.tl.y -= a;
        this.br.x += a;
        this.br.y += a;
    },    
    
    */
}