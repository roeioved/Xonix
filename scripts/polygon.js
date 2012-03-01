/// <reference path="edge.js" />
/// <reference path="rectangle.js" />

function Polygon(a) {
    this.points = [];
    if (a) {
        if (a instanceof Polygon) {
            var pts = a.points;
            var nPts = pts.length;
            for (var iPt = 0; iPt < nPts; nPts++) {
                this.points.push(new Point(pts[iPt]));
            }
            if (this.box)
                this.box = a.box.clone();
            if (this.area)
                this.area = a.area;
            if (this.centroid)
                this.centroid = a.centroid.clone();
            if (this.edges)
                this.edges = a.edges;
            if (this.vectors)
                this.vectors = a.vectors;
            if (this.hRectangles)
                this.hRectangles = a.hRectangles;
            if (this.vRectangles)
                this.vRectangles = a.vRectangles;
        } else if (a instanceof Array) { // array of points
            this.points = a;
        } else if (a instanceof Rectangle) {
            this.points.push(new Point(a.tl));
            this.points.push(new Point(a.br.x, a.tl.y));
            this.points.push(new Point(a.br));
            this.points.push(new Point(a.tl.x, a.br.y));
        }
    }
}

Polygon.prototype = {

    clone:function () {
        return new Polygon(this);
    },

    getPoints:function () {
        return this.points;
    },

    getNumberOfPoints:function () {
        return this.points.length;
    },

    _clear:function () {
        delete this.box;
        delete this.area;
        delete this.centroid;
        delete this.edges;
        delete this.vectors;
        delete this.hRectangles;
        delete this.vRectangles;
    },

    addPoint:function (p) {
        this.points.push(p);
        this._clear();
    },

    addPointOnPolygon:function (p) {
        var pts = this.points;
        var nPts = pts.length;
        if (nPts == 0) {
            this.points.push(p);
        } else {
            var iPt, jPt;
            for (jPt = 0, iPt = nPts - 1; jPt < nPts; iPt = jPt++) {
                var angleFromPrevPoint = pts[iPt].findAngle(pts[jPt]);
                var angleFromPoint = p.findAngle(pts[jPt]);
                if (angleFromPrevPoint == angleFromPoint) {
                    this.points.splice(iPt + 1, 0, p);
                    break;
                }
            }
        }
        this._clear();
    },

    addPointsOnPolygon:function (pts) {
        for (var i = 0; i < pts.length; i++) {
            this.addPointOnPolygon(pts[i]);
        }
    },

    getBox:function () {
        if (!this.box) {
            this.box = new Rectangle();
            var pts = this.points;
            var nPts = pts.length;
            // we need at least 3 points for a non-empty box
            if (nPts > 2) {
                var box = new Rectangle(pts[0], pts[1]);
                for (var iPt = 2; iPt < nPts; iPt++) {
                    box.unionPoint(pts[iPt]);
                }
                this.box.union(box);
            }
        }
        return this.box.clone();
    },

    getArea:function () {
        if (!this.area) {
            var area = 0;
            var pts = this.points;
            var nPts = pts.length;
            if (nPts > 2) {
                var j = nPts - 1;
                var p1;
                var p2;
                for (var i = 0; i < nPts; j = i++) {
                    p1 = pts[i];
                    p2 = pts[j];
                    area += p1.x * p2.y;
                    area -= p1.y * p2.x;
                }
                this.area = area / 2;
            }
        }
        return this.area;
    },

    getCentroid:function () {
        if (!this.centroid) {
            var x = 0, y = 0, f;
            var p1, p2;
            var pts = this.points;
            var nPts = pts.length;
            var jPt = nPts - 1;
            for (var iPt = 0; iPt < nPts; jPt = iPt++) {
                p1 = pts[iPt];
                p2 = pts[jPt];
                f = p1.x * p2.y - p2.x * p1.y;
                x += (p1.x + p2.x) * f;
                y += (p1.y + p2.y) * f;
            }
            f = this.getArea() * 6;
            // centroid relative to self box
            var origin = this.getBox().getTopleft();
            this.centroid = new Point(Math.round(x / f - origin.x), Math.round(y / f - origin.y));
        }
        return this.centroid.clone();
    },

    getEdges:function () {
        if (!this.edges) {
            var p1, p2, edge;
            this.edges = [];

            for (var i = 0; i < this.points.length; i++) {
                p1 = this.points[i];

                if (i + 1 >= this.points.length) {
                    p2 = this.points[0];
                } else {
                    p2 = this.points[i + 1];
                }

                var p1_x = p1.x, p2_x = p2.x;

                if (p1_x > p2_x) {
                    p1_x = p2.x;
                    p2_x = p1.x;
                }

                edge = new Edge(p1_x, p1.y, p2_x, p2.y);
                this.edges.push(edge);
            }
        }
        return this.edges;
    },

    getVectors:function () {
        if (!this.vectors) {
            var p1, p2;
            this.vectors = [];

            for (var i = 0; i < this.points.length; i++) {
                p1 = this.points[i];

                if (i + 1 >= this.points.length) {
                    p2 = this.points[0];
                } else {
                    p2 = this.points[i + 1];
                }

                this.vectors.push(new Vector(p2.x - p1.x, p2.y - p1.y));
            }
        }
        return this.vectors;
    },

    getDotProduct:function (axis) {
        var result = [];

        for (var i = 0; i < this.points.length; i++) {
            result.push(axis.x * this.points[i].x + axis.y * this.points[i].y);
        }
        return result;
    },

    getRectangles:function (orientation) {
        if (!this.hRectangles) {
            this.hRectangles = [];
            var slices = this._createSlicesWithEdges(orientation);

            for (var i = 0; i < slices.length; i++) {
                var slice = slices[i];
                var edges = slice.getUnmarkedEdges();

                while (edges.length > 0) {
                    for (var edge in edges) {
                        edge = edges[edge];

                        var rec = this._getRectangle(edge, i, slices);

                        if (rec) {
                            this.hRectangles.push(rec);

                            var recEdges = rec.getEdges();

                            for (var recEdge in recEdges) {
                                recEdge = recEdges[recEdge];

                                if (recEdge.p1.y == recEdge.p2.y) { //if horizontal
                                    for (var j = 0; j < slices.length; j++) {
                                        if (slices[j].value == recEdge.p1.y) {
                                            if (!slices[j].findEdge(recEdge)) //edge was not found
                                            {
                                                slices[j].update(recEdge);
                                            }
                                            slices[j].markEdge(recEdge.p1, recEdge.p2);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        else { //rectangle not found for edge
                            for (var j = 0; j < slices.length; j++) {
                                if (slices[j].value == edge.p1.y) {
                                    slices[j].markEdge(edge.p1, edge.p2);
                                    break;
                                }
                            }
                        }
                    }
                    edges = slice.getUnmarkedEdges();
                }
            }
        }
        return this.hRectangles;
    },

    getVerticalRectangles:function () {
        if (!this.vRectangles) {
            this.vRectangles = [];
        }
        return this.vRectangles;
    },

    pointOn:function (p) {
        var pts = this.points;
        var nPts = pts.length;
        var iPt, jPt;
        for (jPt = 0, iPt = nPts - 1; jPt < nPts; iPt = jPt++) {
            var angleFromPrevPoint = pts[iPt].findAngle(pts[jPt]);
            var angleFromPoint = p.findAngle(pts[jPt]);
            if (angleFromPrevPoint == angleFromPoint)
                return true;
        }
        return false;
    },

    pointsOn:function (pts) {
        var r = [], nPts, pt;
        nPts = pts.length;
        for (var i = 0; i < nPts; i++) {
            pt = pts[i];
            if (this.pointOn(pt))
                r.push(pt);
        }
        return r;
    },

    containsPoint:function (p) {
        var box = this.getBox();

        if (!box.pointIn(p)) {
            return false;
        } else {
            /*
             // http://stackoverflow.com/questions/217578/point-in-polygon-aka-hit-test
             var e = (box.br.x - box.tl.x) / 100; // epsilon
             var rp = new Point(box.tl.x - e/p.y);  // ray start point
             var intersections = 0;

             var edges = this.getEdges();
             for (var i=0; i<edges.length; i++) {
             ...
             }
             */
            var pts = this.points;
            var nPts = pts.length;
            var vertX = [];
            var vertY = [];
            for (var i = 0; i < nPts; i++) {
                vertX.push(pts[i].x);
                vertY.push(pts[i].y);
            }

            var i, j = 0;
            var c = false;
            for (i = 0, j = nPts - 1; i < nPts; j = i++) {
                if (((vertY[i] > p.y) != (vertY[j] > p.y)) && (p.x < (vertX[j] - vertX[i]) * (p.y - vertY[i]) / (vertY[j] - vertY[i]) + vertX[i]))
                    c = !c;
            }
            return c;
        }
    },

    //creates an array of slices. Each slice contains a list of edges positioned on the slice's axis according to its orientation.
    //the orientation should be a vector of the following options: (0,1) - horizontal or  (1,0) - vertical
    _createSlicesWithEdges:function (orientation) {
        var res = [];
        var points = this.points;

        for (var i = 0; i < points.length; i++) {
            var p1_x = points[i].x;
            var p1_y = points[i].y;
            var p2_x, p2_y;

            if (i == points.length - 1) {
                p2_x = points[0].x;
                p2_y = points[0].y;
            }
            else {
                p2_x = points[i + 1].x;
                p2_y = points[i + 1].y;
            }

            if (orientation.y) { //Horizontal slices
                if (p1_y == p2_y) {
                    var currSlice = null;

                    for (var slice in res) {
                        if (res[slice].value == p1_y) {
                            currSlice = res[slice];
                        }
                    }

                    if (!currSlice) {
                        currSlice = new Slice(new Vector(0, 1), points[i].y);
                        for (var j = 0; j < res.length; j++) {
                            if (res[j].value > points[i].y)
                                break;
                        }
                        res.splice(j, 0, currSlice);
                    }

                    if (p2_x < p1_x) { //sort points from left to right on the horizontal axis
                        var temp = p1_x;
                        p1_x = p2_x;
                        p2_x = temp;
                    }

                    currSlice.addEdge(new Point(p1_x, p1_y), new Point(p2_x, p1_y));
                }
            }
            else if (orientation.x) { //vertical orientation
                if (p1_x == p2_x) {
                    var currSlice = null;

                    for (var slice in res) {
                        if (res[slice].value == p1_x) {
                            currSlice = res[slice];
                        }
                    }

                    if (!currSlice) {
                        currSlice = new Slice(new Vector(1, 0), points[i].x);

                        for (var j = 0; j < res.length; j++) {
                            if (res[j].value > points[i].x)
                                break;
                        }
                        res.splice(j, 0, currSlice);
                    }

                    if (p2_y < p1_y) { //sort points from top to bottom on the vertical axis
                        var temp = p1_y;
                        p1_y = p2_y;
                        p2_y = temp;
                    }

                    currSlice.addEdge(new Point(p1_x, p1_y), new Point(p1_x, p2_y));
                }
            }

        }

        return res;
    },

    _getRectangle:function (edge, sliceIndex, slices) {

        if (slices[sliceIndex].orientation.y) { //horizontal
            var left_x = edge.p1.x;
            var right_x = edge.p2.x;

            //iterate over all edges on consecutive slices
            for (var i = sliceIndex + 1; i < slices.length; i++) {
                var slice = slices[i];

                //get all edges for this slice
                var edges = slice.getUnmarkedEdges();

                for (var slice_edge in edges) {
                    slice_edge = edges[slice_edge];

                    if (slice_edge.p1.x <= left_x && slice_edge.p2.x > left_x) {
                        //we found a good candidate for our edge. we can generate the rectangle and return it
                        right_x = slice_edge.p2.x < right_x ? slice_edge.p2.x : right_x;

                        var pol = new Polygon([
                            new Point(left_x, edge.p1.y),
                            new Point(right_x, edge.p1.y),
                            new Point(right_x, slice.value),
                            new Point(left_x, slice.value)
                        ]);

                        return pol;
                    }
                    else if (slice_edge.p1.x > left_x && slice_edge.p1.x < right_x) {
                        // if edge is not a goot candidate for the bottom edge of the polygon, but still intersects with the upper edge of the polygon, we should decrease the size of
                        // upper edge and set the right bound to be the left bound of this intersecting edge.
                        right_x = slice_edge.p1.x;
                    }
                }
            }
        }
        else if (slices[sliceIndex].orientation.x) { //vertical
            var top_y = edge.p1.y;
            var bottom_y = edge.p2.y;

            //iterate over all edges on consecutive slices
            for (var i = sliceIndex + 1; i < slices.length; i++) {
                var slice = slices[i];

                //get all edges for this slice
                var edges = slice.getUnmarkedEdges();

                for (var slice_edge in edges) {
                    slice_edge = edges[slice_edge];

                    if (slice_edge.p1.y <= top_y && slice_edge.p2.y > top_y) {
                        //we found a good candidate for our edge. we can generate the rectangle and return it
                        bottom_y = slice_edge.p2.y < bottom_y ? slice_edge.p2.y : bottom_y;

                        var pol = new Polygon([
                            new Point(edge.p1.x, edge.p1.y),
                            new Point(slice_edge.p1.x, slice_edge.p1.y),
                            new Point(slice_edge.p2.x, slice_edge.p2.y),
                            new Point(edge.p2.x, edge.p2.y)
                        ]);

                        return pol;
                    }
                    else if (slice_edge.p1.y > top_y && slice_edge.p1.y < bottom_y) {
                        // if edge is not a goot candidate, but still intersects with the edge of the polygon, we should decrease the size of
                        // the edge and set its bottom bound to be the top bound of this intersecting edge.
                        bottom_y = slice_edge.p1.y;
                    }
                }
            }
        }
    },

    //splits polygon to two polygons by path
    split:function (path) {
        var polygons = [];
        var pointsToAdd = this.pointsOn(path.getPoints());

        if (pointsToAdd.length != 2)
            throw "invalid path";

        this.addPointsOnPolygon(pointsToAdd);

        var poly1 = new Polygon(), poly2 = new Polygon();
        var pts, nPts, iPt, pt, tmp = 1;
        var direction = path.getDirection();

        pts = this.points;
        nPts = pts.length;
        for (iPt = 0; iPt < nPts; iPt++) {
            var pt = pts[iPt].clone();
            var exists = path.containsPoint(pt);

            if (exists) {
                tmp *= -1;

                if (poly2.points.length == 0) {
                    if (direction == 'D' || direction == 'L') {
                        for (i = 0; i < path.points.length; i++) {
                            poly1.points.push(path.points[i].clone());
                            poly2.points.unshift(path.points[i].clone());
                        }
                    } else if (direction == 'U' || direction == 'R') {
                        for (i = path.points.length - 1; i >= 0; i--) {
                            poly1.points.push(path.points[i].clone());
                            poly2.points.unshift(path.points[i].clone());
                        }
                    }
                }
            } else {
                if (tmp == 1) poly1.points.push(pt);
                else poly2.points.push(pt);
            }
        }

        polygons.push(poly1);
        polygons.push(poly2);

        return polygons;
    },

    doesIntersect:function (rectangle) {
        return this.getBox().doesIntersect(rectangle);
    },

    draw:function (ctx, fillStyle) {
        var pts, nPts, pt;

        ctx.fillStyle = fillStyle;
        ctx.beginPath();

        pts = this.points;
        nPts = pts.length;
        if (nPts > 1) {
            pt = pts[0];
            ctx.moveTo(pt.x, pt.y);
            for (var i = 1; i < nPts; i++) {
                pt = pts[i];
                ctx.lineTo(pt.x, pt.y);
            }
            ctx.closePath();
        }

        ctx.fill();
    },

    drawPoints:function (ctx, fillStyle) {
        var pts, nPts, pt, radius = 3;

        ctx.fillStyle = fillStyle;
        pts = this.points;
        nPts = pts.length;
        for (var i = 0; i < nPts; i++) {
            pt = pts[i];
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, radius, 0, self.Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    }

    /*

     getPoints: function () {
     var res = [];

     for (var i = 0; i < this.points.length; i++) {
     res.push(new Point(this.points[i].x, this.points[i].y));
     }

     return res;
     },

     getEdges: function() {
     if (!this.edges) {
     this.edges = [];
     var pts = this.points;
     var nPts = pts.length;
     var iPt, jPt;
     for (jPt=0, iPt=nPts-1; jPt<nPts; iPt=jPt++) {
     var edge = new Edge(pts[jPt], pts[iPt]);
     this.edges.push(edge);
     }
     }
     return this.edges;
     },

     offset: function(dx,dy) {
     var pts = this.points;
     var nPts = pts.length;
     for (var iPt=0; iPt<nPts; iPt++) {
     pts[iPt].offset(dx,dy);
     }
     if (this.box) {
     this.box.offset(dx,dy);
     }
     if (this.centroid) {
     this.centroid.offset(dx,dy);
     }
     },

     moveTo: function(x,y) {
     // position is centroid
     var centroid = this.getCentroid();
     var tl = this.getBox().getTopleft();
     this.offset(x-tl.x-centroid.x, y-tl.y-centroid.y);
     },

     get_center: function () {

     var totalX = 0;
     var totalY = 0;
     for (var i = 0; i < this.points.length; i++) {
     totalX += this.points[i].x;
     totalY += this.points[i].y;
     }

     return new Point(totalX / this.points.length, totalY / this.points.length);
     },

     containsPoint: function (pnt) {
     var nvert = this.points.length;
     var testx = pnt.x;
     var testy = pnt.y;

     var vertx = new Array();
     for (var q = 0; q < this.points.length; q++) {
     vertx.push(this.points[q].x);
     }

     var verty = new Array();
     for (var w = 0; w < this.points.length; w++) {
     verty.push(this.points[w].y);
     }

     var i, j = 0;
     var c = false;
     for (i = 0, j = nvert - 1; i < nvert; j = i++) {
     if (((verty[i] > testy) != (verty[j] > testy)) &&
     (testx < (vertx[j] - vertx[i]) * (testy - verty[i]) / (verty[j] - verty[i]) + vertx[i]))
     c = !c;
     }
     return c;
     },

     */
}