const Database = require("./mongo/mongo.js");
const Functions = require("./functions.js");

async function control_Token(token, req){
    if (token){
    let {collection, database} = new Database("long-token");
    let datas = await collection.findOne({token : token});
        if (datas && Functions.getIp(req) == datas.datas.ip && datas.datas.timeInMil + 28800000 > new Date().getTime() && datas.status){
            let user = await new Database("admin").collection.findOne({_id : datas.userData.id});
            console.log(user);
            return user ? datas.userData.access : false;
        }
    }
    return false;
}

module.exports = control_Token;