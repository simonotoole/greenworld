/**
 * @fileoverview This file is the p5.js entry point and is responsible for
 * defining the canvas properties, and initializing and running the simulator.
 */
"use strict";

let started;
let engine;

/**
 * Define the p5 canvas properties and initialize the simulator.
 */
function setup() {
    frameRate(60);

    if (windowWidth <= 480) {
        createCanvas(windowWidth * 0.96, windowHeight * 0.7);
    } else {
        createCanvas(windowWidth * 0.7, windowHeight * 0.7);
    }

    initialize();
}

/**
 * Run the simulator and draw its state to the canvas.
 */
function draw() {
    if (!started) {
        return;
    }

    background(0, 128, 128);
    engine.run();
}

/**
 * Resize the canvas when the window is resized.
 */
function windowResized() {
    if (windowWidth <= 480) {
        resizeCanvas(windowWidth * 0.96, windowHeight * 0.7);
    } else {
        resizeCanvas(windowWidth * 0.7, windowHeight * 0.7);
    }
}

/**
 * Define the initial simulator environment.
 */
const initialize = () => {
    background(0, 128, 128);

    started = false;
    engine = new Engine(50);
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

/**
 * Write statistics relating to the current run of the simulator to a file.
 */
const saveStatistics = () => {
    engine.save();
};
