/**
 * Created by JetBrains WebStorm.
 * User: yairlevinson
 * Date: 3/2/12
 * Time: 12:49 PM
 * To change this template use File | Settings | File Templates.
 */


function Movable(velocity, boundary, obstacles) {
    this._velocity = velocity;
    this._boundary = boundary;
    this._obstacles = obstacles;
}

Movable.prototype = {

    //Find the collision axises and amount (e.g. {x: 2, y: 3}) between a movable and a polygon.
    //The assumption is that the movable underlying object is a simple shape (i.e. rectangle or circle) that can be
    // bounded by a rectangle. The bounding rectangle is returned by calling the get_box method.
    findCollision:function (target) {
        var src_rec = this.get_box();

        //get horizontal rectangles composing the target polygon
        var target_h_recs = target.get_rectangles(new Vector(1, 0));

        //collision velocity on x axis
        var collision_h_x_vel = null;

        //collision velocity on y axis
        var collision_h_y_vel = null;

        var res = null;

        for (var target_rec in target_h_recs) {
            //if velocity only on x - {x: -5}
            //if velocity only on y - {x: -2}
            //if velocity on both x & y - example result - {x:-2, y:-8}

            //find if there're any collision. if there's a collision it will return the vectros (direction & magnitude) of
            //the collsion.

            target_rec = target_h_recs[target_rec];

            //detect collision with rectangle
            var coll_vel = this._detectCollisionVelocity(src_rec, target_rec, this._velocity);

            //update global values of horizontal and vertical collision values
            if (coll_vel && coll_vel.x && !collision_h_x_vel) {
                collision_h_x_vel = coll_vel.x;
            }
            if (coll_vel && coll_vel.y && !collision_h_y_vel) {
                collision_h_y_vel = coll_vel.y;
            }
        }

        //If there were no collisions detected on the horizontal slices then there's no need to check the vertical slices.
        if (collision_h_x_vel || collision_h_y_vel) {
            //generate vertical rectangles
            var target_v_recs = target.get_rectangles(new Vector(0, 1));

            var collision_v_x_vel = null;
            var collision_v_y_vel = null;

            for (var target_rec in target_v_recs) {

                //if velocity only on x - {x: -5}
                //if velocity only on y - {x: -2}
                //if velocity on both x & y - example result - {x:-2, y:-8}

                target_rec = target_v_recs[target_rec];

                var coll_vel = this._detectCollisionVelocity(src_rec, target_rec, this._velocity);

                if (coll_vel && coll_vel.x && !collision_v_x_vel) {
                    collision_v_x_vel = coll_vel.x;
                }
                if (coll_vel && coll_vel.y && !collision_v_y_vel) {
                    collision_v_y_vel = coll_vel.y;
                }
            }

            //now we'll look for the corresponding collisions
            if (collision_h_x_vel && collision_v_x_vel && (collision_h_x_vel == collision_v_x_vel)) {
                res.x = collision_v_x_vel;
            }
            if (collision_h_y_vel && collision_v_y_vel && (collision_h_y_vel == collision_v_y_vel)) {
                res.y = collision_v_y_vel;
            }

        }

        return res;

    },

    get_velocity:function () {
        return this._velocity;
    },

    set_velocity:function (value) {
        this._velocity = value;
    },

    get_boundary:function () {
        return this._boundary;
    },

    set_boundary:function (value) {
        this._boundary = value;
    },

    get_obstacles:function () {
        return this._obstacles;
    },

    set_obstacles:function (obstacles) {
        this._obstacles = obstacles;
    },

    step:function () {

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

            if (!this.get_boundary)
                debugger;

            var boundary = this.get_boundary();

            if (boundary) {
                velocity = this.get_velocity();

                //moving left
                if (velocity.get_x() < 0) {
                    if (left <= boundary.get_left()) {
                        velocity.set_x(velocity.get_x() * -1);
                        velocity_x_changed = true;

                        if (left < boundary.get_left()) {
                            offset = boundary.get_left() - left;
                            this.offset(offset, 0);
                        }
                    }
                }

                //moving right
                else if (velocity.get_x() > 0) {
                    if (right >= boundary.get_right()) {
                        velocity.set_x(velocity.get_x() * -1);
                        velocity_x_changed = true;

                        if (right > boundary.get_right()) {
                            offset = boundary.get_right() - right;
                            this.offset(offset, 0);
                        }
                    }
                }

                //moving up
                if (velocity.get_y() < 0) {
                    if (top <= boundary.get_top()) {
                        velocity.set_y(velocity.get_y() * -1);
                        velocity_y_changed = true;

                        if (top < boundary.get_top()) {
                            offset = boundary.get_top() - top;
                            this.offset(0, offset);
                        }
                    }
                }

                //moving down
                else if (velocity.get_y() > 0) {
                    if (bottom >= boundary.get_bottom()) {
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

               var obstacles = this.get_obstacles();

               for (var obstacle in obstacles) {
                    obstacle = obstacles[obstacle];
                    var collision = this.findCollision(obstacle);

                   if (collision)
                   {
                       if (! velocity_x_changed && collision.x != undefined)
                       {
                           velocity.set_x(velocity.get_x() * -1);

                           //moving right
                           if (velocity.get_x() > 0) {
                               this.offset(-collision.x, 0);
                           }
                           else if (velocity.get_x() < 0) { //moving left
                               this.offset(collision.x, 0);
                           }
                       }
                       else if (! velocity_y_changed && collision.y != undefined)
                       {
                           velocity.set_y(velocity.get_y() * -1);

                           //moving down
                           if (velocity.get_y() > 0) {
                               this.offset(0, -collision.y);
                           }
                           else if (velocity.get_y() < 0) { //moving up
                               this.offset(0, collision.y);
                           }
                       }
                   }
               }
               /* var h_obstacles = [];
                var v_obstacles = [];

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
                }*/
            }

        }
    },

    //Detect the collision axises as well as the velocity of collision between 2 rectangles.
    //The assumption is that only one of the rectangles is moving and that the other is static.
    _detectCollisionVelocity: function(sourceRec, targetRec, velocity) {

        //project on x axis
        var sourceProj = sourceRec.project(new Vector(1,0));
        var targetProj = targetRec.project(new Vector(1,0));

        var d1 = (sourceProj.min - targetProj.max);
        var d2 = (targetProj.min - sourceProj.max);

        if (d1 > 0 || d2 > 0)
            return null;

        // the real intersect is the minimum between the absolute values of d1 and d2.
        var intersect_x = d1 > d2 ? d1 : d2;

        //project on y axis
        sourceProj = sourceRec.project(new Vector(0,1));
        targetProj = targetRec.project(new Vector(0,1));

        d1 = (sourceProj.min - targetProj.max);
        d2 = (targetProj.min - sourceProj.max);

        if (d1 > 0 || d2 > 0)
            return null;

        // the real intersect is the minimum between the absolute values of d1 and d2.
        var intersect_y = d1 > d2 ? d1 : d2;

        // if the intersect is 0 (just collided) in just one of the axises (x or y), then we know that
        // the collision is on that axis
        if (!(intersect_x && intersect_y) && intersect_x != intersect_y)
        {
            if (intersect_x == 0)
            {
                return {x: 0};
            }
            else
            {
                return {y: 0};
            }
        }

        var res_x = intersect_x * Math.abs(velocity.y);
        var res_y = intersect_y * Math.abs(velocity.x);

        if (res_x == res_y)
        {
            return {x:res_x, y: res_y};
        }
        else
        {
            return res_x > res_y ? { x:res_x } : { y: res_y }
        }
    }
};
