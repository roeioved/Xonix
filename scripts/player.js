function Player(left, top, size, fillColor, strokeColor, velocity, boundary) {
    this.tl = new Point(left, top);
    this.br = new Point(left + size, top + size);
    this.size = size;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.velocity = velocity;
    this.boundary = boundary;
}

Player.prototype = {
    
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

Player.prototype = $.extend(
    {},
    Rectangle.prototype,
    Player.prototype
);