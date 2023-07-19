const Database = require("./mongo/mongo.js");
const Functions = require("./functions.js");
const handleError = require("./handleError.js");
const Logger = require("./slack-logger.js");

const logger = new Logger();

const closeConnection = (database)=>{
    try{
    setTimeout(()=>{
        database.close();
    },10000);
    }
    catch{
        //error handle
    }
}

const ControlLoginRequest = async (req, res)=>{
    let browserData = Functions.getBrowerDatas(req);
    let ip = Functions.getIp(req);
        if (ip){
            const bannedUsersDatabase = new Database("banned");
            let bannedDatas =  await bannedUsersDatabase.collection.find({ip : ip}).toArray();
            if (bannedDatas && bannedDatas.length){
                for (let i = 0; i < bannedDatas.length; i++){
                    if (bannedDatas[i].time + 300000 > new Date().getTime()){
                        handleError(logger, "034", res);
                        return false;
                    }
                }
            }
            const {collection, database} = new Database("login-tried");
            userIps = await collection.find({ip : ip}).toArray();
            last5Min = [];
            for (let i = 0; i < userIps.length; i++){
                if (userIps[i].time + 300000 > new Date().getTime()){
                    last5Min.push(userIps[i]);
                }
            }
        
            if (last5Min.length > 3){
                handleError(logger,"034", res);
                await collection.deleteMany({ip : ip});
                closeConnection(database);
                await bannedUsersDatabase.collection.insertOne({ip : ip, browserData : browserData, time : new Date().getTime()});
                closeConnection(bannedUsersDatabase.database);
                return false;
                }
            else{
                collection.insertOne({ip : ip, browserData : browserData, time : new Date().getTime()});
                closeConnection(database)
                return true;
    }
    }
}

module.exports = ControlLoginRequest;