const getTicketByReadableId = require("./getTicketByReadableId.js");
const getTime = require("./getTime.js");
const Database = require("./mongo/mongo.js");

const closeConnection = (database)=>{
    setTimeout(()=>{
        database.close();
    },5000);
}


const getEventDatas = async (eventId)=>{
    let eventDatas = await getTicketByReadableId(eventId);
    if (eventDatas){
    if (eventDatas){
        for (let i = 0; i < eventDatas.tickets.length; i++){
            eventDatas.tickets[i].pendingPlaces = [];
            eventDatas.tickets[i].boughtPlaces = [];
            eventDatas.tickets[i].numberOfFreeTickets = eventDatas.tickets[i].numberOfTicket;
        }
    }
    const boughtDatabase = new Database("buy");
    let boughtDatas = await boughtDatabase.collection.find({$and : [{eventId : eventId}, {$or : [ {$and : [{ time : { $gt : new Date().getTime()-getTime("RESERVATION_TIME")} }, {pending : true}]}, {bought : true} ]}]}).toArray();
    console.log(boughtDatas);
    closeConnection(boughtDatabase.database)
    for (let i = 0; i < boughtDatas.length; i++){
            for (let j = 0; j < boughtDatas[i].tickets.length; j++){
                for (let k = 0; k < eventDatas.tickets.length; k++){
                    if (eventDatas.tickets[k].id == boughtDatas[i].tickets[j].ticketId && eventDatas.tickets[k].seats.length){
                        boughtDatas[i].bought ? eventDatas.tickets[k].boughtPlaces.push(...boughtDatas[i].tickets[j].places) : boughtDatas[i].pending ? eventDatas.tickets[k].pendingPlaces.push(...boughtDatas[i].tickets[j].places) : false;
                    }
                    if (boughtDatas[i].tickets[j].ticketId == eventDatas.tickets[k].id){
                        eventDatas.tickets[k].numberOfFreeTickets-=boughtDatas[i].tickets[j].amount
                    }
                }
        }
    }
    return eventDatas;}
    return false;
}


module.exports = getEventDatas;