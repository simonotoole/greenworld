/**
 * @fileoverview This file includes helper functions for showing and hiding the
 * simulator control buttons and attaches click event listeners to these
 * buttons.
 */
"use strict";

/**
 * @param {HTMLElement} btn A HTML button.
 */
const show = (btn) => {
    btn.style.display = "inline-block";
};

/**
 * @param {HTMLElement} btn A HTML button.
 */
const hide = (btn) => {
    btn.style.display = "none";
};

const playButton = document.getElementById("btn-play");
const newButton = document.getElementById("btn-new");
const pauseButton = document.getElementById("btn-pause");
// const statsButton = document.getElementById("btn-stats");

playButton.addEventListener("click", (event) => {
    play();

    show(newButton);
    show(pauseButton);
    hide(playButton);
    // hide(statsButton);
});

newButton.addEventListener("click", (event) => {
    initialize();

    show(playButton);
    hide(newButton);
    hide(pauseButton);
    // hide(statsButton);
});

pauseButton.addEventListener("click", (event) => {
    pause();

    show(playButton);
    // show(statsButton);
    hide(pauseButton);
});

// statsButton.addEventListener("click", (event) => {
//     saveStatistics();
// });
