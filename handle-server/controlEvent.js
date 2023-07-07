const Functions = require("./functions.js");
const Database = require("./mongo/mongo.js");
const getTicketId = require("./getTicketByReadableId.js");

const controlEvent = async (eventId, ticketIds, thisEventId)=>{ // ticketIds is an Array
    if (eventId){
        let eventDatas = await getTicketId(eventId);
        if (eventDatas.objectDateOfEvent.getTime() >= new Date().getTime()){
            let error = false;
            let {collection, database} = new Database("pre-buying");
            let preBuyingDatas = await collection.find().toArray();
            setTimeout(()=>{
                database.close();
            }, 10000);
            let pendingPlaces = [];
            let ticketAmount = {};
            for (let i = 0; i < preBuyingDatas.length; i++){
                ticketAmount[preBuyingDatas[i].eventId] = ticketAmount[preBuyingDatas[i].eventId] ? ticketAmount[preBuyingDatas[i].eventId] : {};
                if (preBuyingDatas[i].time+1800000 > new Date().getTime() && String(preBuyingDatas[i]._id) != String(thisEventId)){            //config prebuying active time
                    for (let k = 0; k < preBuyingDatas[i].tickets.length; k++){
                        if (preBuyingDatas[i].tickets[k].places){
                            pendingPlaces.push(...preBuyingDatas[i].tickets[k].places)
                        }
                        console.log(preBuyingDatas[i].tickets[k].ticketId);
                        ticketAmount[preBuyingDatas[i].eventId][preBuyingDatas[i].tickets[k].ticketId] = ticketAmount[preBuyingDatas[i].eventId][preBuyingDatas[i].tickets[k].ticketId]  ? ticketAmount[preBuyingDatas[i].eventId][preBuyingDatas[i].tickets[k].ticketId] + preBuyingDatas[i].tickets[k].amount : preBuyingDatas[i].tickets[k].amount;
                    }
                }
            }
            for (let i = 0; i < eventDatas.tickets.length; i++){
                for (let j = 0; j < ticketIds.length; j++){
                    if (eventDatas.tickets[i].id == ticketIds[j].ticketId){
                        for (let k = 0; k < pendingPlaces.length;k++){
                            for (let n = 0; n < ticketIds[j].places.length; n++){
                                if (!eventDatas.tickets[i].seats.length || eventDatas.tickets[i].seats.includes(ticketIds[i].places[n])){
                                    if (!pendingPlaces.includes(ticketIds[j].places[n])){
                                        console.log("OK!")
                                    }
                                    else{
                                        return {error : true, errorCode : "001"}       //Ez a hely már foglalt
                                    }
                                }
                                else{
                                    return {error : true, errorCode : "001"}           // A megadott hely nem található az adatbázisban
                                }
            
                            }
                        }
                        if (ticketAmount[eventDatas.readable_event_name] && ticketAmount[eventDatas.readable_event_name][eventDatas.tickets[i].id]+ticketIds[j].amount <= eventDatas.tickets[i].numberOfTicket){
                            console.log("OK!")
                        }
                        else{
                            return {error : true, errorCode : "031"}       //Erre a helyre már nem kapható jegy
                        }
                    }
                }
            }
            return {error : false, errorCode : "elv ok"};
        }
        else{
            return {error: true, errorCode : "001"}            //Az eseményre már nem, lehet jegyet vásárolni :c
        }
    }
    else{
        return {error : true, errorCode : "no eventId"};           //Váratlan hiba történt
    }
}

module.exports = controlEvent;