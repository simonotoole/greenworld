/** A class representing an autonomous agent in the simulation. */
class Agent {
    /**
     * Create an Agent.
     * @public
     * @param {number} simulatorSize The size of the simulator, used to determine the size of an Agent.
     */
    constructor(simulatorSize, location = createVector(Math.random() * width, Math.random() * height)) {
        /** @private {p5.Vector} */
        this.location_ = location;
        /** @private {p5.Vector} */
        this.velocity_ = createVector(0, 0);
        /** @private {p5.Vector} */
        this.acceleration_ = createVector(0, 0);
        /** @private {number} */
        this.size_ = (width / simulatorSize > 10) ? width / simulatorSize : 10;
        /** @private {number} */
        this.maxSpeed_ = 5;
        /** @private {number} The number of frames this Agent will live for. */
        this.health_ = randomGaussian(1800, 600);
        /** @private {p5.Color} */
        this.color_ = color(33, 237, 237);
        /** @private {boolean} Use this property to visualise agent collision. */
        this.highlight_ = false;
    }

    /**
     * Get this Agent's location.
     * @public
     * @returns {p5.Vector} The Agent's location.
     */
    getLocation() {
        return this.location_;
    }

    /**
     * Get this Agent's size.
     * @public
     * @returns {number} The Agent's size.
     */
    getSize() {
        return this.size_;
    }

    /**
     * Determine if this Agent's health is 0.
     * @public
     * @returns {boolean} A value representing whether or not this Agent is dead.
     */
    isDead() {
        return this.health_ <= 0;
    }

    /**
     * Move and display this Agent, and decrement its health.
     * @public
     */
    run() {
        this.update_();
        this.checkEdges_();
        this.display_();
        // An agent loses one health point per second.
        this.health_ -= 1;
    }

    /**
     * Steer this Agent away from nearby Agents.
     * @public
     * @param {Agent[]} agents An array of Agents.
     */
    separate(agents) {
        const separationForce = 0.02;    // Limit how much separation affects steer.
        const collisions = this.getCollisions_(agents);
        let steer = this.calculateSeparationSteer_(collisions);
        steer.limit(separationForce);

        this.applyForce_(steer);
    }

    /**
     * Seek out the nearest Edible item.
     * @public
     * @param {Edible[]} edibles An array of Edible objects.
     */
    seek(edibles) {
        const seekForce = 0.01;    // Limit how much seeking affects steer.
        const desiredLocation = this.findNearest_(edibles);
        let steer = this.steer_(desiredLocation);
        steer.limit(seekForce);

        this.applyForce_(steer);
    }

    /**
     * Determine if this Agent is in a location to eat an Edible item; if it
     * is, remove that Edible item from the simulation.
     * @public
     * @param {Edible[]} edibles An array of Edible objects.
     */
    eat(edibles) {
        edibles.forEach((e) => {
            let distance = p5.Vector.dist(this.location_, e.getLocation());

            // Collision detection: if this Agent and the Food object are intersecting, remove the Food object.
            if (distance < this.size_ / 2 + e.getSize() / 2) {
                this.health_ += e.getReward();
                e.remove(edibles);
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
            fill(161, 22, 124);
        } else {
            fill(this.color_);
        }

        noStroke();
        ellipseMode(CENTER);
        ellipse(this.location_.x, this.location_.y, this.size_, this.size_);
    }

    /**
     * Get all other Agents that this Agent is in collision with.
     * @param {Agent[]} agents An array of Agents.
     * @returns {Agent[]} An array of Agents that this Agent is in collision with.
     */
    getCollisions_(agents) {
        this.highlight_ = false;
        const separation = this.size_;
        let collisions = [];

        agents.forEach((other) => {
            const distance = p5.Vector.dist(this.location_, other.getLocation());

            if (this !== other && distance < separation) {
                this.highlight_ = true;
                collisions.push(other);
            }
        });

        return collisions;
    }

    /**
     * Calculate a steer force away from all other Agents that this Agent is in
     * collision with.
     * @param {Agent[]} agents An array of Agents.
     * @returns {p5.Vector} The steer force.
     */
    calculateSeparationSteer_(agents) {
        let steer = createVector(0, 0);

        if (agents.length === 0) {
            return steer;
        }

        agents.forEach((other) => {
            const distance = p5.Vector.dist(this.location_, other.getLocation());

            // Get a vector pointing away from other and weight its magnitude
            // by the distance, then add it to the steer vector.
            let direction = p5.Vector.sub(this.location_, other.getLocation());
            direction.div(distance);
            steer.add(direction);

            // Get the average steer force away from all other agents.
            steer.div(agents.length);
            steer.sub(this.velocity_);
        });

        return steer;
    }

    /**
     * Find the location of the nearest Edible item to this Agent.
     * @private
     * @param {Edible[]} edibles An array of Edible objects.
     * @returns {p5.Vector} The location of the nearest Edible item.
     */
    findNearest_(edibles) {
        let nearest = createVector(0, 0);
        let distance = Number.MAX_SAFE_INTEGER;    // Set the nearest distance to a large value that will never be exceeded.

        // Find which Food item is the nearest to this Agent.
        edibles.forEach((e) => {
            if (p5.Vector.dist(this.location_, e.getLocation()) < distance) {
                nearest = e.getLocation();
                distance = p5.Vector.dist(this.location_, e.getLocation());
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
        let direction = p5.Vector.sub(desiredLocation, this.location_);
        direction.normalize();
        let speed = this.maxSpeed_;

        // Arriving behaviour: if distance is less than 100, then the Agent will start to slow down.
        if (distance < this.size_ * 4) {
            // The closer the Agent is to the desired location, the slower it will move.
            speed = map(distance, 0, 100, 0, this.maxSpeed_);
        }

        const desiredVelocity = direction.mult(speed);
        const steer = p5.Vector.sub(desiredVelocity, this.velocity_);

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
