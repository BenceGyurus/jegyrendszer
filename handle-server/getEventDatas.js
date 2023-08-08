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
    let preBuyingDatabase = new Database("pre-buying");
    let preBuyingDatas = await preBuyingDatabase.collection.find({eventId : eventId}).toArray();
    closeConnection(preBuyingDatabase.database);
    for (let i = 0; i < eventDatas.tickets.length; i++){
        eventDatas.tickets[i].pendingPlaces = [];
        eventDatas.tickets[i].boughtPlaces = [];
        eventDatas.tickets[i].numberOfFreeTickets = eventDatas.tickets[i].numberOfTicket;
    }
    for (let i = 0; i < preBuyingDatas.length; i++){
        if (preBuyingDatas[i].time+getTime("RESERVATION_TIME") > new Date().getTime()){     //config prebuying active time
            for (let j = 0; j < preBuyingDatas[i].tickets.length;j++){
                for (let k = 0; k < eventDatas.tickets.length; k++){
                    if (preBuyingDatas[i].tickets[j].ticketId == eventDatas.tickets[k].id && eventDatas.tickets[k].seats.length){
                        eventDatas.tickets[k].pendingPlaces.push(...preBuyingDatas[i].tickets[j].places);
                    }
                    if (preBuyingDatas[i].tickets[j].ticketId == eventDatas.tickets[k].id){
                        eventDatas.tickets[k].numberOfFreeTickets-=preBuyingDatas[i].tickets[j].amount
                    }
                }
            }
        }
    }
    const boughtDatabase = new Database("buy");
    let boughtDatas = await boughtDatabase.collection.find({eventId : eventId}).toArray();
    closeConnection(boughtDatabase.database)
    for (let i = 0; i < boughtDatas.length; i++){
        if ((boughtDatas[i].pending && boughtDatas[i].time + getTime("RESERVATION_TIME") > new Date().getTime()) || boughtDatas[i].bought){       //config prebuying active time
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
    }
    return eventDatas;
}


module.exports = getEventDatas;