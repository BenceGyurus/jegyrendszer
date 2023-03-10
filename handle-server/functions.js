const uuid = require("uuid");
const fs = require("fs");
var browser = require('browser-detect');
class Functions{
    static getBrowerDatas(req){return browser(req.headers['user-agent'])}
    static genrateToken(){return uuid.v4();}
    static getIp(req){return req.headers['x-forwarded-for'] || req.socket.remoteAddress;}
    static parseBody(body){try{return JSON.parse(Object.keys(body)[0]);}catch{return body;}}
    static encryption(text){
        let newText = "";
        for (let i = 0; i < text.length; i++){
            newText += String();
            let l = Math.floor(text[i].charCodeAt(0)*100*Math.sin(i > 0 ? text[i-1].charCodeAt(0) : 1)*Math.cos(i < text.length - 1 ? text[i + 1].charCodeAt(0) : 0))*100; 
            newText += String(l < 0 ? -l : l);}return newText;}
    static getNameOfDatabase(key){
        try{
            return JSON.parse(fs.readFileSync(`${__dirname}/database.json`))[key];
        }catch{
    
        }
    }
    static merge_Access(access_List){
        try{
            let returnList = {};
            let accesses = JSON.parse(fs.readFileSync(`${__dirname}/user/accesslist.json`));
            access_List.forEach(access => {
                returnList[access] = accesses[access];
            });
            return returnList;
        }
        catch{
            return false
        }
    }
    static replaceInText(path, text){
        let newText = "";
        try{
            let replaceChars = JSON.parse(fs.readFileSync(path));
            text.split("").forEach((char)=>{
                newText += replaceChars[char] ? replaceChars[char] : char;
            })
            return newText;
        }catch{
            return false;
        }
    }
    static sanitizeingText(data){
        newText = this.replaceInText(`${__dirname}/charset/htmlReadyTextChars.json`, data);
        return newText ? newText : data;
    }
    static sanitizeingId(text){
        let newText = "";
        newText = this.replaceInText(`${__dirname}/charset/idchars.json`, text);
        text = newText ? newText : text;
        text = "";
        text = text.toLowerCase();
        text.split("").forEach(char => {
            console.log(char.charCodeAt());
            if ((char.charCodeAt() >= 97 && char.charCodeAt() <= 122) || char.charCodeAt() === 45){
                newText += char;
            }
        });
        return newText
    }
    static control_Password_And_Username(json){
        let regex = new RegExp("(?=.*[0-9])");
        return (json.username && json.username.length > 3 && json.password && json.password.length >= 8 && regex.test(json.password));
    }
    static control_Access(json){
        try {
            let returnAccess = [];
            let acceses = JSON.parse(fs.readFileSync(`${__dirname}/user/accesslist.json`));
            Object.keys(json.access).jsonforEach((x)=>{
                Object.keys(acceses).forEach((y)=>{
                    x == y ? returnAccess.push(y) : false;
                });
            });
            returnAccess.push("profile");
            return returnAccess;
        } catch{
            return false;
        } 
    }
    
}


module.exports = Functions;