/// <reference path="point.js" />
/// <reference path="edge.js" />

function Path(a, b) {
	this.points = [];
	if (b!==undefined) {
		this.points.push(new Point(a));
		this.points.push(new Point(b));
	} else if (a) {
		if (a instanceof Path) {
			var pts = a.pts;
			var nPts = pts.length;
			for (var iPt=0; iPt<nPts; nPts++) {
				this.points.push(new Point(pts[iPt]));
			}
		}
		else if (a instanceof Array) {
			this.points = a;
		}
	}
}

Path.prototype = {
    addPoint: function(p) {	
        this.points.push(p);
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
        var pts = this.points;
        var nPts = pts.length;
        for (var i=0; i<nPts; i++) {
            var pt = pts[i];
            if (p.x == pt.x && p.y == pt.y)
                return true;
        }
        return false;
    },
    
    getPoints: function() {
        return this.points;
    },
    
    // 0=Up 1=Right 2=Down 3=Left
    getDirection: function() {
        var direction = '?';
        var pts = this.points;
        var nPts = pts.length;	
        if (nPts>1) {
            var ptA = pts[0];
            var ptB = pts[1];
            
            if (ptA.x == ptB.x) {
                if (ptA.y > ptB.y)
                    direction = 'U'; // UP
                else if (ptA.y < ptB.y)
                    direction = 'D'; // DOWN
            } else if (ptA.y == ptB.y) {
                if (ptA.x < ptB.x)
                    direction = 'R'; // RIGHT
                else if (ptA.x > ptB.x)
                    direction = 'L'; // LEFT		
            }
        }
        return direction;
    },
    
    draw: function(ctx, strokeStyle) {
        var pts, nPts, pt;
        
        ctx.strokeStyle = strokeStyle;	
        
        pts = this.points;
        nPts = pts.length;
        if (nPts > 1) {
            pt = pts[0];
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);        
            for (var i=1; i<nPts; i++) {
                pt = pts[i];
                ctx.lineTo(pt.x, pt.y);
                ctx.stroke();
            }
        }
    },
    
    drawPoints: function(ctx, fillStyle) {
        var pts, nPts, pt, radius = 3;
        
        // draw points
        ctx.fillStyle = fillStyle;
        pts = this.points;
        nPts = pts.length;
        for (var i=0; i<nPts; i++) {
            pt = pts[i];
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, radius, 0, self.Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
        }
    },
    
    getEdges: function(p) {
        var edges = [];
        var pts = this.points;
        var nPts = pts.length;
        if (nPts > 1) {
            for (var i=1; i<nPts; i++) {
                var edge = new Edge(pts[i-1], pts[i]);
                edges.push(edge);
            }
        }
        return edges;
    }
}