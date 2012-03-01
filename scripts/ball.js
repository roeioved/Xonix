/// <reference path="point.js" />
/// <reference path="rectangle.js" />

function Ball(x, y, radius, color, velocity, boundaries, obstacles) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.boundaries = boundaries;
    this.obstacles = obstacles;
}

Ball.prototype = {
    
    update: function () {
        if (this.boundaries) {
            //top boundry
            if (this.y - this.radius <= this.boundaries.top) {
                this.velocity.y *= -1;
            }
            //right boudry
            if (this.x + this.radius >= this.boundaries.right) {
                this.velocity.x *= -1;
            }
            //bottom boudry
            if (this.y + this.radius >= this.boundaries.bottom) {
                this.velocity.y *= -1;
            }
            //left boudry
            if (this.x - this.radius <= this.boundaries.left) {
                this.velocity.x *= -1;
            }
        }
        
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        if (this.boundaries) {
            this.x = this.x - this.radius < this.boundaries.left ? this.boundaries.left + this.radius : this.x;
            this.x = this.x + this.radius > this.boundaries.right ? this.boundaries.right - this.radius : this.x;
            this.y = this.y - this.radius < this.boundaries.top ? this.boundaries.top + this.radius : this.y;
            this.y = this.y + this.radius > this.boundaries.bottom ? this.boundaries.bottom - this.radius : this.y;
        }
    },
    
    getBox: function () {
        var boundary = new Rectangle(this.x - this.radius, this.y - this.radius, this.x + this.radius, this.y + this.radius);
        
        return boundary;
    },
    
    getCenter: function() {
        return new Point(this.x, this.y);
    },

    draw: function (ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    }
    
}