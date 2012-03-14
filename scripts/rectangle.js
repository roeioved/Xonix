/// <reference path="point.js" />

function Rectangle(a, b, c, d) {

    this._tl, this._br;

	// a=top_left_x, b=top_left_y, c=bottom_right_top, d=bottom_right_left
	if (d!==undefined) {
		this._tl = new Point(a, b);
		this._br = new Point(c, d);
	}
	// a=Point, b=Point
	else if (b!==undefined) {
		var mn = Math.min;
		var mx = Math.max;
		this._tl = new Point(mn(a.get_x(), b.get_x()), mn(a.get_y(), b.get_y()));
		this._br = new Point(mx(a.get_x(), b.get_x()), mx(a.get_y(), b.get_y()));
	}
	// a=Rectangle
	else if (a) {
		this._tl = new Point(a.get_topLeft());
		this._br = new Point(a.get_bottomRight());
	}
	// empty
	else {
		this._tl = new Point();
		this._br = new Point();
	}
}

Rectangle.prototype = {
    
    /*toString: function() {
        return 'top-left:' + this._tl.get_x() + ',' + this._tl.get_y() + ' ' + 'bottom-right:' + this._br.get_x() + ',' + this._br.get_y();
    },*/
    
    clone: function() {
        return new Rectangle(this);
    },
    
    get_topLeft: function() {
        return this._tl;
    },

    get_left: function() {
      return this._tl.get_x();
    },

    get_top: function() {
        return this._tl.get_y();
    },

    get_bottom: function() {
        return this._br.get_y();
    },

    get_right: function() {
        return this._br.get_x();
    },

    get_bottomRight: function() {
        return this._br;
    },

    get_center: function() {
        return new Point(this._tl.get_x() + this.get_width()/2, this._tl.get_y() + this.get_height()/2);
    },

    get_vertices: function() {
      var top_left = this.get_topLeft();
      var bottom_right = this.get_bottomRight();
      return [ top_left, new Point(bottom_right.x, top_left.y), bottom_right, new Point(top_left.x, bottom_right.y) ];
    },

    get_edges: function() {
        var edges = [];

        var top_right = new Point(this.get_right(), this.get_top());
        var bottom_left = new Point(this.get_left(), this.get_bottom());

        edges.push(new Edge(this.get_topLeft(), top_right));
        edges.push(new Edge(top_right, this.get_bottomRight()));
        edges.push(new Edge(bottom_left, this.get_bottomRight()));
        edges.push(new Edge(this.get_topLeft(), bottom_left));

        return edges;

    },

    get_width: function() {
        return this._br.get_x() - this._tl.get_x();
    },
    
    get_height: function() {
        return this._br.get_y() - this._tl.get_y();
    },

    get_box: function () {
        return new Rectangle(this._tl, this._br);
    },
        
    set: function(a) {
        // array of Points
        var mx = self.Math.max;
        var mn = self.Math.min;
        this._br.set_x(a[0].get_x());
        this._tl.set_x(a[0].get_x());
        this._tl.set_y(a[0].get_y());
        this._br.set_y(a[0].get_y());
        for (var i=1; i<a.length; i++ ) {
            var p = a[i];
            this._tl.set_x(mn(this._tl.get_x(),p.get_x()));
            this._tl.set_y(mn(this._tl.get_y(),p.get_y()));
            this._br.set_x(mx(this._br.get_x(),p.get_x()));
            this._br.set_y(mx(this._br.get_y(),p.get_y()));
        }
    },
    
    pointIn: function(p) {
        return p.get_x() > this._tl.get_x() && p.get_x() < this._br.get_x() && p.get_y() > this._tl.get_y() && p.get_y() < this._br.get_y();
    },
    
    doesIntersect: function(other) {
        var mn = Math.min;
        var mx = Math.max;
        var tl = other.get_topLeft();
        var br = other.get_bottomRight();
        return ( mn( br.get_x(), this._br.get_x() ) - mx( tl.get_x(), this._tl.get_x() ) ) > 0 && ( mn( br.get_y(), this._br.get_y() ) - mx( tl.get_y(), this._tl.get_y() ) ) > 0;
    },
        
    isEmpty: function() {
        return this.get_width() <= 0 || this.get_height() <= 0;
    },
    
    unionPoint: function(p) {
        var mn = Math.min;
        var mx = Math.max;
        this._tl.set_x(mn(this._tl.get_x(), p.get_x()));
        this._tl.set_y(mn(this._tl.get_y(), p.get_y()));
        this._br.set_x(mx(this._br.get_x(), p.get_x()));
        this._br.set_y(mx(this._br.get_y(), p.get_y()));
    },
    
    union: function(other) {
        // this rectangle is empty
        if (this.isEmpty()) {
            this._tl = other.get_topLeft();
            this._br = other.get_bottomRight();
        }
        // union only if other rectangle is not empty
        else if (!other.isEmpty()) {
            var mn = self.Math.min;
            var mx = self.Math.max;

            var tl = other.get_topLeft();
            var br = other.get_bottomRight();

            this._tl.set_x(mn(this._tl.get_x(), tl.get_x()));
            this._tl.set_y(mn(this._tl.get_y(), tl.get_y()));
            this._br.set_x(mx(this._br.get_x(), br.get_x()));
            this._br.set_y(mx(this._br.get_y(), br.get_y()));
        }
        return this;
    },
    
    offset: function(dx, dy) {
        this._tl.offset(dx, dy);
        this._br.offset(dx, dy);
    },

    draw: function(ctx, fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        ctx.rect(this._tl.get_x(), this._tl.get_y(), this.get_width(), this.get_height());
        ctx.fill();
        ctx.closePath();
    },

    project: function (axis) {
        var values = this.get_dotProduct(axis);
        var max, min;

        max = min = values[0];

        for (var i = 1; i < values.length; i++) {
            if (values[i] > max) {
                max = values[i];
            }

            else if (values[i] < min) {
                min = values[i];
            }
        }

        return { 'min':min, 'max':max };
    },

    get_dotProduct:function (axis) {
        var result = [];

        var vertices = this.get_vertices();

        for (var i = 0; i < vertices.length; i++) {
            result.push(axis.get_x() * vertices[i].get_x() + axis.get_y() * vertices[i].get_y());
        }

        return result;
    }
    
    /*
    
    inflate: function(a) {
        this.tl.x -= a;
        this.tl.y -= a;
        this.br.x += a;
        this.br.y += a;
    },    
    
    */
}