const { ObjectId } = require("mongodb");
const Database = require("./mongo/mongo.js");

const setStatus = async (id, status)=>{
    if (id){
        let {collection, database} = new Database("buying");
        collection.findOne()
        let data = await collection.updateOne({_id : new ObjectId(id)}, {$set : {status : status}});
        setTimeout(()=>{database.close()},10000);
    }
    else{
        return {error : true, errorCode : ""};
    }
}

module.exports = setStatus;