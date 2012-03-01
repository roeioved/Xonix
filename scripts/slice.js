/// <reference path="edge.js" />


function Slice(orientation, value) {
    this.orientation = orientation;
    this.value = value;
    this.edges = [];
}

Slice.prototype = {

    addEdge:function (p1, p2) {
        var i = 0;
        var edge = new Edge(p1, p2);

        while (this.edges[i]) {
            if (this.orientation.y) // horizontal
            {
                if (p1.x < this.edges[i].p1.x) {
                    this.edges.splice(i, 0, edge);
                    break;
                }
            }
            else //vertical
            {
                if (p1.y < this.edges[i].p1.y) {
                    this.edges.splice(i, 0, edge);
                    break;
                }
            }
            i++;
        }

        if (i >= this.edges.length) {
            this.edges.push(edge);
        }
    },

    removeEdge:function (p1, p2) {
        for (var i = 0; i < this.edges.length; i++) {

            if (this.edges[i].p1.x == p1.x && this.edges[i].p1.y == p1.y && this.edges[i].p2.x == p2.x && this.edges[i].p2.y == p2.y) {
                this.edges.splice(i, 1);
            }

        }
    },

    markEdge:function (p1, p2) {
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].p1.x == p1.x && this.edges[i].p1.y == p1.y && this.edges[i].p2.x == p2.x && this.edges[i].p2.y == p2.y) {
                this.edges[i].isMarked = true;
            }
        }
    },

    getUnmarkedEdges:function () {
        var res = [];

        for (var i = 0; i < this.edges.length; i++) {
            if (!this.edges[i].isMarked) {
                res.push(this.edges[i]);
            }
        }

        return res;
    },

    findEdge:function (edge) {
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].p1.x == edge.p1.x && this.edges[i].p1.y == edge.p1.y && this.edges[i].p2.x == edge.p2.x && this.edges[i].p2.y == edge.p2.y) {
                return this.edges[i];
            }
        }

        return null;
    },

    update:function (edge) {
        for (var i = 0; i < this.edges.length; i++) {
            if (this.orientation.y) { //horizontal
                if (this.edges[i].p1.x <= edge.p1.x && this.edges[i].p2.x >= edge.p2.x) {
                    //our edge contains the new edge
                    var edges = [];

                    if (this.edges[i].p1.x < edge.p1.x) {
                        edges.push(new Edge(this.edges[i].p1.x, this.value, edge.p1.x, this.value));
                    }

                    if (edge.p2.x <= this.edges[i].p2.x) {
                        edges.push(new Edge(edge.p1.x, this.value, edge.p2.x, this.value));
                    }

                    if (edge.p2.x < this.edges[i].p2.x) {
                        edges.push(new Edge(edge.p2.x, this.value, this.edges[i].p2.x, this.value));
                    }

                    if (edges.length > 0) {
                        this.removeEdge(this.edges[i].p1, this.edges[i].p2);

                        for (var j = 0; j < edges.length; j++) {
                            this.addEdge(edges[j].p1, edges[j].p2);
                        }

                        break;
                    }
                }
            }
            else if (this.orientation.x) { //vertical
                if (this.edges[i].p1.y <= edge.p1.y && this.edges[i].p2.y >= edge.p2.y) {
                    //our edge contains the new edge
                    var edges = [];

                    if (this.edges[i].p1.y < edge.p1.y) {
                        edges.push(new Edge(this.value, this.edges[i].p1.y, this.value, edge.p1.y));
                    }

                    if (edge.p2.y <= this.edges[i].p2.y) {
                        edges.push(new Edge(this.value, edge.p1.y, this.value, edge.p2.y));
                    }

                    if (edge.p2.y < this.edges[i].p2.y) {
                        edges.push(new Edge(this.value, edge.p2.y, this.value, this.edges[i].p2.y));
                    }

                    if (edges.length > 0) {
                        this.removeEdge(this.edges[i].p1, this.edges[i].p2);

                        for (var j = 0; j < edges.length; j++) {
                            this.addEdge(edges[j].p1, edges[j].p2);
                        }

                        break;
                    }
                }
            }
        }
    }
};