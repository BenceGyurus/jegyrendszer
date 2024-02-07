const Database = require("./mongo/mongo.js");
const Functions = require("./functions.js");
const getNameOfSeat = require("./getNameOfSeat.js");

const Tickets = async (
  orderId,
  tickets,
  venue,
  eventId,
  local,
  id,
  invited,
) => {
  const { collection, database } = new Database("tickets");
  let ticketIds = [];
  for (let i = 0; i < tickets.length; i++) {
    for (let j = 0; j < tickets[i].amount; j++) {
      let nameOfSeat = "";
      if (tickets[i].places && tickets[i].places[j]) {
        nameOfSeat = (await getNameOfSeat(venue, tickets[i].places[j])).name;
        console.log(nameOfSeat);
      }
      ticketIds.push(
        (
          await collection.insertOne({
            seatName: nameOfSeat,
            seatId: tickets[i].places[j],
            price: invited ? 0 : tickets[i].unitPrice,
            nameOfTicket: tickets[i].name,
            orderId: orderId,
            eventId: eventId,
            local: local,
            ticketId: tickets[i].ticketId,
            eId: id,
            invited: invited,
          })
        ).insertedId,
      );
    }
  }
  Functions.closeConnection(database);
  return ticketIds;
};

module.exports = Tickets;
