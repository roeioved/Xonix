/// <reference path="edge.js" />

function Slice(y_coord) {
    this.y = y_coord;
    this.edges = [];
}

Slice.prototype = {
    
    addEdge: function (p1_x, p2_x) {
        var i = 0;
        var edge = new Edge(p1_x, this.y, p2_x, this.y);
        
        while (this.edges[i]) {
            if (p1_x < this.edges[i].p1.x) {
                this.edges.splice(i, 0, edge);
                break;
            }
            i++;
        }
        
        if (i >= this.edges.length) {
            this.edges.push(edge);
        }
    },
    
    removeEdge: function (p1_x, p2_x) {
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].p1.x == p1_x && this.edges[i].p2.x == p2_x) {
                this.edges.splice(i, 1);
            }
        }
    },
    
    markEdge: function (p1_x, p2_x) {
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].p1.x == p1_x && this.edges[i].p2.x == p2_x) {
                this.edges[i].isMarked = true;
            }
        }
    },
    
    getUnmarkedEdges: function () {
        var res = [];
        
        for (var i = 0; i < this.edges.length; i++) {
            if (!this.edges[i].isMarked) {
                res.push(this.edges[i]);
            }
        }
        
        return res;
    },
    
    findEdge: function (edge) {    
        if (edge.p1.y != edge.p2.y || edge.p1.y != this.y)
            return null;
        
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].p1.x == edge.p1.x && this.edges[i].p2.x == edge.p2.x)
                return this.edges[i];
        }
        
        return null;
    },
    
    update: function (edge) {
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].p1.x <= edge.p1.x && this.edges[i].p2.x >= edge.p2.x) {
                //our edge contains the new edge                
                var edges = [];
                
                if (this.edges[i].p1.x < edge.p1.x) {
                    edges.push(new Edge(this.edges[i].p1.x, this.y, edge.p1.x, this.y));
                }
                
                if (edge.p2.x <= this.edges[i].p2.x) {
                    edges.push(new Edge(edge.p1.x, this.y, edge.p2.x, this.y));
                }
                
                if (edge.p2.x < this.edges[i].p2.x) {
                    edges.push(new Edge(edge.p2.x, this.y, this.edges[i].p2.x, this.y));
                }
                
                if (edges.length > 0)
                {
                    this.removeEdge(this.edges[i].p1.x, this.edges[i].p2.x);
                    
                    for (var i = 0; i < edges.length; i++) {
                        this.addEdge(edges[i].p1.x, edges[i].p2.x);
                    }
                    
                    break;
                }
            }
        }
    }
    
}