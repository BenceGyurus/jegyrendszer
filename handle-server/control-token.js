const Database = require("./mongo/mongo.js");
const Functions = require("./functions.js");

async function control_Token(token, req){
    if (token){
    let {collection, database} = new Database("long-token");
    let datas = await collection.findOne({token : token});
        if (datas && Functions.getIp(req) == datas.datas.ip && datas.datas.timeInMil + 28800000 > new Date().getTime() && datas.status){
            return datas.userData.access;
        }
    }
    return false;
}

module.exports = control_Token;