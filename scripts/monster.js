function Monster(row, col, velocity, grid, blockerState) {
    this.set_row(row);
    this.set_col(col);
    this.set_velocity(velocity);
    this.set_grid(grid);
    this.set_blockerState(blockerState);
}

Monster.prototype = {

    draw:function (ctx, blockSize, fillColor, strokeColor) {
        var thickness = 3;
        var x = this.get_col() * blockSize + thickness / 2;
        var y = this.get_row() * blockSize + thickness / 2;
        
        ctx.beginPath();
        ctx.rect(x, y, blockSize - thickness, blockSize - thickness);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.lineWidth = thickness;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    }
};

Monster.prototype = $.extend(
    {},
    Movable.prototype,
    Monster.prototype
);