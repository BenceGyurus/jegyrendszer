const Database = require("./mongo/mongo.js");
const Functions = require("./functions.js");

async function control_Token(token, req){
    if (token){
    let {collection, database} = new Database("long-token");
    let datas = await collection.findOne({token : token});
    setTimeout(()=>{
        database.close();
    }, 10000);
        if (datas && Functions.getIp(req) == datas.datas.ip && datas.datas.timeInMil + 28800000 > new Date().getTime() && datas.status){
            let {collection, database} = new Database("admin");
            user = await collection.findOne({_id : datas.userData.id});
            setTimeout(()=>{
                database.close()
            },10000);
            return user ? user.access : false;
        }
    }
    return false;
}

module.exports = control_Token;