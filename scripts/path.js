/// <reference path="point.js" />
/// <reference path="edge.js" />

function Path(a, b) {
	this._points = [];

	if (b!==undefined) {
		this._points.push(new Point(a));
		this._points.push(new Point(b));
	} else if (a) {
		if (a instanceof Path) {
			var pts = a.get_points();
			var nPts = pts.length;
			for (var iPt=0; iPt<nPts; nPts++) {
				this._points.push(new Point(pts[iPt]));
			}
		}
		else if (a instanceof Array) {
			this._points = a;
		}
	}
}

Path.prototype = {
		
    addPoint: function(p) {	
        this._points.push(p);
    },
    
    addPoints: function(pts) {
        for (var i=0; i<pts.length; i++) {
            this.addPoint(pts[i]);
        }
    },
    
    clone: function() {
        return new Path(this);
    },
    
    containsPoint: function(p) {
        var pts = this._points;
        var nPts = pts.length;
        for (var i=0; i<nPts; i++) {
            var pt = pts[i];
            if (p.get_x() == pt.get_x() && p.get_y() == pt.get_y())
                return true;
        }
        return false;
    },
    
    get_points: function() {
        return this._points;
    },
    
    // 0=Up 1=Right 2=Down 3=Left
    get_direction: function() {
        var direction = '?';
        var pts = this._points;
        var nPts = pts.length;	
        if (nPts>1) {
            var ptA = pts[0];
            var ptB = pts[1];
            
            if (ptA.get_x() == ptB.get_x()) {
                if (ptA.get_y() > ptB.get_y())
                    direction = 'U'; // UP
                else if (ptA.get_y() < ptB.get_y())
                    direction = 'D'; // DOWN
            } else if (ptA.get_y() == ptB.get_y()) {
                if (ptA.get_x() < ptB.get_x())
                    direction = 'R'; // RIGHT
                else if (ptA.get_x() > ptB.get_x())
                    direction = 'L'; // LEFT		
            }
        }
        return direction;
    },
    
    draw: function(ctx, strokeStyle) {
        var pts, nPts, pt;
        
        ctx.strokeStyle = strokeStyle;	
        
        pts = this._points;
        nPts = pts.length;
        if (nPts > 1) {
            pt = pts[0];
            ctx.beginPath();
            ctx.moveTo(pt.get_x(), pt.get_y());        
            for (var i=1; i<nPts; i++) {
                pt = pts[i];
                ctx.lineTo(pt.get_x(), pt.get_y());
                ctx.stroke();
            }
        }
    },
    
    drawPoints: function(ctx, fillStyle) {
        var pts, nPts, pt, radius = 3;
        
        // draw points
        ctx.fillStyle = fillStyle;
        pts = this._points;
        nPts = pts.length;
        for (var i=0; i<nPts; i++) {
            pt = pts[i];
            ctx.beginPath();
            ctx.arc(pt.get_x(), pt.get_y(), radius, 0, self.Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
        }
    },
    
    getEdges: function(p) {
        var edges = [];
        var pts = this._points;
        var nPts = pts.length;
		if (nPts > 1) {
            for (var i=1; i<nPts; i++) {
                var edge = new Edge(pts[i-1], pts[i]);
                edges.push(edge);
            }
        }
        return edges;
    },
	
	replace: function(p1, p2) {
		for (var idx in this._points) {
				if (this._points[idx].compare(p1)) {
						this._points.splice(idx, 1, p2);
				}
		}
	}
	
}