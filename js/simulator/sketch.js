// @ts-nocheck
let agent;

function setup() {
    createCanvas(windowWidth * 0.7, windowHeight * 0.7);
    agent = new Agent();
}

function draw() {
    background(17, 59, 49);
    agent.run();
}

function windowResized() {
    resizeCanvas(windowWidth * 0.7, windowHeight * 0.7);
}
