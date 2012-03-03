/// <reference path="edge.js" />


function Slice(orientation, value) {
    this._orientation = orientation;
    this._value = value;
    this._edges = [];
}

Slice.prototype = {

    addEdge:function (p1, p2) {
        var i = 0;
        var edge = new Edge(p1, p2);

        while (this._edges[i]) {
            if (this._orientation.get_y()) // horizontal
            {
                if (p1.get_x() < this._edges[i].get_p1().get_x()) {
                    this._edges.splice(i, 0, edge);
                    break;
                }
            }
            else //vertical
            {
                if (p1.get_y() < this._edges[i].get_p1().get_y()) {
                    this._edges.splice(i, 0, edge);
                    break;
                }
            }
            i++;
        }

        if (i >= this._edges.length) {
            this._edges.push(edge);
        }
    },

    removeEdge:function (p1, p2) {
        for (var i = 0; i < this._edges.length; i++) {

            if (this._edges[i].get_p1().get_x() == p1.get_x() && this._edges[i].get_p1().get_y() == p1.get_y() && this._edges[i].get_p2().get_x() == p2.get_x() && this._edges[i].get_p2().get_y() == p2.get_y()) {
                this._edges.splice(i, 1);
            }

        }
    },

    markEdge:function (p1, p2) {
        for (var i = 0; i < this._edges.length; i++) {
            if (this._edges[i].get_p1().get_x() == p1.get_x() && this._edges[i].get_p1().y == p1.y && this._edges[i].get_p2().get_x() == p2.get_x() && this._edges[i].get_p2().y == p2.y) {
                this._edges[i].isMarked = true;
            }
        }
    },

    getUnmarkedEdges:function () {
        var res = [];

        for (var i = 0; i < this._edges.length; i++) {
            if (!this._edges[i].isMarked) {
                res.push(this._edges[i]);
            }
        }

        return res;
    },

    findEdge:function (edge) {
        for (var i = 0; i < this._edges.length; i++) {
            if (this._edges[i].get_p1().get_x() == edge.get_p1().get_x() && this._edges[i].get_p1().y == edge.get_p1().y && this._edges[i].get_p2().get_x() == edge.get_p2().get_x() && this._edges[i].get_p2().y == edge.get_p2().y) {
                return this._edges[i];
            }
        }

        return null;
    },

    update:function (edge) {
        for (var i = 0; i < this._edges.length; i++) {
            if (this._orientation.get_x()) { //horizontal
                if (this._edges[i].get_p1().get_x() <= edge.get_p1().get_x() && this._edges[i].get_p2().get_x() >= edge.get_p2().get_x()) {
                    //our edge contains the new edge
                    var edges = [];

                    if (this._edges[i].get_p1().get_x() < edge.get_p1().get_x()) {
                        edges.push(new Edge(this._edges[i].get_p1().get_x(), this._value, edge.get_p1().get_x(), this._value));
                    }

                    if (edge.get_p2().get_x() <= this._edges[i].get_p2().get_x()) {
                        edges.push(new Edge(edge.get_p1().get_x(), this._value, edge.get_p2().get_x(), this._value));
                    }

                    if (edge.get_p2().get_x() < this._edges[i].get_p2().get_x()) {
                        edges.push(new Edge(edge.get_p2().get_x(), this._value, this._edges[i].get_p2().get_x(), this._value));
                    }

                    if (edges.length > 0) {
                        this.removeEdge(this._edges[i].get_p1(), this._edges[i].get_p2());

                        for (var j = 0; j < edges.length; j++) {
                            this.addEdge(edges[j].get_p1(), edges[j].get_p2());
                        }

                        break;
                    }
                }
            }
            else if (this._orientation.y) { //vertical
                if (this._edges[i].get_p1().y <= edge.get_p1().y && this._edges[i].get_p2().y >= edge.get_p2().y) {
                    //our edge contains the new edge
                    var edges = [];

                    if (this._edges[i].get_p1().y < edge.get_p1().y) {
                        edges.push(new Edge(this._value, this._edges[i].get_p1().y, this._value, edge.get_p1().y));
                    }

                    if (edge.get_p2().y <= this._edges[i].get_p2().y) {
                        edges.push(new Edge(this._value, edge.get_p1().y, this._value, edge.get_p2().y));
                    }

                    if (edge.get_p2().y < this._edges[i].get_p2().y) {
                        edges.push(new Edge(this._value, edge.get_p2().y, this._value, this._edges[i].get_p2().y));
                    }

                    if (edges.length > 0) {
                        this.removeEdge(this._edges[i].get_p1(), this._edges[i].get_p2());

                        for (var j = 0; j < edges.length; j++) {
                            this.addEdge(edges[j].get_p1(), edges[j].get_p2());
                        }

                        break;
                    }
                }
            }
        }
    },

    get_value: function() {
        return this._value;
    },

    get_orientation: function() {
        return this._orientation;
    }
};