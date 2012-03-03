function Monster(left, top, size, fillColor, strokeColor, velocity, boundary, obstacles) {
    this._tl = new Point(left, top);
    this._br = new Point(left + size, top + size);
    this._size = size;
    this._fillColor = fillColor;
    this._strokeColor = strokeColor;
    this._velocity = velocity;
    this._boundary = boundary;
    this._obstacles = obstacles;
}

Monster.prototype = {

    draw: function (ctx) {        
        var thickness = 2;
        
        ctx.beginPath();
        ctx.rect(this._tl.get_x() + thickness, this._tl.get_y() + thickness, this._size - thickness, this._size - thickness);
        ctx.fillStyle = this._fillColor;
        ctx.fill();
        ctx.lineWidth = thickness;
        ctx.strokeStyle = this._strokeColor;
        ctx.stroke();
    },

    get_velocity: function() {
        return this._velocity;
    },

    get_boundary: function() {
        return this._boundary;
    },

    get_obstacles: function() {
        return this._obstacles;
    },

    set_obstacles: function(obstacles) {
        this._obstacles = obstacles;
    }

};

Monster.prototype = $.extend(
    {},
    Rectangle.prototype,
    Movable.prototype,
    Monster.prototype
);