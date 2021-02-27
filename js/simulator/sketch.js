// @ts-nocheck
let food;
let agent;

function setup() {
    createCanvas(windowWidth * 0.7, windowHeight * 0.7);
    food = [];

    for (let i = 0; i < 50; i++) {
        food.push(new Food());
    }

    agent = new Agent();
}

function draw() {
    background(17, 59, 49);

    food.forEach((f) => {
        f.display();

        distance = p5.Vector.dist(agent.getLocation(), f.getLocation());

        if (distance < agent.getRadius() / 2 + f.getSize() / 2) {
            f.remove(food);
        }
    });

    agent.run();
    agent.seek(food);
}

function windowResized() {
    resizeCanvas(windowWidth * 0.7, windowHeight * 0.7);
}
