const Database = require("./mongo/mongo.js");
const Functions = require("./functions.js");
const getTime = require("./getTime.js");

async function control_Token(token, req) {
  if (token) {
    let { collection, database } = new Database("long-token");
    let datas = await collection.findOne({ token: token });
    Functions.closeConnection(database);
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
      return user ? user.access : false;
    }
  }
  return false;
}

module.exports = control_Token;
