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
        this.size_ = size;
        /** @private {Object} */
        this.statistics_ = this.initStatisticsMap_();
        /** @private {number} Use this to keep count of how many frames have elapsed for statistical purposes. */
        this.frameCount_ = 0;
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

        this.calculateStatistics_();

        // if (this.frameCount_ > 0 && this.frameCount_ % 10800 === 0) {
        //     this.save();
        // }

        if (this.frameCount_ === 36000) {
            noLoop();
            this.save();
        }

        this.frameCount_++;
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
        const regrowthConstant = 3;

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
        const regrowthConstant = 3;

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

            // Set this agent's reproduction and predation probabilities based
            // on the current population size.
            a.setPredationPotential(this.agents_.length);
            a.setReproductionPotential(this.agents_.length);

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

    initStatisticsMap_() {
        return {
            frameRate: [],
            medianSize: [],
            minSize: [],
            maxSize: [],
            stdSize: [],
            medianSpeed: [],
            minSpeed: [],
            maxSpeed: [],
            stdSpeed: [],
            medianHealth: [],
            minHealth: [],
            maxHealth: [],
            stdHealth: [],
            medianFoodAttraction: [],
            minFoodAttraction: [],
            maxFoodAttraction: [],
            stdFoodAttraction: [],
            medianAgentAttraction: [],
            minAgentAttraction: [],
            maxAgentAttraction: [],
            stdAgentAttraction: [],
            medianPoisonAttraction: [],
            minPoisonAttraction: [],
            maxPoisonAttraction: [],
            stdPoisonAttraction: [],
            medianPredationPotential: [],
            minPredationPotential: [],
            maxPredationPotential: [],
            stdPredationPotential: []
        };
    }

    /**
     * Calculate evolution statistics for this Engine instance.
     * @private
     */
    calculateStatistics_() {
        this.statistics_.frameRate.push(frameRate());
        this.statistics_.medianSize.push(math.median(this.agents_.map((a) => a.size_)));
        this.statistics_.minSize.push(math.min(this.agents_.map((a) => a.size_)));
        this.statistics_.maxSize.push(math.max(this.agents_.map((a) => a.size_)));
        this.statistics_.stdSize.push(math.std(this.agents_.map((a) => a.size_)));
        this.statistics_.medianSpeed.push(math.median(this.agents_.map((a) => a.maxSpeed_)));
        this.statistics_.minSpeed.push(math.min(this.agents_.map((a) => a.maxSpeed_)));
        this.statistics_.maxSpeed.push(math.max(this.agents_.map((a) => a.maxSpeed_)));
        this.statistics_.stdSpeed.push(math.std(this.agents_.map((a) => a.maxSpeed_)));
        this.statistics_.medianHealth.push(math.median(this.agents_.map((a) => a.health_)));
        this.statistics_.minHealth.push(math.min(this.agents_.map((a) => a.health_)));
        this.statistics_.maxHealth.push(math.max(this.agents_.map((a) => a.health_)));
        this.statistics_.stdHealth.push(math.std(this.agents_.map((a) => a.health_)));
        this.statistics_.medianFoodAttraction.push(math.median(this.agents_.map((a) => a.foodAttraction_)));
        this.statistics_.minFoodAttraction.push(math.min(this.agents_.map((a) => a.foodAttraction_)));
        this.statistics_.maxFoodAttraction.push(math.max(this.agents_.map((a) => a.foodAttraction_)));
        this.statistics_.stdFoodAttraction.push(math.std(this.agents_.map((a) => a.foodAttraction_)));
        this.statistics_.medianAgentAttraction.push(math.median(this.agents_.map((a) => a.agentAttraction_)));
        this.statistics_.minAgentAttraction.push(math.min(this.agents_.map((a) => a.agentAttraction_)));
        this.statistics_.maxAgentAttraction.push(math.max(this.agents_.map((a) => a.agentAttraction_)));
        this.statistics_.stdAgentAttraction.push(math.std(this.agents_.map((a) => a.agentAttraction_)));
        this.statistics_.medianPoisonAttraction.push(math.median(this.agents_.map((a) => a.poisonAttraction_)));
        this.statistics_.minPoisonAttraction.push(math.min(this.agents_.map((a) => a.poisonAttraction_)));
        this.statistics_.maxPoisonAttraction.push(math.max(this.agents_.map((a) => a.poisonAttraction_)));
        this.statistics_.stdPoisonAttraction.push(math.std(this.agents_.map((a) => a.poisonAttraction_)));
        this.statistics_.medianPredationPotential.push(math.median(this.agents_.map((a) => a.predationPotential_)));
        this.statistics_.minPredationPotential.push(math.min(this.agents_.map((a) => a.predationPotential_)));
        this.statistics_.maxPredationPotential.push(math.max(this.agents_.map((a) => a.predationPotential_)));
        this.statistics_.stdPredationPotential.push(math.std(this.agents_.map((a) => a.predationPotential_)));
    }
}