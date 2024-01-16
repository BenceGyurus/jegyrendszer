const { ObjectId } = require("mongodb");
const Database = require("./mongo/mongo");
const seatMatrixToArray = require("./seatMatrixToArray");

const closeConnection = (database)=>{
    setTimeout(()=>{
        try{
            database.close();
        }
        catch{}
    },10000);
}

const getVenueFromId = async (id)=>{
    const {collection, database} = new Database("venue");
    if (collection){
        try{
            id = new ObjectId(id);
        }catch{}
        let datas = await collection.findOne({_id : id}, {projection : { _id : 1, "content.name" : 1, "content.seats" : 1 }});
        if (datas && datas.content && datas.content.seats){
            datas.content.seats = seatMatrixToArray(datas.content.seats);
            datas = {_id : datas._id, ...datas.content};
        }
        closeConnection(database);
        return datas;
    } 
    else{
        closeConnection(database);
        return {error : true};
    }
}

module.exports = getVenueFromId