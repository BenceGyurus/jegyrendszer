const { getIp, getBrowerDatas, closeConnection } = require("./functions.js");
const Database = require("./mongo/mongo.js");

async function otherData(req, token) {
  let sendData = {};
  if (req) {
    sendData.ip = getIp(req);
    try {
      sendData.browserData = getBrowerDatas(req);
    } catch {
      console.log("There is no browser data");
    }
    try {
      sendData.rawHeaders = req.rawHeaders;
    } catch {
      console.log("There is no rawheader");
    }
    sendData.objectTime = new Date();
    sendData.timeInString = new Date().toJSON();
    sendData.timeInMil = new Date().getTime();
  }
  if (token) {
    sendData.userData = {};
    let { collection, database } = new Database("long-token");
    let datas = await collection.findOne({ token: token });
    sendData.userData = {
      username: datas.userData.username,
      userId: datas.userData.id,
      readableid: datas.readableUsername,
    };
    closeConnection(database);
  }
  return sendData;
}

module.exports = otherData;
