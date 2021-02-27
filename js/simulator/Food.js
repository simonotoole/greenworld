// @ts-nocheck
/** 
 * A class representing a health-restoring food item for consumption by agents
 * in the simulation.
*/
class Food {
    /**
     * Create a Food item.
     */
    constructor() {
        /** @private {p5.Vector} */
        this.location_ = createVector(Math.random() * width, Math.random() * height);
        /** @private {number} */
        this.size_ = 6;
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
        fill(255, 255, 0);
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
