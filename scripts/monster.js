function Monster(left, top, size, fillColor, strokeColor, velocity, boundary, obstacles) {
    this.tl = new Point(left, top);
    this.br = new Point(left + size, top + size);
    this.size = size;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.velocity = velocity;
    this.boundary = boundary;
    this.obstacles = obstacles;
}

Monster.prototype = {
    
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
        var velocity_x_dir_changed = false;
        var velocity_y_dir_changed = false;
        
        this.offset(this.velocity.x, this.velocity.y);
        
        if (this.boundary) {
            //moving left
            if (this.velocity.x < 0)
            {
                if (this.tl.x <= this.boundary.left)
                {
                    this.velocity.x *= -1;
                    velocity_x_dir_changed = true;
                    
                    if (this.tl.x < this.boundary.left) {
                        this.tl.x = this.boundary.left;
                        this.br.x = this.tl.x + this.size;
                    }
                }
            }
            
            //moving right
            if (this.velocity.x > 0)
            {
                if (this.br.x >= this.boundary.right)
                {
                    this.velocity.x *= -1;
                    velocity_x_dir_changed = true;
                    
                    if (this.br.x > this.boundary.right) {
                        this.br.x = this.boundary.right;
                        this.tl.x = this.br.x - this.size;
                    }
                }
            }
            
            //moving up
            if (this.velocity.y < 0)
            {
                if (this.tl.y <= this.boundary.top)
                {
                    this.velocity.y *= -1;
                    velocity_y_dir_changed = true;
                    
                    if (this.tl.y < this.boundary.top) {
                        this.tl.y = this.boundary.top;
                        this.br.y = this.tl.y + this.size;
                    }
                }
            }
            
            //moving down
            if (this.velocity.y > 0)
            {
                if (this.br.y >= this.boundary.bottom)
                {
                    this.velocity.y *= -1;
                    velocity_y_dir_changed = true;
                    
                    if (this.br.y > this.boundary.bottom) {                    
                        this.br.y = this.boundary.bottom;
                        this.tl.y = this.br.y - this.size;
                    }
                }
            }
        }
        
        if (! (velocity_x_dir_changed && velocity_y_dir_changed))
        {
           /* var collision_x_min;
            var collision_y_min;
            
            for(var obstacle in this.obstacles)
            {
                obstacle = this.obstacles[obstacle];
                
                var collision = obstacle.findCollision(this.get_polygon());
                
                if (collision.x != null && (collision_x_min == null || collision.x < collision_x_min))
                {
                    collision_x_min = collision.x;
                }
                if (collision.y != null && (collision_y_min == null || collision.y < collision_y_min))
                {
                    collision_y_min = collision.y;
                }
            }
            
            if (collision_x_min != null)
            {
                //moving right
                if (this.velocity.x > 0)
                {
                    this.left += collision_x_min;
                }
                else
                {
                    this.left -= collision_x_min;
                }
            }
            
            if (collision_y_min != null)
            {
                //moving down
                if (this.velocity.y > 0)
                {
                    this.top += collision_y_min;
                }
                else
                {
                    this.top -= collision_y_min;
                }
            }*/
        }
    
        var velocity_x_changed = velocity_y_changed = false;
        
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

    getBox: function () {
        return new Rectangle(this.tl, this.br);
    },

    draw: function (ctx) {        
        var thickness = 2;
        
        ctx.beginPath();
        ctx.rect(this.tl.x + thickness, this.tl.y + thickness, this.size - thickness, this.size - thickness);
        ctx.fillStyle = this.fillColor;
        ctx.fill();
        ctx.lineWidth = thickness;
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
    }
    
};

Monster.prototype = $.extend(
    {},
    Rectangle.prototype,
    Monster.prototype
);