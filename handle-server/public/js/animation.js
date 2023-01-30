"use strict";
const loadAnimation = (className) => {
    let elements = document.querySelectorAll(`.${className}`);
    let i = 0;
    elements.forEach(element => {
        element.style.animationDelay = `${i / 10}s`;
        i++;
    });
};
function typingAnimation(text, element) {
    let elementText = "";
    let tag = "";
    let openTag = false;
    let index = 0;
    let interval = setInterval(() => {
        var _a;
        if (index >= text.length - 1) {
            clearInterval(interval);
        }
        if (text[index] == "<" || openTag) {
            tag += text[index];
            openTag = true;
        }
        else {
            elementText += text[index] == "\n" ? "<br />" : text[index];
        }
        if (text[index] == ">") {
            openTag = false;
            element += tag;
            tag = "";
        }
        (_a = document.querySelector(element)) === null || _a === void 0 ? void 0 : _a.innerHTML = elementText;
        console.log(elementText);
        index++;
    }, 15);
}
