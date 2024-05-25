const Database = require("./mongo/mongo.js");
const Functions = require("./functions.js");
const getTime = require("./getTime.js");

async function control_Token(token, req) {
  if (token) {
    let { collection, database } = new Database("long-token");
    let datas = await collection.findOne({ token: token });
    console.log("control_token datas [var]", datas);
    Functions.closeConnection(database);
    console.log("Functions.getIp(req), datas.datas.ip", Functions.getIp(req), datas.datas.ip);
    console.log('datas.datas.timeInMil + getTime("TOKEN_SESSION_TIME"), new Date().getTime()', datas.datas.timeInMil + getTime("TOKEN_SESSION_TIME"), new Date().getTime());
    console.log("datas.status", datas.status);
    if (
      datas &&
      Functions.getIp(req) == datas.datas.ip &&
      datas.datas.timeInMil + getTime("TOKEN_SESSION_TIME") >
        new Date().getTime() &&
      datas.status
    ) {
      let { collection, database } = new Database("admin");
      user = await collection.findOne({ _id: datas.userData.id });
      Functions.closeConnection(database);
      console.log("user", user);
      return user ? user.access : false;
    }
  }
  return false;
}

module.exports = control_Token;
