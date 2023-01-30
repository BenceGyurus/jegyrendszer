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
function loadDatas() {
    return __awaiter(this, void 0, void 0, function* () {
        let lid = window.location.pathname;
        let id = "";
        for (let i = 1; i < lid.split("/").length; i++) {
            id += lid.split("/")[i];
        }
        let data = JSON.parse(yield sendRequest("POST", `/event/${id}`, ""));
        let footer = yield sendRequest("GET", "footer.html");
        if (!data.error) {
            let html = "";
            html += Html.withEndTag({ tag: "div", data: Html.withoutEndTag({ tag: "img", src: data.image, class: "event-image" }) + Html.withEndTag({ tag: "div", class: "image-background-bottom", data: "" }) + Html.withEndTag({ tag: "div", class: "image-background-top", data: "" }), class: "image-div" });
            html += Html.withEndTag({ tag: "div", class: "title-div", data: Html.withEndTag({ tag: "h1", data: data.title, class: "event-title" }) });
            html += Html.withEndTag({ tag: "div", class: "desciption", data: Html.withEndTag({ tag: "p", data: "", class: "des" }) });
            let date = data.date.split(",")[0];
            let time = data.date.split(",")[1];
            html += Html.withEndTag({ tag: "p", class: "date", data: Html.withEndTag({ tag: "span", class: "d", data: date }) + Html.withoutEndTag({ tag: "br" }) + Html.withEndTag({ tag: "span", class: "time", data: time }) });
            html += Html.withoutEndTag({ tag: "input", type: "button", value: "Jegy vásárlás", class: "but-ticket-button", onclick: "goToBottomOfPage()" });
            Html.elementTo("main", html);
            Html.elementTo("footer", footer);
            typingAnimation(data.desciption, ".des");
        }
    });
}
addEventListener("scroll", () => {
    if (window.scrollY > window.innerHeight) {
        document.querySelector(".event-image").style.position = "absolute";
        document.querySelector(".image-background-top").style.position = "absolute";
        document.querySelector(".image-background-bottom").style.position = "absolute";
        document.querySelector(".event-title").style = `background:linear-gradient(to right, rgb(${255 - (window.scrollY - window.innerHeight) > 0 ? 255 - (window.scrollY - window.innerHeight) : 0},${255 - (window.scrollY - window.innerHeight) > 0 ? 255 - (window.scrollY - window.innerHeight) : 0},${255 - (window.scrollY - window.innerHeight) > 0 ? 255 - (window.scrollY - window.innerHeight) : 0}), rgba(169,206,21,255));-webkit-background-clip: text;-webkit-text-fill-color: transparent;`;
        console.log(`rgb(${255 - (window.scrollY - window.innerHeight) > 0 ? 255 - (window.scrollY - window.innerHeight) : 0},${255 - (window.scrollY - window.innerHeight) > 0 ? 255 - (window.scrollY - window.innerHeight) : 0},${255 - (window.scrollY - window.innerHeight) > 0 ? 255 - (window.scrollY - window.innerHeight) : 0})`);
    }
    else if (window.scrollY < window.innerHeight) {
        document.querySelector(".event-image").style.position = "fixed";
        document.querySelector(".image-background-top").style.position = "fixed";
        document.querySelector(".image-background-bottom").style.position = "fixed";
        document.querySelector(".event-title").style = `background: linear-gradient(to right, white, rgba(169,206,21,255));-webkit-background-clip: text;-webkit-text-fill-color: transparent;`;
    }
});
function goToBottomOfPage() {
    window.scrollTo(0, window.innerHeight * 1.2 + 2);
}
window.onload = loadDatas;
