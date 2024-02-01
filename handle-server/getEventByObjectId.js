const { ObjectId } = require("mongodb");
const Database = require("./mongo/mongo");
const Functions = require("./functions");

const getEventByObjectId = async (id)=>{
    if (id){
        try{
            if (typeof id != "object") id = new ObjectId(id);
        }catch{
            console.log("ObjectId Couldn't be generated");
        }
        const {collection, database} = new Database("events");
        datas = await collection.findOne({_id : id}, {projection : {eventData : 1}})
        Functions.closeConnection(database);
        return datas;
    }
    else{
        return false;
    }
}

module.exports = getEventByObjectId;