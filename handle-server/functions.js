const uuid = require("uuid");
const fs = require("fs");
var browser = require("browser-detect");
const { ObjectId } = require("mongodb");

const databaseNames = JSON.parse(fs.readFileSync(`${__dirname}/database.json`));

class Functions {
  static getBrowerDatas(req) {
    return browser(req.headers["user-agent"]);
  }
  static genrateToken() {
    return uuid.v4();
  }
  static getIp(req) {
    try {
      return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    } catch {
      try {
        return (
          req.handshake.headers["x-forwarded-for"] ||
          req.handshake.address.address
        );
      } catch {
        return "";
      }
    }
  }
  static parseBody(body) {
    try {
      return JSON.parse(Object.keys(body)[0]);
    } catch {
      return body;
    }
  }
  static encryption(text) {
    let newText = "";
    for (let i = 0; i < text.length; i++) {
      newText += String();
      let l =
        Math.floor(
          text[i].charCodeAt(0) *
            100 *
            Math.sin(i > 0 ? text[i - 1].charCodeAt(0) : 1) *
            Math.cos(i < text.length - 1 ? text[i + 1].charCodeAt(0) : 0),
        ) * 100;
      newText += String(l < 0 ? -l : l);
    }
    return newText;
  }
  static getNameOfDatabase(key) {
    try {
      return databaseNames[key];
    } catch {}
  }
  static parseUserAgent(userAgent) {
    const osRegex =
      /(\bAndroid\b|\biPhone OS\b|\biPad\b|\bWindows NT\b|\bMac OS X\b|\bLinux\b)/i;
    const browserRegex =
      /(\bChrome\b|\bSafari\b|\bFirefox\b|\bEdge\b|\bOpera\b)/i;

    const osMatch = userAgent.match(osRegex);
    const browserMatch = userAgent.match(browserRegex);

    const os = osMatch ? osMatch[0] : "Unknown OS";
    const browser = browserMatch ? browserMatch[0] : "Unknown Browser";

    return { os, browser };
  }
  static merge_Access(access_List) {
    try {
      let returnList = {};
      let accesses = JSON.parse(
        fs.readFileSync(`${__dirname}/user/accesslist.json`),
      );
      access_List.forEach((access) => {
        returnList[access] = accesses[access];
      });
      return returnList;
    } catch {
      return false;
    }
  }
  static replaceInText(path, text) {
    let newText = "";
    try {
      let replaceChars = JSON.parse(fs.readFileSync(path));
      text.split("").forEach((char) => {
        newText +=
          replaceChars[char] || replaceChars[char] === null
            ? replaceChars[char] === null
              ? ""
              : replaceChars[char]
            : char;
      });
      return newText;
    } catch {
      return false;
    }
  }
  static sanitizeingText(data) {
    let newText = this.replaceInText(
      `${__dirname}/charset/htmlReadyTextChars.json`,
      data,
    );
    return newText ? newText : data;
  }
  static sanitizeingId(text) {
    let newText = "";
    text = text.toLowerCase();
    newText = this.replaceInText(`${__dirname}/charset/idchars.json`, text);
    text = newText ? newText : text;
    text = "";
    text = text.toLowerCase();
    text.split("").forEach((char) => {
      console.log(char.charCodeAt());
      if (
        (char.charCodeAt() >= 97 && char.charCodeAt() <= 122) ||
        char.charCodeAt() === 45
      ) {
        newText += char;
      }
    });
    return newText;
  }
  static control_Password_And_Username(json) {
    let regex = new RegExp("(?=.*[0-9])");
    return (
      json.username &&
      json.username.length > 4 &&
      json.password &&
      json.password.length >= 8 &&
      regex.test(json.password)
    );
  }
  static controlPassword(password) {
    let regex = new RegExp("(?=.*[0-9])");
    return password.length >= 8 && regex.test(password);
  }
  static control_Access(json) {
    try {
      let returnAccess = [];
      let acceses = JSON.parse(
        fs.readFileSync(`${__dirname}/user/accesslist.json`),
      );
      json.access.forEach((x) => {
        Object.keys(acceses).forEach((y) => {
          x == y ? returnAccess.push(y) : false;
        });
      });
      returnAccess.push("profile");
      return returnAccess;
    } catch {
      return false;
    }
  }
  static readJson(fileName) {
    try {
      return JSON.parse(fs.readFileSync(`${__dirname}/${fileName}`));
    } catch {
      return false;
    }
  }
  static getPlaces(places) {
    let result = [];
    if (places) {
      for (let i = 0; i < places.length; i++) {
        result.push({
          price: places[i].price,
          places: places[i].seats,
          id: places[i].id,
          numberOfTicket: places[i].numberOfTicket,
          name: places[i].name,
          pendingPlaces: places[i].pendingPlaces,
          numberOfFreeTickets: places[i].numberOfFreeTickets,
          boughtPlaces: places[i].boughtPlaces,
        });
      }
    }
    return result;
  }

  static removeByValue(array, value) {
    let index = array.indexOf(value);
    if (index !== -1) {
      array.splice(index, 1);
    }
    return array;
  }

  static closeConnection = (database) => {
    setTimeout(() => {
      try {
        database.close();
      } catch {
        console.log("Database cloudn't be closed");
      }
    }, 10000);
  };

  static createObjectId = (id)=>{
    let objectId = "";
    try{
      objectId = new ObjectId(id);
    }catch{
      objectId = id;
    }
    return objectId;
  }
}

module.exports = Functions;
