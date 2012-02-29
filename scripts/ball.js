function Ball(ctx, x, y, radius, color, velocity, boundaries, obstacles) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.boundaries = boundaries;
    this.obstacles = obstacles;

    this.update = function () {
        if (boundaries) {
            //top boundry
            if (this.y - radius <= boundaries.top) {
                this.velocity.y *= -1;
            }
            //right boudry
            if (this.x + radius >= boundaries.right) {
                this.velocity.x *= -1;
            }
            //bottom boudry
            if (this.y + radius >= boundaries.bottom) {
                this.velocity.y *= -1;
            }
            //left boudry
            if (this.x - radius <= boundaries.left) {
                this.velocity.x *= -1;
            }
        }
        
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        if (boundaries) {
            this.x = this.x - radius < boundaries.left ? boundaries.left + radius : this.x;
            this.x = this.x + radius > boundaries.right ? boundaries.right - radius : this.x;
            this.y = this.y - radius < boundaries.top ? boundaries.top + radius : this.y;
            this.y = this.y + radius > boundaries.bottom ? boundaries.bottom - radius : this.y;
        }
    };
    
    this.draw = function () {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
    };
    
    this.getBoundingRect = function () {
        var boundary = new Polygon([
            new Point(this.x -this.radius, this.y -this.radius),
            new Point(this.x + this.radius, this.y -this.radius),
            new Point(this.x + this.radius, this.y + this.radius),
            new Point(this.x -this.radius, this.y + this.radius)
        ]);
        
        return boundary;
    };
    
    this.get_center = function() {
        return new Point(this.x, this.y);
    };
}