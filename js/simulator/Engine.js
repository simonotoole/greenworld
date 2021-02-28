// @ts-nocheck
/** 
 * A class representing the evolution simulator engine, responsible for
 * running the simulation.
 */
class Engine {
    /**
     * Create the Engine.
     * @param {number} size The size of the simulator; determines the number of Agents and Food items.
     */
    constructor(size) {
        /** @private {number} */
        this.size_ = size;    // TODO Consider making the size dependent on the viewport size.
        /** @private {Agent[]} */
        this.agents_ = [];

        for (let i = 0; i < this.size_; i++) {
            this.agents_.push(new Agent(this.size_));
        }

        /** @private {Food[]} */
        this.food_ = [];

        for (let i = 0; i < this.size_ * 20; i++) {
            this.food_.push(new Food(this.size_));
        }
    }

    /**
     * Manage all Food items and Agents in the simulation.
     */
    run() {
        this.manageFood_();
        this.manageAgents_();
    }

    /**
     * Display and regrow food.
     * @private
     */
    manageFood_() {
        this.food_.forEach((f) => {
            f.display();
        });

        // Set a regrowth rate for Food items based on the size of the Agent
        // population. Increase the constant to increase the regrowth rate.
        // Note that this constant should not be greater than or equal to the
        // number of Agents in the simulation, as this would result in
        // unbounded food regrowth. Setting the constant to 0 or a negative
        // value turns off food regrowth.
        const regrowthConstant = 1.0;

        if (regrowthConstant >= this.agents_.length || this.agents_.length === 0) {
            return;
        }

        const regrowthRate = regrowthConstant / this.agents_.length;

        // Add a random probability that new food will be added to the simulation.
        if (Math.random() < regrowthRate) {
            this.food_.push(new Food());
        }
    }

    /**
     * Run each Agent object in the simulation and determine seeking behavior.
     * @private
     */
    manageAgents_() {
        this.agents_.forEach((a) => {
            a.run();
            a.seek(this.food_);
            a.eat(this.food_);
        });
    }
}