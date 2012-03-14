function Vector(a, b) {
    if (a != undefined && b != undefined) //a=x, b=y
    {
        this._x = a;
        this._y = b;
    }
    else if (a != undefined) //a is vector
    {
        this._x = a.get_x();
        this._y = a.get_y();
    }
}

Vector.prototype = {

    getMagnitude:function () {
        return Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2));
    },

    normalize:function () {
        var mag = this.getMagnitude();
        this._x = this._x / mag;
        this._y = this._y / mag;
    },

    getDotProduct:function (other) {
        return new Vector(this._x * other.get_x(), this._y * other.get_y());
    },
      
    rotate:function (angle) {
        this._x = Math.cos(this._x) - Math.sin(this._y);
        this._y = Math.sin(this._x) + Math.cos(this._y);
    },

    getPerpendicular:function () {
        return new Vector(-this._y, this._x);
    },

    get_x:function () {
        return this._x;
    },

    get_y:function () {
        return this._y;
    },

    set_x:function (x) {
        this._x = x;
    },

    set_y:function (y) {
        this._y = y;
    }

}