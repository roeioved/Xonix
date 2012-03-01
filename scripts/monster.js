function Monster(top, left, width, height, fillColor, strokeColor, velocity, boundary, obstacles) {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.velocity = velocity;
    this.boundary = boundary;
    this.obstacles = obstacles;
}

Monster.prototype = {

    update: function () {
        var velocity_x_dir_changed = false;
        var velocity_y_dir_changed = false;
        
        this.left += this.velocity.x;
        this.top += this.velocity.y;
        
        if (this.boundary) {
            //moving left
            if (this.velocity.x < 0)
            {
                if (this.left <= this.boundary.left)
                {
                    this.velocity.x *= -1;
                    velocity_x_dir_changed = true;
                    
                    if (this.left < this.boundary.left)
                        this.left = this.boundary.left;
                }
            }
            
            //moving right
            if (this.velocity.x > 0)
            {
                if (this.left + this.width >= this.boundary.right)
                {
                    this.velocity.x *= -1;
                    velocity_x_dir_changed = true;
                    
                    if (this.left + this.width > this.boundary.right)
                        this.left = this.boundary.right - this.width;
                }
            }
            
            //moving up
            if (this.velocity.y < 0)
            {
                if (this.top <= this.boundary.top)
                {
                    this.velocity.y *= -1;
                    velocity_y_dir_changed = true;
                    
                    if (this.top < this.boundary.top)
                        this.top = this.boundary.top;
                }
            }
            
            //moving down
            if (this.velocity.y > 0)
            {
                if (this.top + this.height >= this.boundary.bottom)
                {
                    this.velocity.y *= -1;
                    velocity_y_dir_changed = true;
                    
                    if (this.top + this.height > this.boundary.bottom)
                        this.top = this.boundary.bottom - this.height;
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
        
    },
    
    getBox: function () {
        var boundary = new Rectangle([
            new Point(this.left, this.top),
            new Point(this.left + this.width, this.top),
            new Point(this.left + this.width, this.top),
            new Point(this.left + this.width, this.top)
        ]);
        
        return boundary;
    },

    draw: function (ctx) {
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeStyle;
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.left, this.top);
        ctx.lineTo(this.left + this.width, this.top);
        ctx.lineTo(this.left + this.width, this.top + this.height);
        ctx.lineTo(this.left, this.top + this.height);
        
        ctx.closePath();
        
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }
    
};




