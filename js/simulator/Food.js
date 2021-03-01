/** 
 * A class representing a health-restoring food item for consumption by agents
 * in the simulation.
*/
class Food {
    /**
     * Create a Food item.
     * @param {number} simulatorSize The size of the simulator, used to determine the size of a Food item.
     * @param {p5.Vector} location The Food item's location.
     */
    constructor(simulatorSize, location = createVector(Math.random() * width, Math.random() * height)) {
        /** @private {p5.Vector} */
        this.location_ = location;
        /** @private {number} */
        this.size_ = width / simulatorSize / 4;
    }

    /**
     * Get this Food item's location.
     * @returns {p5.Vector} The Food item's location.
     */
    getLocation() {
        return this.location_;
    }

    /**
     * Get this Food item's size.
     * @returns {number} The Food item's size.
     */
    getSize() {
        return this.size_;
    }

    /**
     * Display this Food item to the p5 canvas.
     */
    display() {
        fill(237, 212, 81);
        noStroke();
        rectMode(CENTER);
        rect(this.location_.x, this.location_.y, this.size_, this.size_);
    }

    /**
     * Remove this Food item from the array of Food objects.
     * @param {Food[]} foodArray An array of Food objects.
     */
    remove(foodArray) {
        const index = foodArray.indexOf(this);

        if (index > -1) {
            foodArray.splice(index, 1);
        }
    }
}
