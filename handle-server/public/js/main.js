"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getFooterHeaderAndDatas() {
    return __awaiter(this, void 0, void 0, function* () {
        let footer = yield sendRequest("GET", "footer.html", "");
        let header = yield sendRequest("GET", "header.html", "");
        let datas = JSON.parse(yield sendRequest("GET", "datas.json", ""));
        let allOfItems = "";
        for (let i = 0; i < datas.length; i++) {
            let html = "";
            html += Html.withEndTag({ tag: "p", data: Html.withoutEndTag({ tag: "img", src: "images/calendar.png", class: "calendar" }) + datas[i].date, class: "event-date" });
            html += Html.withoutEndTag({ tag: "img", src: datas[i].image, alt: datas[i].title, class: "event-image" });
            html += Html.withEndTag({ tag: "h3", data: datas[i].title, class: "event-title" });
            html += Html.withEndTag({ tag: "p", data: controlText(datas[i].desciption), class: "event-desciption" });
            html += Html.withoutEndTag({ tag: "input", type: "button", value: "Részletek", onclick: `getEvent('${datas[i]._id}')`, class: "getEventButton" });
            allOfItems += Html.withEndTag({ tag: "div", data: html, class: "event-divs" });
        }
        document.getElementById("footer").innerHTML = footer;
        document.getElementById("header").innerHTML = header;
        Html.elementTo("container", Html.withEndTag({ tag: "div", data: allOfItems, class: "main" }));
        loadAnimation("event-divs");
        setInterval(setWidthOfMain, 300);
    });
}
const getEvent = (id) => {
    window.location = `/${id}`;
};
window.onload = getFooterHeaderAndDatas;
