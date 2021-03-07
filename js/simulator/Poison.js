/**
 * A class representing a health-damaging poison item for consumption by agents
 * in the simulation.
 */
class Poison extends Edible {
    /**
     * Create a Poison item.
     * @public
     * @param {number} simulatorSize The size of the simulator, used to determine the size of a Poison item.
     * @param {p5.Vector} location The initial location of this Poison item.
     */
    constructor(simulatorSize, location = createVector(Math.random() * width, Math.random() * height)) {
        super(location);

        /** @override @protected {number} */
        this.size_ = random(width / simulatorSize / 4 - 2, width / simulatorSize / 4 + 2);

        if (this.size_ > 10) {
            this.size_ = 10;
        }

        /** @override @protected {p5.Color} */
        this.color_ = color(161, 22, 124);
    }

    /**
     * Get health damage for consuming this Poison.
     * @virtual
     * @public
     * @returns {number} A damage value proportional to the Poison's size.
     */
    getReward() {
        return -(this.size_);
    }
}