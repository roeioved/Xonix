function Ball(x, y, radius, fillColor, strokeColor, velocity, boundaries, obstacles) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.velocity = velocity;
    this.boundaries = boundaries;
    this.obstacles = obstacles;
}

Ball.prototype = {

    findCollision: function (polygon) {
        var intersect = polygon.findIntersection(this.getBox());
        if (intersect) {
             if (polygon.containsPoint(this.getCenter()))
             {
                return intersect;
             }
        }
        return null;
    },
    
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
    
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    
    if (this.boundaries) {
        this.x = this.x - this.radius < this.boundaries.left ? this.boundaries.left + this.radius : this.x;
        this.x = this.x + this.radius > this.boundaries.right ? this.boundaries.right - this.radius : this.x;
        this.y = this.y - this.radius < this.boundaries.top ? this.boundaries.top + this.radius : this.y;
        this.y = this.y + this.radius > this.boundaries.bottom ? this.boundaries.bottom - this.radius : this.y;
    }

    var velocity_x_changed = velocity_y_changed = false;
    
    var regions = [];
    for (var polygon in this.obstacles) {
        var rectangles = this.obstacles[polygon].getRectangles(new Vector(0,1));
        
        var regions = [];
        for (var polygon in this.obstacles) {
            var rectangles = this.obstacles[polygon].getHorizontalRectangles();
            
            for (var i = 0; i < rectangles.length; i++) {
                regions.push(rectangles[i]);
            }
        }
        
        for (var polygon in regions) {
            var collision = this.findCollision(regions[polygon]);
            if (collision) {
                if (collision.minIntersectPerpen.x == 0 && !velocity_y_changed) {
                    this.velocity.y *= -1;
                    velocity_y_changed = true;
                    
                    if (Math.abs(collision.intersect) > Math.abs(this.velocity.y)) {
                        var velocity = Math.abs(collision.intersect) * (Math.abs(this.velocity.y) / this.velocity.y);
                        this.offset(-this.velocity.x, velocity);
                    }
                }
                else if (!velocity_x_changed) {
                    this.velocity.x *= -1;
                    velocity_x_changed = true;
                    
                    if (Math.abs(collision.intersect) > Math.abs(this.velocity.x)) {
                        var velocity = Math.abs(collision.intersect) * (Math.abs(this.velocity.x) / this.velocity.x);
                        this.offset(velocity, -this.velocity.y);
                    }
                }
            }
        }
    },
        
    draw: function (ctx) {
        var thickness = 1;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - thickness/2, 0, Math.PI * 2, false);
        ctx.fillStyle = this.fillColor;
        ctx.fill();
        ctx.lineWidth = thickness;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
        ctx.closePath();
    }
};

};

Ball.prototype = $.extend(
    {},
    Circle.prototype,
    Ball.prototype
);