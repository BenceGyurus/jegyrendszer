const insertCookie = (name:string, value:string, expires:Date, path:string)=>{
    document.cookie = `${name}=${value}; expires=${expires}; path = "${path}"`;
}

export default insertCookie;