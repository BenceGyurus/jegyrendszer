const Functions = require("./functions.js");
const Database = require("./mongo/mongo.js");
const getTicketId = require("./getTicketByReadableId.js");
const getTime = require("./getTime.js");

const closeConnection = (database)=>{
    setTimeout(()=>{
        database.close();
    },10000);
}

const controlEvent = async (eventId, ticketIds, thisEventId)=>{ // ticketIds is an Array
    if (eventId){
        let eventDatas = await getTicketId(eventId);
        if (eventDatas.objectDateOfEvent.getTime() >= new Date().getTime()){
            let pendingPlaces = [];
            let ticketAmount = {};
            let boughtDatabase = new Database("buy");
            let boughtDatas = await boughtDatabase.collection.find({ $and : [ {$or : [{$and : [{pending : true}, { time : { $gt : new Date().getTime()-getTime("RESERVATION_TIME")}}]}, {$and : [{bought : true}, {pending : false}]}]}, {_id : { $ne : thisEventId }} ]}).toArray();
            closeConnection(boughtDatabase.database)
            for (let i = 0; i < boughtDatas.length; i++){
                    ticketAmount[boughtDatas[i].eventId] = ticketAmount[boughtDatas[i].eventId] ? ticketAmount[boughtDatas[i].eventId] : {};
                    for (let j = 0; j < boughtDatas[i].tickets.length; j++){
                        if (boughtDatas[i].tickets[j].places){
                            pendingPlaces.push(...boughtDatas[i].tickets[j].places);
                        }
                        ticketAmount[boughtDatas[i].eventId][boughtDatas[i].tickets[j].ticketId] = ticketAmount[boughtDatas[i].eventId][boughtDatas[i].tickets[j].ticketId] ? ticketAmount[boughtDatas[i].eventId][boughtDatas[i].tickets[j].ticketId] + boughtDatas[i].tickets[j].amount : boughtDatas[i].tickets[j].amount
                }
            }
            for (let i = 0; i < eventDatas.tickets.length; i++){
                for (let j = 0; j < ticketIds.length; j++){
                    if (eventDatas.tickets[i].id == ticketIds[j].ticketId){
                        if (eventDatas.tickets[i].seats.length && !ticketIds[j].places.length) return {error : true, errorCode : "036"}
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
                        if (ticketAmount[eventDatas.readable_event_name] && Object.keys(ticketAmount[eventDatas.readable_event_name]).includes([eventDatas.tickets[i].id]) && !(ticketAmount[eventDatas.readable_event_name][eventDatas.tickets[i].id]+ticketIds[j].amount <= eventDatas.tickets[i].numberOfTicket)){
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