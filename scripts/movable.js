function Movable(velocity, grid) {
    this._velocity = velocity;
    this._grid = grid;
}

Movable.prototype = {

    get_velocity:function () {
        return this._velocity;
    },

    set_velocity:function (value) {
        this._velocity = value;
    },

    get_grid:function () {
        return this._grid;
    },

    set_grid:function (value) {
        this._grid = value;
    },

    step:function () {
    }
    
};
