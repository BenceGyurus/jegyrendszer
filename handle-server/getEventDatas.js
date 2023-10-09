const getTicketByReadableId = require("./getTicketByReadableId.js");
const getTime = require("./getTime.js");
const Database = require("./mongo/mongo.js");

const closeConnection = (database)=>{
    setTimeout(()=>{
        database.close();
    },5000);
}


const getEventDatas = async (eventId)=>{
    let {collection, database} = new Database("events");
    let eventDatas = (await collection.findOne({"eventData.readable_event_name" : eventId}))
    if (eventDatas){
    if (eventDatas && eventDatas.eventData){
        for (let i = 0; i < eventDatas.eventData.tickets.length; i++){
            eventDatas.eventData.tickets[i].pendingPlaces = [];
            eventDatas.eventData.tickets[i].boughtPlaces = [];
            eventDatas.eventData.tickets[i].numberOfFreeTickets = eventDatas.eventData.tickets[i].numberOfTicket;
        }
    }
    const boughtDatabase = new Database("buy");
    let boughtDatas = await boughtDatabase.collection.find({$and : [{id : eventDatas._id}, {$or : [ {$and : [{ time : { $gt : new Date().getTime()-getTime("RESERVATION_TIME")} }, {pending : true}]}, {bought : true} ]}]}).toArray();
    console.log(boughtDatas);
    closeConnection(boughtDatabase.database)
    closeConnection(database);
    for (let i = 0; i < boughtDatas.length; i++){
            for (let j = 0; j < boughtDatas[i].tickets.length; j++){
                for (let k = 0; k < eventDatas.eventData.tickets.length; k++){
                    if (eventDatas.eventData.tickets[k].id == boughtDatas[i].tickets[j].ticketId && eventDatas.eventData.tickets[k].seats.length){
                        boughtDatas && boughtDatas[i].bought && boughtDatas[i].tickets && boughtDatas[i].tickets[j] && boughtDatas[i].tickets[j] && boughtDatas[i].tickets[j].places && boughtDatas[i].tickets[j].places.length ? eventDatas.eventData.tickets[k].boughtPlaces.push(...boughtDatas[i].tickets[j].places) : boughtDatas[i].pending ? eventDatas.eventData.tickets[k].pendingPlaces.push(...boughtDatas[i].tickets[j].places) : false;
                    }
                    if (boughtDatas[i].tickets[j].ticketId == eventDatas.eventData.tickets[k].id){
                        eventDatas.eventData.tickets[k].numberOfFreeTickets-=boughtDatas[i].tickets[j].amount
                    }
                }
        }
    }
    return {id : eventDatas._id,...eventDatas.eventData};}
    return false;
}


module.exports = getEventDatas;