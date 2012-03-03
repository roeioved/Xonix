/// <reference path="edge.js" />
/// <reference path="rectangle.js" />

function Polygon(a) {
    this._points = [];
    this._box = null;
    this._area = null;
    this._centroid = null;
    this._edges = null;
    this._vectors = null;

    if (a) {
        if (a instanceof Polygon) {

            this._points = [];
            var pts = a.get_points();

            if (pts) {
                for (var i = 0; i < pts.length; i++) {
                    this._points.push(new Point(pts[i]));
                }
            }

            this._box = a.get_box().clone();
            this._area = a.get_area();
            this._centroid = a.get_centroid().clone();

            this._edges = [];
            var edges = a.get_edges();

            if (edges) {
                for (var i = 0; i < edges.length; i++) {
                    this._edges.push(new Edge(edges[i]));
                }
            }

            this._vectors = [];
            var vectors = a.get_vectors();

            if (vectors) {
                for (var i = 0; i < vectors.length; i++) {
                    this._vectors.push(new Vector(vectors[i]));
                }
            }

            this._hRectangles = [];
            var _hRectangles = a.get_rectangles(new Vector(1,0));

            if (_hRectangles) {
                for (var i = 0; i < _hRectangles.length; i++) {
                    this._hRectangles.push(new Rectangle(_hRectangles[i]));
                }
            }

            this._vRectangles = [];
            var _vRectangles = a.get_rectangles(new Vector(0,1));

            if (_vRectangles) {
                for (var i = 0; i < _vRectangles.length; i++) {
                    this._vRectangles.push(new Rectangle(_vRectangles[i]));
                }
            }
        }

        else if (a instanceof Array) { // array of points
            this._points = a;
        }

        else if (a instanceof Rectangle) {
            var tl = a.get_topLeft().clone();
            var br = a.get_bottomRight().clone();
            this._points = [];
            this._points.push(tl);
            this._points.push(new Point(br.get_x(), tl.get_y()));
            this._points.push(br);
            this._points.push(new Point(tl.get_x(), br.get_y()));
        }
    }
}

Polygon.prototype = {

    clone:function () {
        return new Polygon(this);
    },

    get_points:function () {
        return this._points;
    },

    get_numberOfPoints:function () {
        return this._points.length;
    },

    _clear:function () {
        delete this._box;
        delete this._area;
        delete this._centroid;
        delete this.edges;
        delete this._vectors;
        delete this._hRectangles;
        delete this._vRectangles;
    },

    addPoint:function (p) {
        this._points.push(p);
        this._clear();
    },

    addPointOnPolygon:function (p) {
        var pts = this._points;
        if (pts.length == 0) {
            this._points.push(p);
        } else {
            for (var j = 0, i = pts.length - 1; j < pts.length; i = j++) {
                var angleFromPrevPoint = pts[i].findAngle(pts[j]);
                var angleFromPoint = p.findAngle(pts[j]);
                if (angleFromPrevPoint == angleFromPoint) {
                    this._points.splice(i + 1, 0, p);
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

    get_box:function () {
        if (!this._box) {
            this._box = new Rectangle();
            var pts = this._points;
            // we need at least 3 points for a non-empty box
            if (pts.length > 2) {
                var box = new Rectangle(pts[0], pts[1]);
                for (var i = 2; i < pts.length; i++) {
                    box.unionPoint(pts[i]);
                }
                this._box.union(box);
            }
        }
        return this._box.clone();
    },

    get_area:function () {
        if (!this._area) {
            var area = 0;
            var pts = this._points;
            if (pts.length > 2) {
                var j = pts.length - 1;
                var p1;
                var p2;
                for (var i = 0; i < pts.length; j = i++) {
                    p1 = pts[i];
                    p2 = pts[j];
                    area += p1.get_x() * p2.get_y();
                    area -= p1.get_y() * p2.get_x();
                }
                this._area = area / 2;
            }
        }
        return this._area;
    },

    get_centroid:function () {
        if (!this._centroid) {
            var x = 0, y = 0, f;
            var p1, p2;
            var pts = this._points;
            var j = pts.length - 1;
            for (var i = 0; i < pts.length; j = i++) {
                p1 = pts[i];
                p2 = pts[j];
                f = p1.get_x() * p2.get_y() - p2.get_x() * p1.get_y();
                x += (p1.get_x() + p2.get_x()) * f;
                y += (p1.get_y() + p2.get_y()) * f;
            }
            f = this.get_area() * 6;
            // centroid relative to self box
            var origin = this.get_box().get_topLeft();
            this._centroid = new Point(Math.round(x / f - origin.get_x()), Math.round(y / f - origin.get_y()));
        }
        return this._centroid.clone();
    },

    get_edges:function () {
        if (!this.edges) {
            var p1, p2, edge;
            this.edges = [];

            for (var i = 0; i < this._points.length; i++) {
                p1 = this._points[i];

                if (i + 1 >= this._points.length) {
                    p2 = this._points[0];
                } else {
                    p2 = this._points[i + 1];
                }

                var p1_x = p1.get_x(), p2_x = p2.get_x();
                var p1_y = p1.get_y(), p2_y = p2.get_y();

                if (p1_x > p2_x) {
                    p1_x = p2.get_x();
                    p2_x = p1.get_x();
                }

                if (p1_y > p2_y) {
                    p1_y = p2.get_y();
                    p2_y = p1.get_y();
                }

                edge = new Edge(p1_x, p1_y, p2_x, p2_y);
                this.edges.push(edge);
            }
        }
        return this.edges;
    },

    get_vectors:function () {
        if (!this._vectors) {
            var p1, p2;
            this._vectors = [];

            for (var i = 0; i < this._points.length; i++) {
                p1 = this._points[i];

                if (i + 1 >= this._points.length) {
                    p2 = this._points[0];
                } else {
                    p2 = this._points[i + 1];
                }

                this._vectors.push(new Vector(p2.get_x() - p1.get_x(), p2.get_y() - p1.get_y()));
            }
        }
        return this._vectors;
    },

    get_dotProduct:function (axis) {
        var result = [];

        for (var i = 0; i < this._points.length; i++) {
            result.push(axis.get_x() * this._points[i].get_x() + axis.get_y() * this._points[i].get_y());
        }
        return result;
    },

    get_rectangles:function (orientation) {
        if (!this._hRectangles) {
            this._hRectangles = [];

            var slices = this._createSlicesWithEdges(orientation);

            for (var i = 0; i < slices.length; i++) {
                var slice = slices[i];
                var edges = slice.getUnmarkedEdges();

                while (edges.length > 0) {
                    for (var edge in edges) {
                        edge = edges[edge];

                        var rec = this._getRectangle(edge, i, slices);

                        if (rec) {
                            this._hRectangles.push(rec);

                            var recEdges = rec.get_edges();

                            for (var recEdge in recEdges) {
                                recEdge = recEdges[recEdge];

                                if (orientation.get_x() && recEdge.get_p1().get_y() == recEdge.get_p2().get_y()) { //if horizontal
                                    for (var j = 0; j < slices.length; j++) {
                                        if (slices[j].get_value() == recEdge.get_p1().get_y()) {
                                            if (!slices[j].findEdge(recEdge)) //edge was not found
                                            {
                                                slices[j].update(recEdge);
                                            }
                                            slices[j].markEdge(recEdge.get_p1(), recEdge.get_p2());
                                            break;
                                        }
                                    }
                                }
                                else if (orientation.get_y() && recEdge.get_p1().get_x() == recEdge.get_p2().get_x()) { //if vertical
                                    for (var j = 0; j < slices.length; j++) {
                                        if (slices[j].get_value() == recEdge.get_p1().get_x()) {
                                            if (!slices[j].findEdge(recEdge)) //edge was not found
                                            {
                                                slices[j].update(recEdge);
                                            }
                                            slices[j].markEdge(recEdge.get_p1(), recEdge.get_p2());
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        else { //rectangle not found for edge
                            for (var j = 0; j < slices.length; j++) {
                                if (orientation.get_x()) { //horizontal
                                    if (slices[j].get_value() == edge.get_p1().get_y()) {
                                        slices[j].markEdge(edge.get_p1(), edge.get_p2());
                                        break;
                                    }
                                }
                                else // vertical
                                {
                                    if (slices[j].get_value() == edge.get_p1().get_x()) {
                                        slices[j].markEdge(edge.get_p1(), edge.get_p2());
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    edges = slice.getUnmarkedEdges();
                }
            }
        }
        return this._hRectangles;
    },

    isPointOn:function (p) {
        var pts = this._points;
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
            if (this.isPointOn(pt))
                r.push(pt);
        }
        return r;
    },

    containsPoint:function (p) {
        var box = this.get_box();

        if (!box.pointIn(p)) {
            return false;
        } else {
            /*
             // http://stackoverflow.com/questions/217578/point-in-polygon-aka-hit-test
             var e = (box.br.get_x() - box.tl.get_x()) / 100; // epsilon
             var rp = new Point(box.tl.get_x() - e/p.get_y());  // ray start point
             var intersections = 0;

             var edges = this.get_edges();
             for (var i=0; i<edges.length; i++) {
             ...
             }
             */
            var pts = this._points;
            var nPts = pts.length;
            var vertX = [];
            var vertY = [];
            for (var i = 0; i < nPts; i++) {
                vertX.push(pts[i].get_x());
                vertY.push(pts[i].get_y());
            }

            var i, j = 0;
            var c = false;
            for (i = 0, j = nPts - 1; i < nPts; j = i++) {
                if (((vertY[i] > p.get_y()) != (vertY[j] > p.get_y())) && (p.get_x() < (vertX[j] - vertX[i]) * (p.get_y() - vertY[i]) / (vertY[j] - vertY[i]) + vertX[i]))
                    c = !c;
            }
            return c;
        }
    },

//creates an array of slices. Each slice contains a list of edges positioned on the slice's axis according to its orientation.
//the orientation should be a vector of the following options: (0,1) - vertical or  (1,0) - horizontal
    _createSlicesWithEdges:function (orientation) {
        var res = [];
        var points = this._points;

        for (var i = 0; i < points.length; i++) {
            var p1_x = points[i].get_x();
            var p1_y = points[i].get_y();
            var p2_x, p2_y;

            if (i == points.length - 1) {
                p2_x = points[0].get_x();
                p2_y = points[0].get_y();
            }
            else {
                p2_x = points[i + 1].get_x();
                p2_y = points[i + 1].get_y();
            }

            if (orientation.get_y()) { //vertical slices

                if (p1_x == p2_x) {
                    var currSlice = null;

                    for (var slice in res) {
                        if (res[slice].get_value() == p1_x) {
                            currSlice = res[slice];
                        }
                    }

                    if (!currSlice) {
                        currSlice = new Slice(new Vector(0, 1), points[i].get_x());

                        for (var j = 0; j < res.length; j++) {
                            if (res[j].get_value() > points[i].get_x())
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
            else if (orientation.get_x()) { //horizontal orientation
                if (p1_y == p2_y) {
                    var currSlice = null;

                    for (var slice in res) {
                        if (res[slice].get_value() == p1_y) {
                            currSlice = res[slice];
                        }
                    }

                    if (!currSlice) {
                        currSlice = new Slice(new Vector(1, 0), points[i].get_y());
                        for (var j = 0; j < res.length; j++) {
                            if (res[j].get_value() > points[i].get_y())
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

        }

        return res;
    },

    _getRectangle:function (edge, sliceIndex, slices) {

        if (slices[sliceIndex].get_orientation().get_x()) { //horizontal
            var left_x = edge.get_p1().get_x();
            var right_x = edge.get_p2().get_x();

            //iterate over all edges on consecutive slices
            for (var i = sliceIndex + 1; i < slices.length; i++) {
                var slice = slices[i];

                //get all edges for this slice
                var edges = slice.getUnmarkedEdges();

                for (var slice_edge in edges) {
                    slice_edge = edges[slice_edge];

                    if (slice_edge.get_p1().get_x() <= left_x && slice_edge.get_p2().get_x() > left_x) {
                        //we found a good candidate for our edge. we can generate the rectangle and return it
                        right_x = slice_edge.get_p2().get_x() < right_x ? slice_edge.get_p2().get_x() : right_x;

                        var pol = new Polygon([
                            new Point(left_x, edge.get_p1().get_y()),
                            new Point(right_x, edge.get_p1().get_y()),
                            new Point(right_x, slice.get_value()),
                            new Point(left_x, slice.get_value())
                        ]);

                        return pol;
                    }
                    else if (slice_edge.get_p1().get_x() > left_x && slice_edge.get_p1().get_x() < right_x) {
                        // if edge is not a goot candidate for the bottom edge of the polygon, but still intersects with the upper edge of the polygon, we should decrease the size of
                        // upper edge and set the right bound to be the left bound of this intersecting edge.
                        right_x = slice_edge.get_p1().get_x();
                    }
                }
            }
        }
        else if (slices[sliceIndex].get_orientation().get_y()) { //vertical
            var top_y = edge.get_p1().get_y();
            var bottom_y = edge.get_p2().get_y();

            //iterate over all edges on consecutive slices
            for (var i = sliceIndex + 1; i < slices.length; i++) {
                var slice = slices[i];

                //get all edges for this slice
                var edges = slice.getUnmarkedEdges();

                for (var slice_edge in edges) {
                    slice_edge = edges[slice_edge];

                    if (slice_edge.get_p1().get_y() <= top_y && slice_edge.get_p2().get_y() > top_y) {
                        //we found a good candidate for our edge. we can generate the rectangle and return it
                        bottom_y = slice_edge.get_p2().get_y() < bottom_y ? slice_edge.get_p2().get_y() : bottom_y;

                        var pol = new Polygon([
                            new Point(edge.get_p1().get_x(), edge.get_p1().get_y()),
                            new Point(slice_edge.get_p1().get_x(), edge.get_p1().get_y()),
                            new Point(slice_edge.get_p2().get_x(), bottom_y),
                            new Point(edge.get_p2().get_x(), bottom_y)
                        ]);

                        return pol;
                    }
                    else if (slice_edge.get_p1().get_y() > top_y && slice_edge.get_p1().get_y() < bottom_y) {
                        // if edge is not a goot candidate, but still intersects with the edge of the polygon, we should decrease the size of
                        // the edge and set its bottom bound to be the top bound of this intersecting edge.
                        bottom_y = slice_edge.get_p1().get_y();
                    }
                }
            }
        }
    },

//splits polygon to two polygons by path
    split:function (path) {
        var polygons = [];
        var pointsToAdd = this.pointsOn(path.get_points());

        if (pointsToAdd.length != 2)
            throw "invalid path";

        this.addPointsOnPolygon(pointsToAdd);

        var poly1 = new Polygon(), poly2 = new Polygon();
        var pts, nPts, iPt, pt, tmp = 1;
        var direction = path.get_direction();

        pts = this._points;
        nPts = pts.length;
        for (iPt = 0; iPt < nPts; iPt++) {
            var pt = pts[iPt].clone();
            var exists = path.containsPoint(pt);

            if (exists) {
                tmp *= -1;

                if (poly2.get_points().length == 0) {
                    if (direction == 'D' || direction == 'L') {
                        for (i = 0; i < path.get_points().length; i++) {
                            poly1.get_points().push(path.get_points()[i].clone());
                            poly2.get_points().unshift(path.get_points()[i].clone());
                        }
                    } else if (direction == 'U' || direction == 'R') {
                        for (i = path.get_points().length - 1; i >= 0; i--) {
                            poly1.get_points().push(path.get_points()[i].clone());
                            poly2.get_points().unshift(path.get_points()[i].clone());
                        }
                    }
                }
            } else {
                if (tmp == 1) poly1.get_points().push(pt);
                else poly2.get_points().push(pt);
            }
        }

        polygons.push(poly1);
        polygons.push(poly2);

        return polygons;
    },

    doesIntersect:function (rectangle) {
        return this.get_box().doesIntersect(rectangle);
    },

    findIntersection:function (rect) {
        var other = new Polygon(rect);
        //polygon.buildEdges();

        var minIntersect = 10000;
        var minIntersectPerpen = null;

        var edges = this.get_vectors();

        for (var edge in edges) {
            var perpen = edges[edge].getPerpendicular();
            perpen.normalize();

            var res1 = this.projectPolygon(perpen);
            var res2 = other.projectPolygon(perpen);

            var intersect = 0;

            if (res1.min == res2.max || res2.min == res1.max)
             {
                intersect = 0;
             }
            if (res1.min < res2.min) {
                intersect = res2.min - res1.max;
            } else {
                intersect = res1.min - res2.max;
            }

            if (intersect > 0) {
                return null;
            }
            else {
                if (Math.abs(intersect) < Math.abs(minIntersect)) {
                    minIntersect = Math.abs(intersect);
                    minIntersectPerpen = perpen;
                }
            }
        }

        return { intersect:minIntersect, minIntersectPerpen:minIntersectPerpen };
    },

//project a polygon on a given axis and return the min and max scalar values on the axis
    projectPolygon:function (axis) {
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

    draw:function (ctx, fillStyle) {
        var pts, nPts, pt;

        ctx.fillStyle = fillStyle;
        ctx.beginPath();

        pts = this._points;
        nPts = pts.length;
        if (nPts > 1) {
            pt = pts[0];
            ctx.moveTo(pt.get_x(), pt.get_y());
            for (var i = 1; i < nPts; i++) {
                pt = pts[i];
                ctx.lineTo(pt.get_x(), pt.get_y());
            }
            ctx.closePath();
        }

        ctx.fill();
    },

    drawPoints:function (ctx, fillStyle) {
        var pts, nPts, pt, radius = 3;

        ctx.fillStyle = fillStyle;
        pts = this._points;
        nPts = pts.length;
        for (var i = 0; i < nPts; i++) {
            pt = pts[i];
            ctx.beginPath();
            ctx.arc(pt.get_x(), pt.get_y(), radius, 0, self.Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    }
};