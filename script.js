"use strict";

/**
 * Programmer jokes served by the "Compiler of Bad Jokes" widget.
 * @type {ReadonlyArray<string>}
 */
const JOKES = [
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "There are only 10 kinds of people: those who understand binary and those who don't.",
    'A SQL query walks into a bar, approaches two tables and asks: "Mind if I join you?"',
    "Why did the developer go broke? Because he used up all his cache.",
    "I would tell you a UDP joke, but you might not get it.",
    "How many programmers does it take to change a light bulb? None — that's a hardware problem.",
    "!false — it's funny because it's true.",
    "Why do Java developers wear glasses? Because they don't C#.",
    "Debugging: being the detective in a crime movie where you are also the murderer.",
    "There's no place like 127.0.0.1.",
];

/**
 * The Konami code key sequence (lower-cased for single-character keys).
 * @type {ReadonlyArray<string>}
 */
const KONAMI_SEQUENCE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];

/**
 * Identifier of the timer that hides the easter-egg toast, or 0 when idle.
 * @type {number}
 */
let partyToastTimer = 0;

/**
 * Picks the next joke index while avoiding an immediate repeat.
 * @param {number} current - The index currently displayed.
 * @param {number} total - Total number of jokes available.
 * @returns {number} The index of the next joke to show.
 */
const pickNextJoke = (current, total) => {
    let next = current;

    while (next === current) {
        next = Math.floor(Math.random() * total);
    }

    return next;
};

/**
 * Wires up the random-joke button.
 * @returns {void}
 */
const initJokes = () => {
    const button = document.getElementById("joke-button");
    const output = document.getElementById("joke");

    if (button === null || output === null) {

        return;
    }

    let currentIndex = 0;

    button.addEventListener("click", () => {
        currentIndex = pickNextJoke(currentIndex, JOKES.length);
        output.textContent = JOKES[currentIndex];
    });
};

/**
 * Reveals the celebratory toast for a few seconds.
 * @param {HTMLElement | null} toast - The toast element to show.
 * @returns {void}
 */
const showPartyToast = (toast) => {
    if (!toast) {
        return;
    }

    toast.hidden = false;
    // Force a reflow so the entrance transition runs from the hidden state.
    void toast.offsetWidth;
    toast.classList.add("easter-egg-toast--visible");

    window.clearTimeout(partyToastTimer);
    partyToastTimer = window.setTimeout(() => {
        toast.classList.remove("easter-egg-toast--visible");
    }, 5000);
};

/**
 * Listens for the Konami code and toggles party mode when it completes.
 * @returns {void}
 */
const initKonami = () => {
    const toast = document.getElementById("easter-toast");
    let progress = 0;

    document.addEventListener("keydown", (event) => {
        const key =
            event.key.length === 1 ? event.key.toLowerCase() : event.key;

        if (key === KONAMI_SEQUENCE[progress]) {
            progress += 1;
        } else {
            progress = key === KONAMI_SEQUENCE[0] ? 1 : 0;
        }

        if (progress === KONAMI_SEQUENCE.length) {
            progress = 0;
            document.body.classList.toggle("konami-mode");
            showPartyToast(toast);
        }
    });
};

/**
 * Adds a playful wiggle to the avatar whenever it is clicked.
 * @returns {void}
 */
const initAvatar = () => {
    const avatar = document.querySelector(".contact-info__avatar");

    if (!avatar) {
        return;
    }

    avatar.addEventListener("click", () => {
        avatar.classList.remove("contact-info__avatar--wiggle");
        // Restart the animation even on rapid repeated clicks.
        void avatar.offsetWidth;
        avatar.classList.add("contact-info__avatar--wiggle");
    });
};

/**
 * Greets curious developers who open the browser console.
 * @returns {void}
 */
const greetDevelopers = () => {
    console.log(
        "%c👋 Well, well, well… a fellow developer.",
        "color:#ff9a00;font-size:16px;font-weight:bold;",
    );
    console.log(
        "%cYou opened the console — I respect that.\n" +
            "There's a Konami code hidden on this page: ↑ ↑ ↓ ↓ ← → ← → B A.\n",
        "color:#5c5c62;font-size:12px;",
    );
};

/**
 * Boots every interactive enhancement once the DOM is ready.
 * @returns {void}
 */
const init = () => {
    initJokes();
    initKonami();
    initAvatar();
    greetDevelopers();
};

document.addEventListener("DOMContentLoaded", init);
