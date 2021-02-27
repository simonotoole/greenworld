// @ts-nocheck
/**
 * @fileoverview This file is the p5.js entry point and is responsible for
 * defining the canvas properties, and initializing and running the simulator.
 */
"use strict";

let started;
let food;
let agent;

/**
 * Define the p5 canvas properties and initialize the simulator.
 */
function setup() {
    createCanvas(windowWidth * 0.7, windowHeight * 0.7);
    initialize();
}

/**
 * Run the simulator and draw its state to the canvas.
 */
function draw() {
    if (!started) {
        return;
    }

    background(17, 59, 49);

    food.forEach((f) => {
        f.display();

        let distance = p5.Vector.dist(agent.getLocation(), f.getLocation());

        if (distance < agent.getRadius() / 2 + f.getSize() / 2) {
            f.remove(food);
        }
    });

    agent.run();
    agent.seek(food);
}

/**
 * Resize the canvas when the window is resized.
 */
function windowResized() {
    resizeCanvas(windowWidth * 0.7, windowHeight * 0.7);
}

/**
 * Define the initial simulator environment.
 */
const initialize = () => {
    background(17, 59, 49);
    started = false;
    food = [];

    for (let i = 0; i < 50; i++) {
        food.push(new Food());
    }

    agent = new Agent();
};

/**
 * Start the simulator.
 */
const play = () => {
    started = true;
    loop();
};

/**
 * Pause the simulator.
 */
const pause = () => {
    noLoop();
};
