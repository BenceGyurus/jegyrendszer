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
    index = 0;
    for (let k = 0; k < tickets[i].types.length; k++){
      for (let j = 0; j < tickets[i].types[k].amount; j++){
        let nameOfSeat = "";
        if (tickets[i].places && tickets[i].places[index]) {
          nameOfSeat = (await getNameOfSeat(venue, tickets[i].places[index])).name;
        }
        ticketIds.push(
          (
            await collection.insertOne({
              seatName: nameOfSeat,
              seatId: tickets[i].places[index],
              price: invited ? 0 : tickets[i].types[k].unitPrice,
              nameOfTicket: tickets[i].types[k].name,
              orderId: orderId,
              eventId: eventId,
              local: local,
              ticketId: tickets[i].ticketId,
              typeId : tickets[i].types[k].id,
              eId: id,
              invited: invited,
            })
          ).insertedId,
        );
        index++;
      }
      }
  }
  Functions.closeConnection(database);
  return ticketIds;
};

module.exports = Tickets;
