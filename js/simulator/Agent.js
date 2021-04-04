/** A class representing an autonomous agent in the simulation. */
class Agent extends Edible {
    /**
     * Create an Agent.
     * @public
     * @param {object} [params] Parameters defining an Agent's location and genotype.
     * @param {p5.Vector} [params.location] The location of this Agent.
     * @param {Genotype} [params.genotype] This Agent's genotype.
     */
    constructor({ location = createVector(Math.random() * width, Math.random() * height), genotype = null } = {}) {
        super(location);
        /** @private {Genotype} */
        this.genotype_ = this.setGenotype_(genotype);
        /** @private {number} */
        this.size_ = map(this.genotype_.getGene(0), 0, 1, 5, 50);
        /** @private {number} maxSpeed is inversely proportional to size. */
        this.maxSpeed_ = map(this.genotype_.getGene(0), 0, 1, 10, 1);
        /** @private {number} The number of frames this Agent will live for; correlates with size. */
        this.health_ = map(this.genotype_.getGene(0), 0, 1, 1200, 2400);
        /** @private {number} Limit how much food seeking affects steer. */
        this.foodAttraction_ = map(this.genotype_.getGene(1), 0, 1, 0, 0.1);
        /** @private {number} Limit how much agent seeking affects steer. */
        this.agentAttraction_ = map(this.genotype_.getGene(2), 0, 1, 0, 0.1);
        /** @private {number} Limit how much poison seeking affects steer. */
        this.poisonAttraction_ = map(this.genotype_.getGene(3), 0, 1, 0, 0.1);
        /** @private {number} */
        this.predationPotential_ = map(this.genotype_.getGene(4), 0, 1, 0, 0.001);
        /** @private {number} */
        this.reproductionPotential_ = 0.0005;
        /** @private {p5.Vector} */
        this.location_ = location.copy();
        /** @private {p5.Vector} */
        this.velocity_ = createVector(0, 0);
        /** @private {p5.Vector} */
        this.acceleration_ = createVector(0, 0);
        /** @private {number} Limit how much separation affects steer. */
        this.separationForce_ = 0.1;
        /** @private {p5.Color} */
        this.color_ = color(33, 237, 237);
    }

    /**
     * Set this Agent's genotype.
     * @param {Genotype} genotype The genotype value to assign to this Agent's genotype.
     */
    setGenotype_(genotype) {
        if (genotype === null) {
            genotype = new Genotype(5);
        }

        return genotype;
    }

    /**
     * Get this Agent's genotype.
     * @returns {Genotype} This Agent's genotype.
     */
    getGenotype() {
        return this.genotype_;
    }

    /**
     * Set this Agent's color.
     * @param {p5.Color} color The desired color.
     */
    setColor(color) {
        this.color_ = color;
    }

    /**
     * Get this Agent's predation potential.
     * @returns {number} This Agent's predation potential.
     */
    getPredationPotential() {
        return this.predationPotential_;
    }

    /**
     * Set this Agent's predation potential based on the population size, so
     * that the larger the population, the greater the chance of predation
     * becomes.
     * @param {number} size The size of the population of Agents.
     */
    setPredationPotential(size) {
        // For a population of 5, the predation probability should be 0.0001.
        // For a population of 100, the predation probability should be 0.002.
        // For a population of 500, the predation probability should be 0.01.
        this.predationPotential_ = size / 50000;
    }

    /**
     * Set this Agent's reproduction potential based on the population size, so
     * that the smaller the population, the greater the change of reproduction
     * becomes.
     * @param {number} size The size of the population of Agents.
     */
    setReproductionPotential(size) {
        // For a population of 5, the reproduction probability should be 0.005.
        // For a population of 100, the reproduction probability should be 0.00025.
        // For a population of 500, the reproduction probability should be 0.00005.
        this.reproductionPotential_ = 0.025 / size;
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

        // An agent loses one health point per frame.
        this.health_ -= 1;
    }

    /**
     * Determine this Agent's separation and steering behaviours relative to
     * other objects in the simulation.
     * @param {Agent[]} agents An array of Agents.
     * @param {Food[]} food An array of Food items.
     * @param {Poison[]} poison An array of poison items.
     */
    behave(agents, food, poison) {
        // Apply separation.
        if (agents.length > 1) {
            let separation = this.separate_(agents);
            separation.limit(this.separationForce_);
            this.applyForce_(separation);
        }

        // Apply food steering.
        if (food.length > 0) {
            let foodSteer = this.seek_(food);
            foodSteer.limit(this.foodAttraction_);
            this.applyForce_(foodSteer);
        }

        // Apply agent steering.
        if (agents.length > 1) {
            let agentSteer = this.seek_(agents);
            agentSteer.limit(this.agentAttraction_);
            this.applyForce_(agentSteer);
        }

        // Apply poison steering.
        if (poison.length > 0) {
            let poisonSteer = this.seek_(poison);
            poisonSteer.limit(this.poisonAttraction_);
            this.applyForce_(poisonSteer);
        }
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

            // Collision detection: if this Agent and the Edible object are intersecting, remove the Food object.
            if (this !== e && distance < this.size_ / 2 + e.getSize() / 2) {
                this.health_ += e.getReward();

                if (e instanceof Agent) {
                    this.color_ = color(227, 95, 192);
                }

                e.remove(edibles);
            }
        });
    }

    /**
     * Determine if this Agent is in a location to reproduce with another
     * Agent; if it is, perform the necessary genetic operations and add a new
     * Agent to the array of Agents.
     * @param {Agent[]} agents An array of Agents.
     */
    reproduce(agents) {
        const collisions = this.getCollisions_(agents);
        const mutationRate = 0.1;

        collisions.forEach((other) => {
            if (Math.random() < this.reproductionPotential_) {
                let newGenotype = this.genotype_.crossover(other.getGenotype());
                newGenotype.mutate(mutationRate);

                const child = new Agent({ location: this.location_, genotype: newGenotype });
                agents.push(child);
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
        if (this.location_.x + this.size_ / 2 <= 0) {
            this.location_.x = width + this.size_ / 2;
        } else if (this.location_.x - this.size_ / 2 >= width) {
            this.location_.x = -this.size_ / 2;
        }

        if (this.location_.y + this.size_ / 2 <= 0) {
            this.location_.y = height + this.size_ / 2;
        } else if (this.location_.y - this.size_ / 2 >= height) {
            this.location_.y = -this.size_ / 2;
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
 * Steer this Agent away from nearby Agents.
 * @private
 * @param {Agent[]} agents An array of Agents.
 */
    separate_(agents) {
        const collisions = this.getCollisions_(agents);
        let steer = this.calculateSeparationSteer_(collisions);

        return steer;
    }

    /**
     * Seek out the nearest Edible item.
     * @private
     * @param {Edible[]} edibles An array of Edible objects.
     */
    seek_(edibles) {
        const desiredLocation = this.findNearest_(edibles);
        let steer = this.steer_(desiredLocation);

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

    /**
     * Get all other Agents that this Agent is in collision with.
     * @param {Agent[]} agents An array of Agents.
     * @returns {Agent[]} An array of Agents that this Agent is in collision with.
     */
    getCollisions_(agents) {
        const separation = this.size_;
        let collisions = [];

        agents.forEach((other) => {
            const distance = p5.Vector.dist(this.location_, other.getLocation());

            if (this !== other && distance < separation) {
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

            if (distance > 0) {
                direction.div(distance);
            }

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
        let shortestDistance = Number.MAX_SAFE_INTEGER;    // Set the shortest distance to a large value that will never be exceeded.

        // Find which Edible item is the nearest to this Agent.
        edibles.forEach((e) => {
            const distance = p5.Vector.dist(this.location_, e.getLocation());

            if (this !== e && distance < shortestDistance) {
                nearest = e.getLocation();
                shortestDistance = distance;
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
        let direction = p5.Vector.sub(desiredLocation, this.location_);
        direction.setMag(this.maxSpeed_);

        return p5.Vector.sub(direction, this.velocity_);
    }
}
