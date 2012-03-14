function Player(row, col, velocity, grid, enemies) {
    this.set_row(row);
    this.set_col(col);
    this.set_velocity(velocity);
    this.set_grid(grid);
    this._enemies = enemies;
    
    //this.killTrack();
}

Player.prototype = {
    
    init: function () {
        this.set_row(0);
        this.set_col(0);
        this.set_velocity(new Vector(0, 0));
    },
    
    /*
    killTrack: function () {
        this._prevDirection = null;
        this._currDirection = null;
        this._trackStatus = 0; // 0-no track  1-starting  2-conquering  3-finishing  4-finished
        this._prevTrackRect = null;
        this._innerTrack = null;
        this._outerTrack = null;
        this._trackPoly = null;
        this._freeAreaIndex = null;
        
        this.stop();
    },
    */
    
    get_enemies: function () {
        return this._enemies;
    },

    set_enemies: function (enemies) {
        this._enemies = enemies;
    },
    
    stop: function () {
        this.set_velocity(new Vector(0, 0));
    },
    
    moveLeft: function () {        
        this.set_velocity(new Vector(-1, 0));
    },
    
    moveUp: function () {
        this.set_velocity(new Vector(0, -1));
    },
    
    moveRight: function () {
        this.set_velocity(new Vector(1, 0));
    },

    moveDown: function () {
        this.set_velocity(new Vector(0, 1));
    },
    
    step: function () {
        var col = this.get_col();
        var row = this.get_row();
        var velocity = this.get_velocity();
        var grid = this.get_grid();
        var blockerState = this.get_blockerState();
        
        if (col + velocity.get_x() < 0 || col + velocity.get_x() > grid.get_numOfCols() - 1)
            velocity.set_x(0);
        
        if (row + velocity.get_y() < 0 || row + velocity.get_y() > grid.get_numOfRows() - 1)
            velocity.set_y(0);
        
        this.offset(velocity.get_y(), velocity.get_x());
    },
    
    draw:function (ctx, blockSize, fillColor, strokeColor) {
        var thickness = 2;
        var x = this.get_col() * blockSize;
        var y = this.get_row() * blockSize;
        
        /*
        if (this._trackPoly) {
            this._trackPoly.draw(ctx, '#00A8A8');
        }
        */
        
        ctx.beginPath();
        ctx.rect(x + thickness, y + thickness, blockSize - thickness, blockSize - thickness);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.lineWidth = thickness;
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
    }
    
};

Player.prototype = $.extend(
    {},
    EventHandler.prototype,
    Movable.prototype,
    Player.prototype
);