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
    },
    
	doesIntersect: function (other) {
		var epsilon = 10e-6;
		var p = this.get_p1();
		var r = this.get_p2().subtract(p);
		var q = other.get_p1();
		var s = other.get_p2().subtract(q);
		var cross = this._cross(r, s);
		
		if(cross <= epsilon && cross >= -1 * epsilon){
				return null; // parallel
		}
		
		var t = this._cross(q.subtract(p), s) / cross;
		var u = this._cross(q.subtract(p), r) / cross;
		
		if (0 <= u && u <= 1 && 0 <= t && t <= 1) {
				intPoint = p.add(r.scalarMult(t));
				return new Point(intPoint.get_x(), intPoint.get_y());
		} else {
				return null;
		}
	},
	
	_cross: function (v1, v2) {
		return v1.get_x() * v2.get_y() - v2.get_x() * v1.get_y();
	}
	
};