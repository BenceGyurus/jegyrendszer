const getTicketByReadableId = require("./getTicketByReadableId.js");
const Database = require("./mongo/mongo.js");

const getEventDatas = async (eventId)=>{
    let eventDatas = await getTicketByReadableId(eventId);
    let preBuyingDatabase = new Database("pre-buying");
    let preBuyingDatas = await preBuyingDatabase.collection.find({eventId : eventId}).toArray();
    setTimeout(()=>{
        preBuyingDatabase.database.close();
    },10000);
    for (let i = 0; i < eventDatas.tickets.length; i++){
        eventDatas.tickets[i].pendingPlaces = [];
        eventDatas.tickets[i].numberOfFreeTickets = eventDatas.tickets[i].numberOfTicket;
    }
    eventDatas.allPendingPlaces = [];
    for (let i = 0; i < preBuyingDatas.length; i++){
        if (preBuyingDatas[i].time+1800000 > new Date().getTime()){     //config prebuying active time
            for (let j = 0; j < preBuyingDatas[i].tickets.length;j++){
                for (let k = 0; k < eventDatas.tickets.length; k++){
                    console.log(preBuyingDatas[i].tickets[j].ticketId, eventDatas.tickets[k].id);
                    if (preBuyingDatas[i].tickets[j].ticketId == eventDatas.tickets[k].id && eventDatas.tickets[k].seats.length){
                        eventDatas.tickets[k].pendingPlaces.push(...preBuyingDatas[i].tickets[j].places);
                        eventDatas.allPendingPlaces.push(...preBuyingDatas[i].tickets[j].places);
                    }
                    if (preBuyingDatas[i].tickets[j].ticketId == eventDatas.tickets[k].id){
                        eventDatas.tickets[k].numberOfFreeTickets-=preBuyingDatas[i].tickets[j].amount
                    }
                }
            }
        }
    }
    return eventDatas;
}


module.exports = getEventDatas;