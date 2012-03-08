function Point(a, b) {
	// a=x,b=y
	if (b!==undefined) {
		this._x = a;
		this._y = b;
	}
	// a=Point
	else if (a!==undefined && a) {
        if (! a.get_x)
            debugger;
		this._x = a.get_x();
		this._y = a.get_y();
	}
	// empty
	else {
		this._x = this._y = 0;
	}
}

Point.prototype = {
    
    toString: function() {
        return 'x:' + this._x + ' ' + 'y:' + this._y;
    },

    findAngle: function(other) {
        var radians = self.Math.atan2(other.get_y() - this._y, other.get_x() - this._x);
        var degrees = radians * 180 / self.Math.PI;
        return degrees;
    },
        
    clone: function() {
        return new Point(this);
    },
        
    set: function(a) {
        this._x = a.get_x();
    	this._y = a.get_y();
    },
    
    compare: function(other) {
        return this._x == other.get_x() && this._y == other.get_y();
    },
    
    offset: function(dx, dy) {
        this._x += dx;
        this._y += dy;
    },

    scalarMult: function (scalar) {
        return new Point(this._x * scalar, this._y * scalar);
    },
    
    subtract: function (other) {
        return this.add(other.scalarMult(-1));
    },
    
    add: function (other) {
        return new Point(this._x + other.get_x(), this._y + other.get_y());
    },

    draw: function(ctx, fillStyle) {
        var radius = 5;
        
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.arc(this._x, this._y, radius, 0, self.Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    },

    get_x: function() {
        return this._x;
    },

    set_x: function(x) {
      this._x = x;
    },

    get_y: function() {
        return this._y;
    },

    set_y: function(y) {
        this._y = y;
    }
    
}
