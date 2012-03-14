function Ball(row, col, velocity, grid) {
    this.set_row(row);
    this.set_col(col);
    this.set_velocity(velocity);
    this.set_grid(grid);
}

Ball.prototype = {

    draw:function (ctx, blockSize, fillColor, strokeColor) {
        var thickness = 1;
        var radius = blockSize / 2;
        var x = this.get_col() * blockSize + radius;
        var y = this.get_row() * blockSize + radius;

        ctx.beginPath();
        ctx.arc(x, y, radius - thickness / 2, 0, Math.PI * 2, false);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.lineWidth = thickness;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
        ctx.closePath();
    }
    
};

Ball.prototype = $.extend(
    {},
    Movable.prototype,
    Ball.prototype
);



