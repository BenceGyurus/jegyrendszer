async function getFooterHeaderAndDatas(){
    document.getElementById("footer").innerHTML = await sendRequest("GET", "footer.html", "");
    document.getElementById("header").innerHTML = await sendRequest("GET", "header.html", "");
    let datas = JSON.parse(await sendRequest("GET", "datas.json", ""));
    let allOfItems = "";
    for (let i = 0;i < datas.length; i++){
        let html = "";
        html += Html.withEndTag({tag: "p", data: Html.withoutEndTag({tag: "img", src: "images/calendar.png", class: "calendar"})+datas[i].date, class: "event-date"});
        html += Html.withoutEndTag({tag: "img", src: datas[i].image ,alt: datas[i].title ,class : "event-image"});
        html += Html.withEndTag({tag: "h3", data: datas[i].title, class: "event-title"});
        html += Html.withEndTag({tag: "p", data : datas[i].desciption, class: "event-desciption"});
        allOfItems += Html.withEndTag({tag: "div", data: html, class: "event-divs"});
    }
    Html.elementTo("test", Html.withEndTag({tag: "div", data: allOfItems, class: "main"}));
}

window.onload = getFooterHeaderAndDatas;