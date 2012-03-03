/// <reference path="point.js" />

function Edge(a, b, c, d) {
	// a=x1,b=y1,c=x2,d=y2
	if (d!==undefined) {
		this._p1 = new Point(a, b);
		this._p2 = new Point(c, d);
	}
	// a=p1, b=p2
	else if (b!==undefined) {
        this._p1 = new Point(a);
        this._p2 = new Point(b);
    }
    // a=Edge
	else if (a) {
		this._p1 = new Point(a.get_p1());
		this._p2 = new Point(a.get_p2());
	}
	// empty
	else {
		this._p1 = new Point();
		this._p2 = new Point();
	}
}

Edge.prototype = {

    toString: function() {
        return 'from:' + this._p1.get_x() + ',' + this._p1.get_y() + ' ' + 'to:' + this._p2.get_x() + ',' + this._p2.get_y();
    },

    get_p1: function() {
        return new Point(this._p1);
    },

    get_p2: function() {
        return new Point(this._p2);
    }
    
};