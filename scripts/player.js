function Player(left, top, size, speed, fillColor, strokeColor, boundary, enemies, conqueredAreas, freeAreas) {
    this._tl = new Point(left, top);
    this._br = new Point(left + size, top + size);
    this._speed = speed;
    this._size = size;
    this._fillColor = fillColor;
    this._strokeColor = strokeColor;
    this._velocity = new Vector(0, 0);
    this._boundary = boundary;
    this._enemies = enemies;
    this._conqueredAreas = conqueredAreas;
    this._freeAreas = freeAreas;
    
    this.killTrack();
}

Player.prototype = {
    
    init: function () {
        this._tl = new Point(0, 0);
        this._br = new Point(this._size, this._size);
        this._velocity.set_x(0);
        this._velocity.set_y(0);
    },
    
    killTrack: function () {
        this._prevDirection = null;
        this._currDirection = null;
        this._trackStatus = 0; // 0-no track  1-starting  2-conquering  3-finishing  4-finished
        console.log('status:0');
        this._prevTrackRect = null;
        this._innerTrack = null;
        this._outerTrack = null;
        this._trackPoly = null;
        this._freeAreaIndex = null;
        
        this.stop();
    },
    
    step: function () {
        var velocity_x_dir_changed = false;
        var velocity_y_dir_changed = false;
        
        this.offset(this._velocity.get_x(), this._velocity.get_y());
        
        if (this._boundary) {
            //moving left
            if (this._velocity.get_x() < 0)
            {
                this.set_direction('L');
                
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
                this.set_direction('R');
                
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
                this.set_direction('U');
                
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
                this.set_direction('D');
                
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
        
        if (this._currDirection) {
            //player is moving on the conquered area
            if (this._trackStatus == 0) {
                for (var idx in this._freeAreas) {
                    var poly = this._freeAreas[idx];
                    var collision = this.findCollision(poly);
                    if (collision) {
                        this._trackStatus = 1;
                        console.log('status:1');
                        this._innerTrack = new Path();
                        this._outerTrack = new Path();
                                                
                        switch (this._currDirection) {
                            case 'L':                                
                                this._innerTrack.addPoint(new Point(this.get_left() + collision.x, this.get_top()));
                                this._outerTrack.addPoint(new Point(this.get_left() + collision.x, this.get_bottom()));
                                break;
                            case 'U':
                                this._innerTrack.addPoint(new Point(this.get_right(), this.get_top() + collision.y));
                                this._outerTrack.addPoint(new Point(this.get_left(), this.get_top() + collision.y));
                                break;
                            case 'R':
                                this._innerTrack.addPoint(new Point(this.get_right() - collision.x, this.get_bottom()));
                                this._outerTrack.addPoint(new Point(this.get_right() - collision.x, this.get_top()));
                                break;
                            case 'D':
                                this._innerTrack.addPoint(new Point(this.get_left(), this.get_bottom() - collision.y));
                                this._outerTrack.addPoint(new Point(this.get_right(), this.get_bottom() - collision.y));
                                break;
                        }
                        this._prevTrackRect = this.get_box();
                        this._freeAreaIndex = idx;
                        break;
                    }
                }
            }
            //player already begin to conquer but still not completly in the free area
            else if (this._trackStatus == 1) {
                var sameStatus = false;
                for (var idx in this._conqueredAreas) {
                    var poly = this._conqueredAreas[idx];
                    var collision = this.findCollision(poly);
                    if (collision) {
                        sameStatus = true;
                        break;
                    }
                }
                if (!sameStatus) {
                    this._trackStatus = 2;
                    console.log('status:2');
                }
            }
            //player is completly in the free area (conquering)
            else if (this._trackStatus == 2) {
                var sameStatus = true;
                for (var idx in this._conqueredAreas) {
                    var poly = this._conqueredAreas[idx];
                    var collision = this.findCollision(poly);
                    if (collision) {

                        switch (this._currDirection) {
                            case 'L':
                                //this._innerTrack.addPoint(new Point(this.get_right() - intersect, this.get_top()));
                                //this._outerTrack.addPoint(new Point(this.get_right() - intersect, this.get_bottom()));
                                this._innerTrack.addPoint(new Point(this.get_left() + collision.x, this.get_top()));
                                this._outerTrack.addPoint(new Point(this.get_left() + collision.x, this.get_bottom()));
                                break;
                            case 'U':
                                //this._innerTrack.addPoint(new Point(this.get_right(), this.get_bottom() - intersect));
                                //this._outerTrack.addPoint(new Point(this.get_left(), this.get_bottom() - intersect));
                                this._innerTrack.addPoint(new Point(this.get_right(), this.get_top() + collision.y));
                                this._outerTrack.addPoint(new Point(this.get_left(), this.get_top() + collision.y));
                                break;
                            case 'R':
                                //this._innerTrack.addPoint(new Point(this.get_left() + intersect, this.get_bottom()));
                                //this._outerTrack.addPoint(new Point(this.get_left() + intersect, this.get_top()));
                                this._innerTrack.addPoint(new Point(this.get_right() - collision.x, this.get_bottom()));
                                this._outerTrack.addPoint(new Point(this.get_right() - collision.x, this.get_top()));
                                break;
                            case 'D':
                                //this._innerTrack.addPoint(new Point(this.get_left(), this.get_top() + intersect));
                                //this._outerTrack.addPoint(new Point(this.get_right(), this.get_top() + intersect));
                                this._innerTrack.addPoint(new Point(this.get_left(), this.get_bottom() - collision.y));
                                this._outerTrack.addPoint(new Point(this.get_right(), this.get_bottom() - collision.y));
                                break;
                        }
                        
                        sameStatus = false;
                        break;
                    }
                }
                if (!sameStatus) {
                    this._trackStatus = 3;
                    console.log('status:3');
                }
            }
            //player reached (about to finish conquering)
            else if (this._trackStatus == 3) {
                var sameStatus = false;
                for (var idx in this._freeAreas) {
                    var poly = this._freeAreas[idx];
                    var collision = this.findCollision(poly);
                    if (collision) {
                        sameStatus = true;
                        break;
                    }
                }
                if (!sameStatus) {                    
                    this._trackStatus = 4;
                    console.log('status:4');
                }
            }
            
            //handle track
            if (this._trackStatus == 2 || this._trackStatus == 3) {
                
                //check if player moves back (fails himeself)
                if ( (this._prevDirection == 'L' && this._currDirection == 'R') || (this._prevDirection == 'R' && this._currDirection == 'L') ||
                     (this._prevDirection == 'U' && this._currDirection == 'D') || (this._prevDirection == 'D' && this._currDirection == 'U') ) {
                    this.killTrack();
                    this._raiseEvent('fail');
                } else {                    
                    if (this._currDirection != this._prevDirection) {
                        switch (this._currDirection) {
                            case 'L':
                                if (this._prevDirection == 'U') {
                                    this._innerTrack.addPoint(new Point(this._prevTrackRect.get_right(), this.get_top()));
                                    this._outerTrack.addPoint(new Point(this._prevTrackRect.get_left(), this.get_bottom()));
                                } else if (this._prevDirection == 'D') {
                                    this._innerTrack.addPoint(new Point(this._prevTrackRect.get_left(), this.get_top()));
                                    this._outerTrack.addPoint(new Point(this._prevTrackRect.get_right(), this.get_bottom()));
                                }
                                break;
                            case 'U':
                                if (this._prevDirection == 'L') {
                                    this._innerTrack.addPoint(new Point(this.get_right(), this._prevTrackRect.get_top()));
                                    this._outerTrack.addPoint(new Point(this.get_left(), this._prevTrackRect.get_bottom()));
                                } else if (this._prevDirection == 'R') {
                                    this._innerTrack.addPoint(new Point(this.get_right(), this._prevTrackRect.get_bottom()));
                                    this._outerTrack.addPoint(new Point(this.get_left(), this._prevTrackRect.get_top()));
                                }
                                break;
                            case 'R':
                                if (this._prevDirection == 'U') {
                                    this._innerTrack.addPoint(new Point(this._prevTrackRect.get_right(), this.get_bottom()));
                                    this._outerTrack.addPoint(new Point(this._prevTrackRect.get_left(), this.get_top()));
                                } else if (this._prevDirection == 'D') {
                                    this._innerTrack.addPoint(new Point(this._prevTrackRect.get_left(), this.get_bottom()));
                                    this._outerTrack.addPoint(new Point(this._prevTrackRect.get_right(), this.get_top()));
                                }
                                break;
                            case 'D':
                                if (this._prevDirection == 'L') {
                                    this._innerTrack.addPoint(new Point(this.get_left(), this._prevTrackRect.get_top()));
                                    this._outerTrack.addPoint(new Point(this.get_right(), this._prevTrackRect.get_bottom()));
                                } else if (this._prevDirection == 'R') {
                                    this._innerTrack.addPoint(new Point(this.get_left(), this._prevTrackRect.get_bottom()));                                        
                                    this._outerTrack.addPoint(new Point(this.get_right(), this._prevTrackRect.get_top()));
                                }
                                break;
                        }
                        this._prevTrackRect = this.get_box();
                    }
                }
                
                if (this._innerTrack && this._outerTrack) {
                    this._trackPoly = new Polygon();
                    
                    var pts = this._innerTrack.get_points();
                    for (var i=0; i<pts.length; i++) {
                        this._trackPoly.addPoint(pts[i]);
                    }
                    
                    switch (this._currDirection) {
                        case 'L':
                            this._trackPoly.addPoint(new Point(this.get_left(), this.get_top()));
                            this._trackPoly.addPoint(new Point(this.get_left(), this.get_bottom()));
                            break;
                        case 'U':
                            this._trackPoly.addPoint(new Point(this.get_right(), this.get_top()));
                            this._trackPoly.addPoint(new Point(this.get_left(), this.get_top()));
                            break;
                        case 'R':
                            this._trackPoly.addPoint(new Point(this.get_right(), this.get_bottom()));
                            this._trackPoly.addPoint(new Point(this.get_right(), this.get_top()));
                            break;
                        case 'D':
                            this._trackPoly.addPoint(new Point(this.get_left(), this.get_bottom()));
                            this._trackPoly.addPoint(new Point(this.get_right(), this.get_bottom()));
                            break;
                    }
                    
                    var pts = this._outerTrack.get_points();
                    for (var i=pts.length; i>0; i--) {
                        this._trackPoly.addPoint(pts[i - 1]);
                    }
                }
            }
            //conquer finished succesully
            else if (this._trackStatus == 4) {
                var a = Number(this._freeAreaIndex);
                var b = new Polygon(this._trackPoly.get_points());
                var c = new Path(this._innerTrack.get_points());
                var d = new Path(this._outerTrack.get_points());
                this._raiseEvent('conquer', a, b, c, d);
                this.killTrack();
            }
        }
        
        //check if player hits one of the enemies (ball or monster)
        for (var idx in this._enemies) {
            var me = this.get_box();
            var other = this._enemies[idx];
            
            if (me.doesIntersect(other)) {
                this._raiseEvent('fail');
                break;
            }
            if (this._trackPoly) {
                if (this._trackPoly.findIntersection(other)) {
                    this._raiseEvent('fail');
                    break;                    
                }
            }
        }
    },
    
    stop: function () {
        this._velocity.set_x(0);
        this._velocity.set_y(0);
        this.set_direction(null);
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
    
    set_direction: function (dir) {
        this._prevDirection = new String(this._currDirection);
        this._currDirection = dir;
    },
    
    set_enemies: function (enemies) {
        this._enemies = enemies;
    },

    set_conqueredAreas: function (conqueredAreas) {
        this._conqueredAreas = conqueredAreas;
    },

    set_freeAreas: function (freeAreas) {
        this._freeAreas = freeAreas;
    },

    draw: function (ctx) {
        var thickness = 2;
        
        if (this._trackPoly) {
            this._trackPoly.draw(ctx, '#00A8A8');
            //this._innerTrack.drawPoints(ctx, 'Red');
            //this._outerTrack.drawPoints(ctx, 'Orange');
        }
        
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
    Movable.prototype,
    Player.prototype
);