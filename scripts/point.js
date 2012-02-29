function Point(a, b) {
	// a=x,b=y
	if (b!==undefined) {
		this.x = a;
		this.y = b;
	}
	// a=Point or {x:?,y:?}
	else if (a!==undefined && a) {
		this.x = a.x;
		this.y = a.y;
	}
	// empty
	else {
		this.x = this.y = 0;
	}
}

Point.prototype = {
    
    findAngle: function(other) {
        var radians = self.Math.atan2(other.y - this.y, other.x - this.x);
        var degrees = radians * 180 / self.Math.PI;
        return degrees;
    },
        
    clone: function() {
        return new Point(this);        
    },
        
    set: function(a) {
        this.x = a.x;
    	this.y = a.y;
    },
    
    compare: function(other) {
        return this.x == other.x && this.y == other.y;
    },
    
    draw: function(ctx, fillStyle) {
        var radius = 5;
        
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, self.Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }
    
    /*
    
    toString: function() {
        return "{x:" + this.x + ",y:" + this.y + "}";
    },
    
    toHashkey: function() {
        return this.x + "_" + this.y;
    },

    offset: function(dx, dy) {
        this.x += dx;
        this.y += dy;
    },
    
    */
}
