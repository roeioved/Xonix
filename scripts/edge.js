/// <reference path="point.js" />

function Edge(a, b, c, d) {
	// a=x1,b=y1,c=x2,d=y2
	if (d!==undefined) {
		this.p1 = new Point(a, b);
		this.p2 = new Point(c, d);
	}
	// a=p1, b=p2
	else if (b!==undefined) {
        this.p1 = new Point(a);
        this.p2 = new Point(b);
    }
    // a=Edge
	else if (a) {
		this.p1 = new Point(a.p1);
		this.p2 = new Point(a.p2);
	}
	// empty
	else {
		this.p1 = new Point();
		this.p2 = new Point();
	}
}

Edge.prototype = {

    toString: function() {
        return 'from:' + this.p1.x + ',' + this.p1.y + ' ' + 'to:' + this.p2.x + ',' + this.p2.y;
    },
    
}