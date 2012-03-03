/**
 * Created by JetBrains WebStorm.
 * User: yairlevinson
 * Date: 3/2/12
 * Time: 12:49 PM
 * To change this template use File | Settings | File Templates.
 */


function Movable() {
}

Movable.prototype = {

    findCollision: function (polygon) {
        return polygon.findIntersection(this.get_box());
    },

    step: function () {

        var box = this.get_box();

        if (box) {

            var tl = box.get_topLeft();
            var top = tl.get_y();
            var left = tl.get_x();
            var width = box.get_width();
            var height = box.get_height();
            var right = left + width;
            var bottom = top + height;

            var velocity_x_changed = false;
            var velocity_y_changed = false;

            this.offset(this.get_velocity().get_x(), this.get_velocity().get_y());

            if (! this.get_boundary)
                debugger;

            var boundary = this.get_boundary();

            if (boundary) {
                velocity = this.get_velocity();

                //moving left
                if (velocity.get_x() < 0)
                {
                    if (left <= boundary.get_left())
                    {
                        velocity.set_x(velocity.get_x() * -1);
                        velocity_x_changed = true;

                        if (left < boundary.get_left()) {
                            offset = boundary.get_left() - left;
                            this.offset(offset, 0);
                        }
                    }
                }

                //moving right
                else if (velocity.get_x() > 0)
                {
                    if (right >= boundary.get_right())
                    {
                        velocity.set_x(velocity.get_x() * -1);
                        velocity_x_changed = true;

                        if (right > boundary.get_right()) {
                            offset = boundary.get_right() - right;
                            this.offset(offset, 0);
                        }
                    }
                }

                //moving up
                if (velocity.get_y() < 0)
                {
                    if (top <= boundary.get_top())
                    {
                        velocity.set_y(velocity.get_y() * -1);
                        velocity_y_changed = true;

                        if (top < boundary.get_top()) {
                            offset = boundary.get_top() - top;
                            this.offset(0, offset);
                        }
                    }
                }

                //moving down
                else if (velocity.get_y() > 0)
                {
                    if (bottom >= boundary.get_bottom())
                    {
                        velocity.set_y(velocity.get_y() * -1);
                        velocity_y_changed = true;

                        if (bottom > boundary.get_bottom()) {
                            offset = boundary.get_bottom() - bottom;
                            this.offset(0, offset);
                        }
                    }
                }
            }

            if (!velocity_x_changed || !velocity_y_changed) {

                var h_obstacles = [];
                var v_obstacles = [];

                if (! this.get_obstacles)
                    debugger;
                var obstacles = this.get_obstacles();

                for (var polygon in obstacles) {
                    var h_rectangles = obstacles[polygon].get_rectangles(new Vector(1, 0));
                    var v_rectangles = obstacles[polygon].get_rectangles(new Vector(0, 1));

                    for (var i = 0; i < h_rectangles.length; i++) {
                        h_obstacles.push(h_rectangles[i]);
                    }

                    for (i = 0; i < v_rectangles.length; i++) {
                        v_obstacles.push(v_rectangles[i]);
                    }
                }

                var h_obstacle_res = {};

                for (var obstacle in h_obstacles) {
                    collision = this.findCollision(h_obstacles[obstacle]);
                    if (collision) {
                        if (collision.minIntersectPerpen.get_x() == 0 && !velocity_y_changed) { //collision in y axis
                            h_obstacle_res.velocity_y_changed = true;

                            if (collision.intersect > Math.abs(this.get_velocity().get_y())) {
                                velocity = collision.intersect * (Math.abs(this.get_velocity().get_y()) / this.get_velocity().get_y() * -1);
                                h_obstacle_res.velocity_y = velocity;
                            }
                        }
                        else if (!velocity_x_changed) { //collision on x axis
                            h_obstacle_res.velocity_x_changed = true;

                            if (collision.intersect > Math.abs(this.get_velocity().get_x())) {
                                velocity = collision.intersect * (Math.abs(this.get_velocity().get_x()) / this.get_velocity().get_x() * -1);
                                h_obstacle_res.velocity_x = velocity;
                            }
                        }
                    }
                }

                var v_obstacle_res = {};

                for (var obstacle in v_obstacles) {
                    var collision = this.findCollision(v_obstacles[obstacle]);
                    if (collision) {
                        if (collision.minIntersectPerpen.get_x() == 0 && !velocity_y_changed) { // collision on y axis
                            v_obstacle_res.velocity_y_changed = true;

                            if (collision.intersect > Math.abs(this.get_velocity().get_y())) {
                                var velocity = collision.intersect * (Math.abs(this.get_velocity().get_y()) / this.get_velocity().get_y() * -1);
                                v_obstacle_res.velocity_y = velocity;
                            }
                        }
                        else if (!velocity_x_changed) { // collision on x axis
                            v_obstacle_res.velocity_x_changed = true;

                            if (collision.intersect > Math.abs(this.get_velocity().get_x())) {
                                var velocity = collision.intersect * (Math.abs(this.get_velocity().get_x()) / this.get_velocity().get_x() * -1);
                                v_obstacle_res.velocity_x = velocity;
                            }
                        }
                    }
                }

                if (h_obstacle_res.velocity_y_changed && v_obstacle_res.velocity_y_changed) {
                    //console.log("collision on y");
                    velocity = this.get_velocity();
                    velocity.set_y(velocity.get_y() * -1);

                    if (h_obstacle_res.velocity_y) {
                        this.offset(-this.get_velocity().get_x(), h_obstacle_res.velocity_y);
                    }

                }
                if (h_obstacle_res.velocity_x_changed && v_obstacle_res.velocity_x_changed) {
                    //console.log("collision on x");
                    velocity = this.get_velocity();
                    velocity.set_x(velocity.get_x() * -1);

                    if (h_obstacle_res.velocity_x) {
                        this.offset(h_obstacle_res.velocity_x, -this.get_velocity().get_y());
                    }
                }
            }
        }
    }
};
