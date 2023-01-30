"use strict";
const controlText = (text) => {
    let newString = "";
    const maxNumber = 100;
    if (text.length > maxNumber) {
        for (let i = 0; i < maxNumber; i++) {
            newString += text[i];
        }
        for (let i = maxNumber; i < text.length; i++) {
            if (text[i] == " ") {
                newString += text[i] + "[...]";
                break;
            }
            else {
                newString += text[i];
            }
        }
    }
    else {
        newString = text;
    }
    return newString;
};
