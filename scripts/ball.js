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
             //if (polygon.containsPoint(this.getCenter()))
             //{
                return intersect;
             //}
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
        

        
        var h_obstacles = [];
        var v_obstacles = [];

        for (var polygon in this.obstacles) {
            var h_rectangles = this.obstacles[polygon].getRectangles(new Vector(1,0));
            var v_rectangles = this.obstacles[polygon].getRectangles(new Vector(0,1));

            for (var i = 0; i < h_rectangles.length; i++) {
                h_obstacles.push(h_rectangles[i]);
            }

            for (var i = 0; i < v_rectangles.length; i++) {
                v_obstacles.push(v_rectangles[i]);
            }
        }

        var h_obstacle_res = {};

        var velocity_x_changed = false;
        var velocity_y_changed = false;

        for (var obstacle in h_obstacles) {
            var collision = this.findCollision(h_obstacles[obstacle]);
            if (collision) {
                if (collision.minIntersectPerpen.x == 0 && !velocity_y_changed) {
                    //this.velocity.y *= -1;
                    //velocity_y_changed = true;
                    h_obstacle_res.velocity_y_changed = true;

                    if (collision.intersect > Math.abs(this.velocity.y)) {
                        var velocity = collision.intersect * (Math.abs(this.velocity.y) / this.velocity.y * -1);
                        //this.offset(-this.velocity.x, velocity);
                        h_obstacle_res.velocity_y = velocity;
                    }
                }
                else if (!velocity_x_changed) {
                    //this.velocity.x *= -1;
                    velocity_x_changed = true;
                    h_obstacle_res.velocity_x_changed = true;
                    
                    if (collision.intersect > Math.abs(this.velocity.x)) {
                        var velocity = collision.intersect * (Math.abs(this.velocity.x) / this.velocity.x * -1);
                        //this.offset(velocity, -this.velocity.y);
                        h_obstacle_res.velocity_x = velocity;
                    }
                }
                else if (velocity_x_changed && velocity_y_changed) {
                    break;
                }
            }
        }

        var v_obstacle_res = {};

        velocity_x_changed = false;
        velocity_y_changed = false;

        for (var obstacle in v_obstacles) {
            var collision = this.findCollision(v_obstacles[obstacle]);
            if (collision) {
                if (collision.minIntersectPerpen.x == 0 && !velocity_y_changed) {
                    //this.velocity.y *= -1;
                    //velocity_y_changed = true;
                    v_obstacle_res.velocity_y_changed = true;

                    if (collision.intersect > Math.abs(this.velocity.y)) {
                        var velocity = collision.intersect * (Math.abs(this.velocity.y) / this.velocity.y * -1);
                        //this.offset(-this.velocity.x, velocity);
                        v_obstacle_res.velocity_y = velocity;
                    }
                }
                else if (!velocity_x_changed) {
                    //this.velocity.x *= -1;
                    velocity_x_changed = true;
                    v_obstacle_res.velocity_x_changed = true;

                    if (collision.intersect > Math.abs(this.velocity.x)) {
                        var velocity = collision.intersect * (Math.abs(this.velocity.x) / this.velocity.x * -1);
                        //this.offset(velocity, -this.velocity.y);
                        v_obstacle_res.velocity_x = velocity;
                    }
                }
                else if (velocity_x_changed && velocity_y_changed) {
                    break;
                }
            }
        }

        if (h_obstacle_res.velocity_y_changed && v_obstacle_res.velocity_y_changed)
        {
            console.log("collision on y");
            this.velocity.y *= -1;

            if (h_obstacle_res.velocity_y)
            {
                this.offset(-this.velocity.x, h_obstacle_res.velocity_y);
            }

        }
        if (h_obstacle_res.velocity_x_changed && v_obstacle_res.velocity_x_changed)
        {
            console.log("collision on x");

            this.velocity.x *= -1;

            if (h_obstacle_res.velocity_x)
            {
                this.offset(h_obstacle_res.velocity_x, -this.velocity.y);
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

Ball.prototype = $.extend(
    {},
    Circle.prototype,
    Ball.prototype
);

