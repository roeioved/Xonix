function Monster(left, top, size, fillColor, strokeColor, velocity, boundary, obstacles) {
    this.set_velocity(velocity);
    this.set_boundary(boundary);
    this.set_obstacles(obstacles);
    this._tl = new Point(left, top);
    this._br = new Point(left + size, top + size);
    this._size = size;
    this._fillColor = fillColor;
    this._strokeColor = strokeColor;
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
    }
};

Monster.prototype = $.extend(
    {},
    Rectangle.prototype,
    Movable.prototype,
    Monster.prototype
);