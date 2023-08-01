const { ObjectId } = require("mongodb");
const Database = require("./mongo/mongo.js");


const closeConnection = (database)=>{
    try{
        setTimeout(()=>{
            database.close
        },10000);
    }catch{};
}

const getNameOfSeat = async (venueId, seatId)=>{
    const {collection, database} = new Database("venue");
    let venueDatas = (await collection.findOne({_id : ObjectId(venueId)}, {projection : {content : 1}})).content;
    closeConnection(database);
    if (venueDatas.seatsDatas && venueDatas.seatsDatas.length){
        return venueDatas.seatsDatas.find(seat=>seat.id == seatId);
    }
    return false;
}

module.exports = getNameOfSeat;