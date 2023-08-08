const Database = require("./mongo/mongo.js");
const Functions = require("./functions.js");
const getNameOfSeat = require("./getNameOfSeat.js");

const closeConnection = (database)=>{
    setTimeout(()=>{
        database.close();
    }, 10000);
}

const Tickets = async (orderId, tickets, venue, eventId, local)=>{
    const {collection, database} = new Database("tickets");
    let ticketIds = [];
    for (let i = 0; i < tickets.length; i++){
        console.log(tickets[i])
        for (let j = 0; j < tickets[i].amount; j++){
            let nameOfSeat = "";
            if (tickets[i].places && tickets[i].places[j]){nameOfSeat = (await getNameOfSeat(venue, tickets[i].places[j])).name}
            ticketIds.push((await collection.insertOne({
                seatName : nameOfSeat,
                price : tickets[i].unitPrice,
                nameOfTicket : tickets[i].name,
                orderId : orderId,
                eventId : eventId,
                local : local,
                ticketId : tickets[i].ticketId
            })).insertedId);
        }
    }
    closeConnection(database);
    return ticketIds;
}

module.exports = Tickets;

