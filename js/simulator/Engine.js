/** 
 * A class representing the evolution simulator engine, responsible for
 * running the simulation.
 */
class Engine {
    /**
     * Create the Engine.
     * @public
     * @param {number} size The size of the simulator; determines the number of Agents and Food items.
     */
    constructor(size) {
        /** @private {number} */
        this.size_ = size;    // TODO Consider making the size dependent on the viewport size.
        /** @private {Object} */
        this.statistics_ = {
            frameRate: []
        };
        /** @private {Agent[]} */
        this.agents_ = [];

        for (let i = 0; i < this.size_; i++) {
            this.agents_.push(new Agent());
        }

        /** @private {Food[]} */
        this.food_ = [];

        for (let i = 0; i < this.size_ * 20; i++) {
            this.food_.push(new Food(this.size_));
        }

        /** @private {Poison[]} */
        this.poison_ = []

        for (let i = 0; i < this.size_ * 5; i++) {
            this.poison_.push(new Poison(this.size_));
        }
    }

    /**
     * Manage all Food items and Agents in the simulation.
     * @public
     */
    run() {
        this.manageFood_();
        this.managePoison_();
        this.manageAgents_();

        this.statistics_.frameRate.push(frameRate());
    }

    /**
     * Save statistics relating to the current run of the simulator.
     * @public
     */
    save() {
        saveJSON(this.statistics_, "simulator_" + Date.now() + ".json");
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
        const regrowthConstant = 2;

        if (regrowthConstant >= this.agents_.length || this.agents_.length === 0) {
            return;
        }

        const regrowthRate = regrowthConstant / this.agents_.length;

        // Add a random probability that new food will be added to the simulation.
        if (Math.random() < regrowthRate) {
            this.food_.push(new Food(this.size_));
        }
    }

    /**
     * Display and regrow poison.
     * @private
     */
    managePoison_() {
        this.poison_.forEach((p) => {
            p.display();
        });

        // Set a regrowth rate for Poison items based on the size of the Food
        // population. Increase the constant to increase the regrowth rate.
        // Note that this constant should not be greater than or equal to the
        // number of Food items in the simulation, as this would result in
        // unbounded poison regrowth. Setting the constant to 0 or a negative
        // value turns off poison regrowth.
        const regrowthConstant = 1;

        if (regrowthConstant >= this.food_.length || this.food_.length === 0) {
            return;
        }

        const regrowthRate = regrowthConstant / this.food_.length;

        // Add a random probability that new poison will be added to the simulation.
        if (Math.random() < regrowthRate) {
            this.poison_.push(new Poison(this.size_));
        }
    }

    /**
     * Run each Agent object in the simulation and determine seeking behavior.
     * @private
     */
    manageAgents_() {
        this.agents_.forEach((a, index) => {
            if (a.isDead()) {
                this.agents_.splice(index, 1);
                this.food_.push(new Food(this.size_, a.getLocation()));

                return;
            }

            a.run();
            a.behave(this.agents_, this.food_, this.poison_);
            a.eat(this.food_);
            a.eat(this.poison_);

            if (Math.random() < a.getPredationPotential()) {
                a.eat(this.agents_);
            }

            a.reproduce(this.agents_);
        });
    }
}