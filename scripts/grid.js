
function Grid(rows, cols, state) {
    this._rows;
    this._cols;
    this._grid;
    this.init(rows, cols, state);
}

Grid.prototype = {

    init: function(rows, cols, state) {
        this._rows = rows;
        this._cols = cols;

        this._grid = new Array(rows);
        for (var row in this._grid) {
            this._grid[row] = new Array(cols);
        }

        for(var i=0; i<rows; i++) {
            for (var j=0; j<cols; j++) {
                this.set_state(i, j, state);
            }
        }
    },

    get_state: function(row, col) {
        return this._grid[row][col];
    },

    set_state: function(row, col, state) {
        this_grid[row][col] = state;
    },

    get_numOfCols: function() {
        return this._cols;
    },

    get_numOfRows: function() {
        return this._rows;
    },

    set_col: function(col, state) {
        for (var i=0; i<this._rows; i++) {
            this.set_state(i,col, state);
        }
    },

    set_row: function(row, state) {
        for (var i=0; i<this._cols; i++) {
            this.set_state(row, i, state);
        }
    },

    draw: function(ctx, color0, color1) {
        for(var i=0; i<rows; i++) {
            for (var j=0; j<cols; j++) {
                ctx.fillStyle = this.get_state(i,j) == 0 ? color0 : color1;
                ctx.beginPath();
                ctx.rect(j * this._blockSize, i * this._blockSize, this._blockSize, this._blockSize);
                ctx.fill();
                ctx.closePath();
            }
        }
    }

};