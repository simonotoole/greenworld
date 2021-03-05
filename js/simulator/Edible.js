/**
 * A class representing an edible resource in the simulation.
 */
class Edible {
    /**
     * Create an Edible item.
     * @public
     * @param {number} simulatorSize The size of the simulator, used to determine the size of an Edible item.
     * @param {p5.Vector} location The Edible item's location.
     */
    constructor(location) {
        if (this.constructor === Edible) {
            throw new TypeError('Abstract class "Edible" cannot be instantiated directly.');
        }

        /** @virtual @protected {number} */
        this.size_ = 0;
        /** @virtual @protected {p5.Vector} */
        this.location_ = location;
        /** @virtual @protected {p5.Color} */
        this.color_ = color(0);
    }

    /**
     * Get this Edible item's location.
     * @public
     * @returns {p5.Vector} The Edible item's location.
     */
    getLocation() {
        return this.location_;
    }

    /**
     * Get this Edible item's size.
     * @public
     * @returns {number} The Edible item's size.
     */
    getSize() {
        return this.size_;
    }

    /**
     * Remove this Edible item from an array that contains it.
     * @public
     * @param {Edible[]} edibles An array of Edible objects.
     */
    remove(edibles) {
        const index = edibles.indexOf(this);

        if (index > -1) {
            edibles.splice(index, 1);
        }
    }

    /**
    * Display this Edible item to the p5 canvas.
    * @public
    */
    display() {
        fill(this.color_);
        noStroke();
        rectMode(CENTER);
        rect(this.location_.x, this.location_.y, this.size_, this.size_);
    }

    /**
     * Get a health boost for consuming this Edible.
     * @virtual
     * @public
     * @returns {number} A reward proportional to the Edible's size.
     */
    getReward() {
        return this.size_;
    }
}
