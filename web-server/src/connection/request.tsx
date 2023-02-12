const  ajax = (method:string, url:string, data:string)=>{
    return new Promise((resolve,reject)=>{
        let req = new XMLHttpRequest();
        req.onreadystatechange = ()=>{
            if (req.status >= 200 && req.status < 300){
                resolve(req.responseText);
            }
            else{
                reject(req.responseText);
            }
        };
        req.open(method, url);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(data);
        });
}

export default ajax;