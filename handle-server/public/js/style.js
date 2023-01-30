"use strict";
function setWidthOfMain() {
    let maxWidth = window.innerWidth;
    let windthOfEventsDiv = 350;
    let margin = 40;
    console.log(`${Math.floor((maxWidth - 200) / windthOfEventsDiv) * windthOfEventsDiv}px`);
    let border = Math.floor((maxWidth - Math.floor((maxWidth) / windthOfEventsDiv) * windthOfEventsDiv) / 2 - Math.floor((maxWidth) / windthOfEventsDiv) * margin + (margin * 2));
    console.log(border);
    document.querySelector(".main").style.width = `${Math.floor(maxWidth / windthOfEventsDiv) * windthOfEventsDiv + (Math.floor(maxWidth) / windthOfEventsDiv) * margin}px`;
    document.querySelector(".main").style.marginRight = `${border}px`;
    document.querySelector(".main").style.marginLeft = `${border}px`;
}
