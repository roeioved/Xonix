function Ball(row, col, velocity, grid) {
    this._row = row;
    this._col = col;
    this.set_velocity(velocity);
    this.set_grid(grid);
}

Ball.prototype = {

    draw:function (ctx, blockSize, radius, fillColor, strokeColor) {
        var thickness = 1;
        var x = this.col * blockSize + blockSize / 2;
        var y = this.row * blockSize + blockSize / 2;
        
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



