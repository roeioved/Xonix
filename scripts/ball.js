function Ball(x, y, radius, fillColor, strokeColor, velocity, boundary, obstacles) {
    this._x = x;
    this._y = y;
    this._radius = radius;
    this._fillColor = fillColor;
    this._strokeColor = strokeColor;
    this._velocity = velocity;
    this._boundary = boundary;
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
    },

    get_boundary: function() {
        return this._boundary;
    },

    get_velocity: function() {
        return this._velocity;
    },

    get_obstacles: function() {
        return this._obstacles;
    },

    set_obstacles: function(obstacles) {
        this._obstacles = obstacles;
    }
};

Ball.prototype = $.extend(
    {},
    Circle.prototype,
    Movable.prototype,
    Ball.prototype
);



