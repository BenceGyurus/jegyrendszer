const Database = require("./mongo/mongo.js");
const  { ObjectId } = require('mongodb');

const Control_Seats = async (list, ticketId, eventId)=>{
    let control = [false, true, true];
    let {collection, database} = new Database("events");
    let allTickets = await collection.find().toArray();
    let event;
    let price = 0;
    allTickets.forEach(element => {
        if (element.eventData.readable_event_name == eventId){
            event = element.eventData;
        }
    });
    event.tickets.forEach((element)=>{
        if (element.id == ticketId){
            control[0] = true;
            if (list && element.seats.length != 0){
                list.forEach((seat)=>{
                    if (!element.seats.includes(seat)){
                        control[1] = false;
                    }
                })
            }
            else if (!list && element.seats.length != 0){
                control[0] = false;
            }
        }
    })
    setTimeout(()=>{
        database.close();
    },10000);
    /*for (let i = 0; i < list.length; i++){
    }*/
    return control[0] && control[1] && control[2];
}

module.exports = Control_Seats;