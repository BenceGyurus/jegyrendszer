const Database = require("./mongo/mongo.js");
const Functions = require("./functions.js");
const getTicketByReadableId = require("./getTicketByReadableId.js");
const getTime = require("./getTime.js");

const closeConnection = (databse)=>{
    setTimeout(()=>{
        try{
            databse.close();
        }
        catch{

        }
    },10000);
}

const getAllTicketsArray = async (eventId)=>{
    const {collection, database} = new  Database("buy");
    let buyingTickets = await collection.find({eventId : eventId}).toArray();
    let pendingPlaces = [];
    let occupiedPlaces = [];
    let numberOfFreePlaces = [];
    if (buyingTickets){
        for (let i = 0; i < buyingTickets.length; i++){
            for (let j = 0; j < buyingTickets[i].tickets.length; j++){
                if (buyingTickets[i].tickets[j].places.length){
                    !buyingTickets[i].pending && buyingTickets[i].bought ? occupiedPlaces.push(...buyingTickets[i].tickets[j].places) : buyingTickets[i].pending && !buyingTickets[i].bought && buyingTickets[i].time + getTime("RESERVATION_TIME") > new Date().getTime() ? pendingPlaces.push(...buyingTickets[i].tickets[j].places) : false;
                }
            }
        }
    }
    closeConnection(database);
    const pendingPlacesDatabse = new Database("pre-buying");
    let pendingPlacesDatas = await pendingPlacesDatabse.collection.find({eventId : eventId}).toArray();
    if (pendingPlacesDatas){
        for (let i = 0; i < pendingPlacesDatas.length; i++){
            for (let j = 0; j < pendingPlacesDatas[i].tickets.length; j++){
                if (pendingPlacesDatas[i].tickets[j].places.length){
                    pendingPlaces.push(...pendingPlacesDatas[i].tickets[j].places)
                }
            }
        }
    }
    closeConnection(pendingPlacesDatabse.database);
    return {
        pending : pendingPlaces,
        occupied : occupiedPlaces
    }
}

const GetOccupiedPlaces = async (eventId)=>{
    return await getAllTicketsArray(eventId);
}

module.exports = GetOccupiedPlaces;