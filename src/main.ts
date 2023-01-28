async function getFooterHeaderAndDatas(){
    let footer = await sendRequest("GET", "footer.html", "");
    let header = await sendRequest("GET", "header.html", "");
    let datas = JSON.parse(await sendRequest("GET", "datas.json", ""));
    let allOfItems = "";
    for (let i = 0;i < datas.length; i++){
        let html = "";
        html += Html.withEndTag({tag: "p", data: Html.withoutEndTag({tag: "img", src: "images/calendar.png", class: "calendar"})+datas[i].date, class: "event-date"});
        html += Html.withoutEndTag({tag: "img", src: datas[i].image ,alt: datas[i].title ,class : "event-image"});
        html += Html.withEndTag({tag: "h3", data: datas[i].title, class: "event-title"});
        html += Html.withEndTag({tag: "p", data : controlText(datas[i].desciption), class: "event-desciption"});
        html += Html.withoutEndTag({tag: "input", type : "button", value: "Részletek", onclick: `getEvent('${datas[i]._id}')`, class : "getEventButton"})
        allOfItems += Html.withEndTag({tag: "div", data: html, class: "event-divs"});
    }
    document.getElementById("footer").innerHTML = footer;
    document.getElementById("header").innerHTML = header;
    Html.elementTo("container", Html.withEndTag({tag: "div", data: allOfItems, class: "main"}));
    loadAnimation("event-divs");
}

const getEvent = (id:string)=>{
    console.log(id);
}

window.onload = getFooterHeaderAndDatas;