const { ObjectId } = require("mongodb");
const Database = require("./mongo/mongo.js");
const getVenueFromId = require("./getVenue.js");


const closeConnection = (database)=>{
    try{
        setTimeout(()=>{
            database.close
        },10000);
    }catch{};
}

const getNameOfSeat = async (venueId, seatId)=>{
    const {collection, database} = new Database("venue");
    try{
        venueId = ObjectId(venueId);
    }
    catch{}
    let venueDatas = await getVenueFromId(venueId);
    console.log(venueDatas, seatId);
    //let venueDatas = (await collection.findOne({_id : ObjectId(venueId)}, {projection : {content : 1}})).content;
    closeConnection(database);
    if (venueDatas.seats && venueDatas.seats.length){
        return venueDatas.seats.find(seat=>seat.id == seatId);
    }
    return false;
}

module.exports = getNameOfSeat;