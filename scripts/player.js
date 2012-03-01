function Player(left, top, size, speed, fillColor, strokeColor, boundary, enemies) {
    this.tl = new Point(left, top);
    this.br = new Point(left + size, top + size);
    this.speed = speed;
    this.size = size;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.velocity = new Vector(0, 0);
    this.boundary = boundary;
    this.enemies = enemies;
}

Player.prototype = {
        
    init: function () {
        this.tl = new Point(0, 0);
        this.br = new Point(this.size, this.size);
        this.velocity.x = 0;
        this.velocity.y = 0;
    },
    
    getBox: function () {
        return new Rectangle(this.tl, this.br);
    },
        
    step: function () {
        var velocity_x_dir_changed = false;
        var velocity_y_dir_changed = false;
        
        this.offset(this.velocity.x, this.velocity.y);
        
        if (this.boundary) {
            //moving left
            if (this.velocity.x < 0)
            {
                if (this.tl.x <= this.boundary.left)
                {
                    this.velocity.x = 0;
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
                    this.velocity.x = 0;
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
                    this.velocity.y = 0;
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
                    this.velocity.y = 0;
                    velocity_y_dir_changed = true;
                    
                    if (this.br.y > this.boundary.bottom) {                    
                        this.br.y = this.boundary.bottom;
                        this.tl.y = this.br.y - this.size;
                    }
                }
            }
        }
        
        for (var idx in this.enemies) {
            var me = this.getBox();
            var other = this.enemies[idx];
            
            if (me.doesIntersect(other)) {
                this._raiseEvent('fail');
            }
        }
    },
        
    moveLeft: function () {
        this.velocity.x = -this.speed;
        this.velocity.y = 0;
    },
    
    moveUp: function () {
        this.velocity.x = 0;
        this.velocity.y = -this.speed;
    },
    
    moveRight: function () {
        this.velocity.x = this.speed;
        this.velocity.y = 0;
    },

    moveDown: function () {
        this.velocity.x = 0;
        this.velocity.y = this.speed;
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
    EventHandler.prototype,
    Rectangle.prototype,
    Player.prototype
);