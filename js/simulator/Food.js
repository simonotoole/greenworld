/** 
 * A class representing a health-restoring food item for consumption by agents
 * in the simulation.
*/
class Food extends Edible {
    /**
     * Create a Food item.
     * @public
     * @param {number} simulatorSize The size of the simulator, used to determine the size of a Food item.
     * @param {p5.Vector} location The Food item's location.
     */
    constructor(simulatorSize, location = createVector(Math.random() * width, Math.random() * height)) {
        super(location);

        /** @override @protected {number} */
        this.size_ = random(width / simulatorSize / 4 - 2, width / simulatorSize / 4 + 2);
        /** @override @protected {p5.Color} */
        this.color_ = color(237, 212, 81);
    }
}
