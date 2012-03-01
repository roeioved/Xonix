Monster.prototype = new Rectangle();
Monster.prototype.constructor = Monster;

function Monster(top, left, width, height, fillColor, strokeColor, velocity, boundary, obstacles) {
    this.tl = new Point(left, top);
    this.br = new Point(left + height, top + width);
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.velocity = velocity;
    this.boundary = boundary;
    this.obstacles = obstacles;
}

Monster.prototype.update = function () {
    var velocity_x_dir_changed = false;
    var velocity_y_dir_changed = false;
    
    this.offset(this.velocity.x, this.velocity.y);
    
    if (this.boundary) {
        var width = this.width();
        var height = this.height();
        
        //moving left
        if (this.velocity.x < 0)
        {
            if (this.tl.x <= this.boundary.left)
            {
                this.velocity.x *= -1;
                velocity_x_dir_changed = true;
                
                if (this.tl.x < this.boundary.left) {
                    this.tl.x = this.boundary.left;
                    this.br.x = this.tl.x + width;
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
                    this.tl.x = this.br.x - width;
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
                    this.br.y = this.tl.y + height;
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
                    this.tl.y = this.br.y - height;
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
}

Monster.prototype.getBox = function () {
    return new Rectangle(this.tl, this.br);
}

Monster.prototype.draw = function (ctx) {
    ctx.fillStyle = this.fillColor;
    ctx.strokeStyle = this.strokeStyle;
    ctx.beginPath();
    ctx.rect(this.tl.x, this.tl.y, this.width(), this.height());
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}