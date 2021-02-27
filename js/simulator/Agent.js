// @ts-nocheck
/** Class representing an autonomous agent in the simulation. */
class Agent {
    /**
     * Create an Agent.
     */
    constructor() {
        this.location = createVector(Math.random() * width, Math.random() * height);
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.radius = 24;
        this.maxSpeed = 12;
        this.col = color(0, 0, 255);
    }

    /**
     * Move and display this Agent.
     */
    run() {
        this.update();
        this.checkEdges();
        this.display();
    }

    /**
     * Calculate this Agent's velocity and location.
     */
    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
    }

    /**
     * Perform canvas wraparound for this Agent.
     */
    checkEdges() {
        if (this.location.x < 0) {
            this.location.x = width;
        } else if (this.location.x > width) {
            this.location.x = 0;
        }

        if (this.location.y < 0) {
            this.location.y = height;
        } else if (this.location.y > height) {
            this.location.y = 0;
        }
    }

    /**
     * Display this Agent to the p5 canvas.
     */
    display() {
        fill(this.col);
        noStroke();
        ellipseMode(CENTER);
        ellipse(this.location.x, this.location.y, this.radius, this.radius);
    }
}
