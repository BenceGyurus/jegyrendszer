const Functions = require("./functions.js");
const Database = require("./mongo/mongo.js");
const getTicketId = require("./getTicketByReadableId.js");

const closeConnection = (database)=>{
    setTimeout(()=>{
        database.close();
    },10000);
}

const controlEvent = async (eventId, ticketIds, thisEventId)=>{ // ticketIds is an Array
    if (eventId){
        let eventDatas = await getTicketId(eventId);
        if (eventDatas.objectDateOfEvent.getTime() >= new Date().getTime()){
            let {collection, database} = new Database("pre-buying");
            let preBuyingDatas = await collection.find().toArray();
            closeConnection(database);
            let pendingPlaces = [];
            let ticketAmount = {};
            for (let i = 0; i < preBuyingDatas.length; i++){
                if (preBuyingDatas[i].time+1800000 > new Date().getTime() && String(preBuyingDatas[i]._id) != String(thisEventId)){            //config prebuying active time
                    ticketAmount[preBuyingDatas[i].eventId] = ticketAmount[preBuyingDatas[i].eventId] ? ticketAmount[preBuyingDatas[i].eventId] : {};
                    for (let k = 0; k < preBuyingDatas[i].tickets.length; k++){
                        if (preBuyingDatas[i].tickets[k].places){
                            pendingPlaces.push(...preBuyingDatas[i].tickets[k].places);
                        }
                        ticketAmount[preBuyingDatas[i].eventId][preBuyingDatas[i].tickets[k].ticketId] = ticketAmount[preBuyingDatas[i].eventId][preBuyingDatas[i].tickets[k].ticketId]  ? ticketAmount[preBuyingDatas[i].eventId][preBuyingDatas[i].tickets[k].ticketId] + preBuyingDatas[i].tickets[k].amount : preBuyingDatas[i].tickets[k].amount;
                    }
                }
            }
            let boughtDatabase = new Database("buy");
            let boughtDatas = await boughtDatabase.collection.find().toArray();
            closeConnection(boughtDatabase.database)
            for (let i = 0; i < boughtDatas.length; i++){
                if ((boughtDatas[i].pending && boughtDatas[i].time+1800000 > new Date().getTime()) || boughtDatas[i].bought){
                    ticketAmount[boughtDatas[i].eventId] = ticketAmount[boughtDatas[i].eventId] ? ticketAmount[boughtDatas[i].eventId] : {};
                    for (let j = 0; j < boughtDatas[i].tickets.length; j++){
                        if (boughtDatas[i].tickets[j].places){
                            pendingPlaces.push(...boughtDatas[i].tickets[j].places);
                        }
                        ticketAmount[boughtDatas[i].eventId][boughtDatas[i].tickets[j].ticketId] = ticketAmount[boughtDatas[i].eventId][boughtDatas[i].tickets[j].ticketId] ? ticketAmount[boughtDatas[i].eventId][boughtDatas[i].tickets[j].ticketId] + boughtDatas[i].tickets[j].amount : boughtDatas[i].tickets[j].amount
                    }
                }
            }
            for (let i = 0; i < eventDatas.tickets.length; i++){
                for (let j = 0; j < ticketIds.length; j++){
                    if (eventDatas.tickets[i].id == ticketIds[j].ticketId){
                        for (let n = 0; n < ticketIds[j].places.length; n++){
                            if (eventDatas.tickets[i].seats.length && eventDatas.tickets[i].seats.includes(ticketIds[j].places[n])){
                                if (pendingPlaces.includes(ticketIds[j].places[n])){
                                    return {error : true, errorCode : "033"};
                                }
                            }
                            else if (!eventDatas.tickets[i].seats.includes(ticketIds[i].places[n])){
                                return {error : true, errorCode : "001"};           // A megadott hely nem található az adatbázisban
                            }
            
                            }
                        if (preBuyingDatas.length && ticketAmount[eventDatas.readable_event_name] && Object.keys(ticketAmount[eventDatas.readable_event_name]).includes([eventDatas.tickets[i].id]) && !(ticketAmount[eventDatas.readable_event_name][eventDatas.tickets[i].id]+ticketIds[j].amount <= eventDatas.tickets[i].numberOfTicket)){
                            return {error : true, errorCode : "031"};       //Erre a helyre már nem kapható jegy
                        }
                        else{
                            
                        }
                    }
                }
            }
            return {error : false, errorCode : ""};
        }
        else{
            return {error: true, errorCode : "032"}            //Az eseményre már nem, lehet jegyet vásárolni :c
        }
    }
    else{
        return {error : true, errorCode : "no eventId"};           //Váratlan hiba történt
    }
}

module.exports = controlEvent;