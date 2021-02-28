/** Class representing an autonomous agent in the simulation. */
class Agent {
    /**
     * Create an Agent.
     * @param {number} simulatorSize The size of the simulator, used to determine the size of an Agent.
     */
    constructor(simulatorSize) {
        /** @private {p5.Vector} */
        this.location_ = createVector(Math.random() * width, Math.random() * height);
        /** @private {p5.Vector} */
        this.velocity_ = createVector(0, 0);
        /** @private {p5.Vector} */
        this.acceleration_ = createVector(0, 0);
        /** @private {number} */
        this.size_ = (width / simulatorSize > 10) ? width / simulatorSize : 10;
        /** @private {number} */
        this.maxSpeed_ = 5;
        /** @private {number} */
        this.maxForce_ = 0.01;
        /** @private {number} */
        this.health_ = randomGaussian(30, 10);
        /** @private {p5.Color} */
        this.color_ = color(63, 63, 255);
        /** @private {boolean} Use this property to visualise agent collision. */
        this.highlight_ = false;
    }

    /**
     * Get this Agent's location.
     * @returns {p5.Vector} The Agent's location.
     */
    getLocation() {
        return this.location_;
    }

    /**
     * Get this Agent's size.
     * @returns {number} The Agent's size.
     */
    getSize() {
        return this.size_;
    }

    /**
     * Determine if this Agent's health is 0.
     * @returns {boolean} A value representing whether or not this Agent is dead.
     */
    isDead() {
        return this.health_ <= 0;
    }

    /**
     * Move and display this Agent, and decrement its health.
     */
    run() {
        this.update_();
        this.checkEdges_();
        this.display_();
        // An agent loses one health point per second.
        this.health_ -= 1 / frameRate();
    }

    /**
     * Steer this Agent away from nearby Agents.
     * @param {Agent[]} agents An array of Agents.
     */
    separate(agents) {
        const separation = this.size_;
        const separationLimit = 0.05;    // Limit how much separation affects steer.
        let steer = createVector(0, 0);
        let count = 0;    // Keep a count of how many Agents this Agent is in contact with.
        this.highlight_ = false;

        // Check every other Agent to determine if this Agent is in contact with it.
        agents.forEach((other) => {
            const distance = p5.Vector.dist(this.location_, other.getLocation());

            // If this Agent has collided with another, calculate the direction to steer towards.
            if (distance > 0 && distance < separation) {
                this.highlight_ = true;
                let direction = p5.Vector.sub(this.location_, other.getLocation())
                direction.normalize();
                direction.div(distance);
                steer.add(direction);
                count++;
            }
        });

        // Calculate an average steer force away from all Agents that this Agent is in contact with.
        if (count > 0) {
            steer.div(count);
            steer.normalize();
            steer.mult(this.maxSpeed_);
            steer.sub(this.velocity_);
            steer.limit(separationLimit);
        }

        this.applyForce_(steer);
    }

    /**
     * Steer this Agent toward the nearest Food item.
     * @param {Food[]} food An array of Food objects.
     */
    seek(food) {
        const nearestFoodLocation = this.findNearest_(food);
        const steer = this.steer_(nearestFoodLocation);
        this.applyForce_(steer);
    }

    /**
     * Determine if this Agent is in a location to eat food; if it is, remove
     * that Food item from the simulation.
     * @param {Food[]} food An array of Food objects.
     */
    eat(food) {
        food.forEach((f) => {
            let distance = p5.Vector.dist(this.location_, f.getLocation());

            // Collision detection: if this Agent and the Food object are intersecting, remove the Food object.
            if (distance < this.size_ / 2 + f.getSize() / 2) {
                f.remove(food);
                this.health_ += 1;
            }
        });
    }

    /**
     * Calculate this Agent's velocity and location.
     * @private
     */
    update_() {
        this.velocity_.add(this.acceleration_);
        this.velocity_.limit(this.maxSpeed_);
        this.location_.add(this.velocity_);
        this.acceleration_.mult(0);
    }

    /**
     * Perform canvas wraparound for this Agent.
     * @private
     */
    checkEdges_() {
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
     * @private
     */
    display_() {
        if (this.highlight_ === true) {
            fill(255, 63, 255);
        } else {
            fill(this.color_);
        }

        noStroke();
        ellipseMode(CENTER);
        ellipse(this.location_.x, this.location_.y, this.size_, this.size_);
    }

    /**
     * Find the location of the nearest Food item to this Agent.
     * @private
     * @param {Food[]} food An array of Food objects.
     * @returns {p5.Vector} The location of the nearest Food item.
     */
    findNearest_(food) {
        let nearest = createVector(0, 0);
        let distance = Number.MAX_SAFE_INTEGER;    // Set the nearest distance to a large value that will never be exceeded.

        // Find which Food item is the nearest to this Agent.
        food.forEach((f) => {
            if (p5.Vector.dist(this.location_, f.getLocation()) < distance) {
                nearest = f.getLocation();
                distance = p5.Vector.dist(this.location_, f.getLocation());
            }
        });

        return nearest;
    }

    /**
     * Calculate a steer force to direct this Agent toward the desired location.
     * @private
     * @param {p5.Vector} desiredLocation The location to steer towards.
     * @returns {p5.Vector} The steer force.
     */
    steer_(desiredLocation) {
        const distance = p5.Vector.dist(this.location_, desiredLocation);
        const direction = p5.Vector.sub(desiredLocation, this.location_).normalize();
        let speed = this.maxSpeed_;

        // Arriving behaviour: if distance is less than 100, then the Agent will start to slow down.
        if (distance < this.size_ * 4) {
            // The closer the Agent is to the desired location, the slower it will move.
            speed = map(distance, 0, 100, 0, this.maxSpeed_);
        }

        const desiredVelocity = direction.mult(speed);
        let steer = p5.Vector.sub(desiredVelocity, this.velocity_);
        steer.limit(this.maxForce_);

        return steer;
    }

    /**
     * Apply a force to this Agent's acceleration.
     * @private
     * @param {p5.Vector} force
     */
    applyForce_(force) {
        this.acceleration_.add(force);
    }
}
