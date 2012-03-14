function Ball(x, y, radius, fillColor, strokeColor, velocity, boundary, obstacles) {
    this.set_velocity(velocity);
    this.set_boundary(boundary);
    this.set_x(x);
    this.set_y(y);
    this._radius = radius;
    this._fillColor = fillColor;
    this._strokeColor = strokeColor;
    this._obstacles = obstacles;
}

Ball.prototype = {

    draw:function (ctx) {
        var thickness = 1;

        ctx.beginPath();
        ctx.arc(this._x, this._y, this._radius - thickness / 2, 0, Math.PI * 2, false);
        ctx.fillStyle = this._fillColor;
        ctx.fill();
        ctx.lineWidth = thickness;
        ctx.strokeStyle = this._strokeColor;
        ctx.stroke();
        ctx.closePath();
    }


};

Ball.prototype = $.extend(
    {},
    Circle.prototype,
    Movable.prototype,
    Ball.prototype
);



