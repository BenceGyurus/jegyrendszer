"use strict";
const loadAnimation = (className) => {
    let elements = document.querySelectorAll(`.${className}`);
    let i = 0;
    elements.forEach(element => {
        element.style.animationDelay = `${i / 10}s`;
        i++;
    });
};
