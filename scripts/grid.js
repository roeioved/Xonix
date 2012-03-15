function Grid(rows, cols, state) {
    this._rows;
    this._cols;
    this._grid;
    this.init(rows, cols, state);
}

Grid.prototype = {

    init:function (rows, cols, state) {
        this._rows = rows;
        this._cols = cols;

        this._grid = new Array(rows);
        for (var i = 0; i < this._grid.length; i++) {
            this._grid[i] = new Array(cols);
        }

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                this.set_state(i, j, state);
            }
        }
    },

    get_state:function (row, col) {
        return this._grid[row][col];
    },

    set_state:function (row, col, state) {
        this._grid[row][col] = state;
    },

    get_numOfCols:function () {
        return this._cols;
    },

    get_numOfRows:function () {
        return this._rows;
    },

    set_col:function (col, state) {
        for (var i = 0; i < this._rows; i++) {
            this.set_state(i, col, state);
        }
    },

    set_row:function (row, state) {
        for (var i = 0; i < this._cols; i++) {
            this.set_state(row, i, state);
        }
    },

    get_size:function () {
        return this._rows * this._cols;
    },

    get_count:function (state) {
        var counter = 0;

        for (var i = 0; i < this._rows; i++) {
            for (var j = 0; j < this._cols; j++) {
                if (this.get_state(i, j) == state) {
                    counter++;
                }
            }
        }

        return counter;
    },

    flood:function (row, col, oldValue, newValue) {
        this._recursiveFlood(row, col, oldValue, newValue);
    },

    _recursiveFlood:function (row, col, oldValue, newValue) {
        for (var i = -1; i <= 1; i++) {
            var r = row + i;
            for (var j = -1; j <= 1; j++) {
                var c = col + j;
                if (r >= 0 && r < this._rows && c >= 0 && c < this._cols) {
                    var state = this.get_state(r, c);
                    if (state == oldValue) {
                        this.set_state(r, c, newValue);
                        this._recursiveFlood(r, c, oldValue, newValue);
                    }
                }
            }
        }
    },

    findFirst:function (state) {
        for (var j = 0; j < this._cols; j++) {
            for (var i = 0; i < this._rows; i++) {
                if (this.get_state(i, j) == state) {
                    return {row: i, col: j};
                }
            }
        }
        return null;
    },

    replace:function (oldValue, newValue) {
        for (var i = 0; i < this._rows; i++) {
            for (var j = 0; j < this._cols; j++) {
                var state = this.get_state(i, j);

                if (state == oldValue) {
                    this.set_state(i, j, newValue);
                }
            }
        }
    },
        
    draw: function(ctx, blockSize, color0, color1, color2) {
        for(var i=0; i<this._rows; i++) {
            for (var j=0; j<this._cols; j++) {
                var state = this.get_state(i, j);
                var fillStyle;
                
                switch (state) {
                    case 0: fillStyle = color0; break;
                    case 1: fillStyle = color1; break;
                    case 2: fillStyle = color2; break;
                }
                
                ctx.fillStyle = fillStyle;
                ctx.beginPath();
                ctx.rect(j * blockSize, i * blockSize, blockSize, blockSize);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    
};