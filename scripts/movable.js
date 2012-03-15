function Movable(row, col, velocity, grid, blockerState) {
    this._row = row;
    this._col = col;
    this._velocity = velocity;
    this._grid = grid;
    this._blockerState = blockerState;
}

Movable.prototype = {
    
    get_row: function () {
        return this._row;
    },
    
    set_row: function (value) {
        this._row = value;
    },
    
    get_col: function () {
        return this._col;
    },
    
    set_col: function (value) {
        this._col = value;
    },
    
    get_velocity: function () {
        return this._velocity;
    },
    
    set_velocity: function (value) {
        this._velocity = value;
    },
    
    get_grid: function () {
        return this._grid;
    },
    
    set_grid: function (value) {
        this._grid = value;
    },
    
    get_blockerState: function () {
        return this._blockerState;
    },
    
    set_blockerState: function (value) {
        this._blockerState = value;
    },
    
    moveTo: function (row, col) {
        this._row = row;
        this._col = col;
    },
    
    offset: function (rows, cols) {
        this._row += rows;
        this._col += cols;
    },
    
    step: function () {
        var col = this.get_col();
        var row = this.get_row();
        var velocity = this.get_velocity();
        var grid = this.get_grid();
        var blockerState = this.get_blockerState();
        
        if (col + velocity.get_x() < 0 || col + velocity.get_x() > grid.get_numOfCols() - 1 || grid.get_state(row, col + velocity.get_x()) == blockerState)
            velocity.set_x(velocity.get_x() * -1);
        
        if (row + velocity.get_y() < 0 || row + velocity.get_y() > grid.get_numOfRows() - 1 || grid.get_state(row + velocity.get_y(), col) == blockerState)
            velocity.set_y(velocity.get_y() * -1);
        
        this.offset(velocity.get_y(), velocity.get_x());
    }
    
};
