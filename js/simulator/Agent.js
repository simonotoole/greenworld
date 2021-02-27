// @ts-nocheck
/** Class representing an autonomous agent in the simulation. */
class Agent {
    /**
     * Create an Agent.
     */
    constructor() {
        /** @private {p5.Vector} */
        this.location_ = createVector(Math.random() * width, Math.random() * height);
        /** @private {p5.Vector} */
        this.velocity_ = createVector(0, 0);
        /** @private {p5.Vector} */
        this.acceleration_ = createVector(0, 0);
        /** @private {number} */
        this.radius_ = 24;
        /** @private {number} */
        this.maxSpeed_ = 12;
        /** @private {number} */
        this.maxForce_ = 0.1;
        /** @private {p5.Color} */
        this.col_ = color(63, 63, 255);
    }

    /**
     * Get this Agent's location.
     * @returns {p5.Vector} The Agent's location.
     */
    getLocation() {
        return this.location_;
    }

    /**
     * Get this Agent's radius.
     * @returns {number} The Agent's radius.
     */
    getRadius() {
        return this.radius_;
    }

    /**
     * Move and display this Agent.
     */
    run() {
        this.update();
        this.checkEdges();
        this.display();
    }

    /**
     * Calculate this Agent's velocity and location.
     */
    update() {
        this.velocity_.add(this.acceleration_);
        this.velocity_.limit(this.maxSpeed_);
        this.location_.add(this.velocity_);
        this.acceleration_.mult(0);
    }

    /**
     * Perform canvas wraparound for this Agent.
     */
    checkEdges() {
        if (this.location_.x < 0) {
            this.location_.x = width;
        } else if (this.location_.x > width) {
            this.location_.x = 0;
        }

        if (this.location_.y < 0) {
            this.location_.y = height;
        } else if (this.location_.y > height) {
            this.location_.y = 0;
        }
    }

    /**
     * Display this Agent to the p5 canvas.
     */
    display() {
        fill(this.col_);
        noStroke();
        ellipseMode(CENTER);
        ellipse(this.location_.x, this.location_.y, this.radius_, this.radius_);
    }

    /**
     * Steer this Agent toward the nearest Food item.
     * @param {Food[]} food An array of Food objects.
     */
    seek(food) {
        let nearestFoodLocation = createVector();
        let distance = 100000;    // Set the nearest distance to a large value that will never be exceeded.

        // Find which Food item is the nearest to this Agent.
        food.forEach((f) => {
            if (this.location_.dist(f.getLocation()) < distance) {
                nearestFoodLocation = f.getLocation();
                distance = p5.Vector.dist(this.location_, f.getLocation());
            }
        });

        // Calculate a steer force to direct this Agent toward the nearest Food item.
        let direction = p5.Vector.sub(nearestFoodLocation, this.location_).normalize();
        let speed = this.maxSpeed_;

        // Arriving behaviour: if distance is less than 100, then the Agent will start to slow down.
        if (distance < 100) {
            // The closer the Agent is to the desired Food item, the slower it will move.
            speed = map(distance, 0, 100, 0, this.maxSpeed_);
        }

        let desiredVelocity = direction.mult(speed);
        let steer = p5.Vector.sub(desiredVelocity, this.velocity_);
        steer.limit(this.maxForce_);

        this.applyForce(steer);
    }

    /**
     * Add a force vector to this Agent's acceleration vector.
     * @param {p5.Vector} force
     */
    applyForce(force) {
        this.acceleration_.add(force);
    }
}
