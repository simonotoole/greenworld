/** A class representing a health-restoring food item for consumption by agents
 * in the simulation. */
class Food {
    constructor() {
        this.location = createVector(Math.random() * width, Math.random() * height);
        this.size = 6;
    }

    display() {
        fill(255, 255, 0);
        noStroke();
        rectMode(CENTER);
        rect(this.location.x, this.location.y, this.size, this.size);
    }
}
