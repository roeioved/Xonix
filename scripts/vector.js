function Vector(x,  y) {
    this.x = x;
    this.y = y;
}

Vector.prototype = {
    
    getMagnitude: function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    },
    
    normalize: function() {
        var mag = this.getMagnitude();
        this.x = this.x/mag;
        this.y = this.y/mag;
    },
    
    getDotProduct: function(vector) {
        return new Vector(this.x * vector.x, this.y * vector.y);
    },
    
    rotate: function(angle) {
        this.x = Math.cos(this.x) - Math.sin(this.y);
        this.y = Math.sin(this.x) + Math.cos(this.y);
    },
    
    getPerpendicular: function() {
        return new Vector(-this.y, this.x);
    }
    
}