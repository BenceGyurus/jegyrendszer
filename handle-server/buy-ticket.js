const { ObjectId } = require("mongodb");
const Database = require("./mongo/mongo.js");
const getTime = require("./getTime.js");

const setStatus = async (id, status)=>{
    if (id){
        let {collection, database} = new Database("buy");
        collection.findOne()
        let pedding = status != "FINISHED";
        let bought = status == "FINISHED"
        let data = await collection.updateOne({_id : new ObjectId(id)}, {$set : {status : status, pedding : pedding, bought : bought}});
        setTimeout(()=>{database.close()},10000);
    }
    else{
        return {error : true, errorCode : ""};
    }
}

module.exports = setStatus;