function Player(left, top, size, speed, fillColor, strokeColor, boundary, enemies) {
    this._tl = new Point(left, top);
    this._br = new Point(left + size, top + size);
    this._speed = speed;
    this._size = size;
    this._fillColor = fillColor;
    this._strokeColor = strokeColor;
    this._velocity = new Vector(0, 0);
    this._boundary = boundary;
    this._enemies = enemies;
}

Player.prototype = {
        
    init: function () {
        this._tl = new Point(0, 0);
        this._br = new Point(this._size, this._size);
        this._velocity.set_x(0);
        this._velocity.set_y(0);
    },

    step: function () {
        var velocity_x_dir_changed = false;
        var velocity_y_dir_changed = false;
        
        this.offset(this._velocity.get_x(), this._velocity.get_y());

        if (this._boundary) {
            //moving left
            if (this._velocity.get_x() < 0)
            {
                if (this._tl.get_x() <= this._boundary.get_left())
                {
                    this._velocity.set_x(0);
                    velocity_x_dir_changed = true;
                    
                    if (this._tl.get_x() < this._boundary.get_left()) {
                        var offset = this._boundary.get_left() - this._tl.get_x();
                        this.offset(offset, 0);
                    }
                }
            }
            
            //moving right
            else if (this._velocity.get_x() > 0)
            {
                if (this._br.get_x() >= this._boundary.get_right())
                {
                    this._velocity.set_x(0);
                    velocity_x_dir_changed = true;
                    
                    if (this._br.get_x() > this._boundary.get_right()) {
                        var offset = this._boundary.get_right() - this._br.get_x();
                        this.offset(offset, 0);
                    }
                }
            }
            
            //moving up
            if (this._velocity.get_y() < 0)
            {
                if (this._tl.get_y() <= this._boundary.get_top())
                {
                    this._velocity.set_y(0);
                    velocity_y_dir_changed = true;
                    
                    if (this._tl.get_y() < this._boundary.get_top()) {
                        var offset = this._boundary.get_top() - this._tl.get_y();
                        this.offset(0, offset);
                    }
                }
            }
            
            //moving down
            else if (this._velocity.get_y() > 0)
            {
                if (this._br.get_y() >= this._boundary.get_bottom())
                {
                    this._velocity.set_y(0);
                    velocity_y_dir_changed = true;
                    
                    if (this._br.get_y() > this._boundary.get_bottom()) {
                        var offset = this._boundary.get_bottom() - this._br.get_y();
                        this.offset(0, offset);
                    }
                }
            }
        }
        
        for (var idx in this._enemies) {
            var me = this.get_box();
            var other = this._enemies[idx];
            
            if (me.doesIntersect(other)) {
                this._raiseEvent('fail');
            }
        }
    },
        
    moveLeft: function () {
        this._velocity.set_x(-this._speed);
        this._velocity.set_y(0);
    },
    
    moveUp: function () {
        this._velocity.set_x(0);
        this._velocity.set_y(-this._speed);
    },
    
    moveRight: function () {
        this._velocity.set_x(this._speed);
        this._velocity.set_y(0);
    },

    moveDown: function () {
        this._velocity.set_x(0);
        this._velocity.set_y(this._speed);
    },

    set_enemies: function(enemies) {
        this._enemies = enemies;
    },

    draw: function (ctx) {
        var thickness = 2;
        
        ctx.beginPath();
        ctx.rect(this._tl.get_x() + thickness, this._tl.get_y() + thickness, this._size - thickness, this._size - thickness);
        ctx._fillStyle = this._fillColor;
        ctx.fill();
        ctx.lineWidth = thickness;
        ctx.strokeStyle = this._strokeColor;
        ctx.stroke();
    }
    
};

Player.prototype = $.extend(
    {},
    EventHandler.prototype,
    Rectangle.prototype,
    Player.prototype
);