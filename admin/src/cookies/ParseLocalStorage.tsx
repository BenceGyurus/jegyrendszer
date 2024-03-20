const strip = (text:string):string=>{
    let newText = "";
    let beginText = false;
    for (let i = 0; i < text.length; i++){
        if (text[i] !== " " && text[i] !== "\n"){beginText = true;}
        if (beginText){newText+=text[i]}
    }
    return newText;
}

const ParseLocalStorage = (name:string):any=>{
    /*let cookiesInString = document.cookie;
    let cookiesInList = cookiesInString.split(";");
    let Cookies:any = [];
    cookiesInList.forEach((cookieData)=>{
        let valueOfCookie = "";
        for (let i = 1; i < cookieData.split("=").length; i++){
            valueOfCookie += cookieData.split("=")[i];
        }
        Cookies[strip(cookieData.split("=")[0])] =  strip(valueOfCookie);
    });
    return Cookies;*/
    return localStorage.getItem(name);
}

export default ParseLocalStorage;