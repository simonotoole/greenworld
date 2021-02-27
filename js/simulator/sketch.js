// @ts-nocheck
let agent;
let food;

function setup() {
    createCanvas(windowWidth * 0.7, windowHeight * 0.7);
    agent = new Agent();
    food = [];

    for (let i = 0; i < 50; i++) {
        food.push(new Food());
    }
}

function draw() {
    background(17, 59, 49);
    agent.run();

    for (let i = 0; i < 50; i++) {
        food[i].display();
    }
}

function windowResized() {
    resizeCanvas(windowWidth * 0.7, windowHeight * 0.7);
}
