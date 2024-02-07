const { closeConnection } = require("./functions.js");
const Database = require("./mongo/mongo.js");

const getTicketByReadableId = async (id) => {
  if (id) {
    let { collection, database } = new Database("events");
    let tickets = await collection.findOne({
      "eventData.readable_event_name": id,
    });
    if (tickets && tickets.eventData) {
      tickets.eventData.id = tickets._id;
      tickets = tickets.eventData;
    } else {
      tickets = false;
    }
    closeConnection(database);
    return tickets ? tickets : false;
  }
  return false;
};

module.exports = getTicketByReadableId;
