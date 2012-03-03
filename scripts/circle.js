/// <reference path="point.js" />
/// <reference path="rectangle.js" />

function Circle(x, y, radius) {
	this._x = x;
	this._y = y;
    this._radius = radius;
}

Circle.prototype = {
    
    toString: function() {
        return 'x:' + this._x + ' ' + 'y:' + this._y + ' ' + 'radius:' + this._radius;
    },
	
    clone: function() {
        return new Circle(this._x, this._y, this._radius);
    },
        
	get_center: function() {
		return new Point(this._x, this._y);
	},
	
	get_box: function() {
		return new Rectangle(this._x - this._radius, this._y - this._radius, this._x + this._radius, this._y + this._radius);
	},

    offset: function(dx, dy) {
        this._x += dx;
        this._y += dy;
    },

    draw: function(ctx, fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.arc(this._x, this._y, this._radius, 0, self.Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }
    
};
