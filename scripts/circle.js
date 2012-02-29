/// <reference path="point.js" />
/// <reference path="polygon.js" />

function Circle(x, y, radius) {
	this.x = x;
	this.y = y;
    this.radius = radius;
}

Circle.prototype = {
    
    clone: function() {
        return new Circle(this.x, this.y, this.radius);        
    },
        
	getCenter: function() {
		return new Point(this.x, this.y);
	},

	getBox: function() {
		return new Polygon([
			new Point(this.x - this.radius, this.y - this.radius),
			new Point(this.x + this.radius, this.y - this.radius),
			new Point(this.x + this.radius, this.y + this.radius),
			new Point(this.x - this.radius, this.y + this.radius)
		]);
	},

    draw: function(ctx, fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, self.Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }
    
}
