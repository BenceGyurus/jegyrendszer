const insertCookie = (name:string, value:string, expires:Date, path:string)=>{
    //document.l = `${name}=${value}; expires=${expires}; path = "${path}"`;
    localStorage.setItem(name, value);
}

export default insertCookie;