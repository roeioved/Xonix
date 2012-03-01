/// <reference path="point.js" />
/// <reference path="rectangle.js" />

function Circle(x, y, radius) {
	this.x = x;
	this.y = y;
    this.radius = radius;
}

Circle.prototype = {
    
    toString: function() {
        return 'x:' + this.x + ' ' + 'y:' + this.y + ' ' + 'radius:' + this.radius;
    },
	
    clone: function() {
        return new Circle(this.x, this.y, this.radius);        
    },
        
	getCenter: function() {
		return new Point(this.x, this.y);
	},
	
	getBox: function() {
		return new Rectangle(this.x - this.radius, this.y - this.radius, this.x + this.radius, this.y + this.radius);
	},

    draw: function(ctx, fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, self.Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
    }
    
}
