const Database = require("./mongo/mongo.js");
const getTime = require("./getTime.js");
const getVenueFromId = require("./getVenue.js");
require("mongodb");
const { closeConnection } = require("./functions.js");

const controlEvent = async (eventId, ticketIds, thisEventId) => {
  // ticketIds is an Array
  let result = { error: false, errorCode: "" };
  if (eventId) {
    const { collection, database } = new Database("events");
    const buyingDatabase = new Database("buy");
    let boughtTickets = false;
    let eventDatas = await collection.findOne(
      {
        $and: [
          { "eventData.readable_event_name": eventId },
          { "eventData.objectDateOfRelease": { $lt: new Date() } },
          { "eventData.objectDateOfEvent": { $gt: new Date() } },
        ],
      },
      { projection: { "eventData.venue": 1, "eventData.tickets": 1 } },
    );
    closeConnection(database);
    try {
      boughtTickets = await buyingDatabase.collection
        .find({
          $and: [
            { id: eventDatas._id },
            {
              $or: [
                { bought: true },
                {
                  $and: [
                    { pending: true },
                    {
                      time: {
                        $gt: new Date().getTime() - getTime("RESERVATION_TIME"),
                      },
                    },
                  ],
                },
              ],
            },
          ],
        })
        .toArray();
      closeConnection(buyingDatabase.database);
    } catch {
      closeConnection(buyingDatabase.database);
      return { error: true, errorCode: "035" };
    }

    if (eventDatas) {
      let venue = await getVenueFromId(eventDatas.eventData.venue);
      let thisTicket = {};
      if (venue && ticketIds) {
        for (let i = 0; i < ticketIds.length; i++) {
          let ticketId = ticketIds[i];
          thisTicket = eventDatas.eventData.tickets.find(
            (eventTicket) => eventTicket.id === ticketId.ticketId,
          );
          if (
            thisTicket &&
            thisTicket.seats.length &&
            ticketId.places &&
            ticketId.places.length
          ) {
            ticketId.places.forEach((seat) => {
              if (
                !thisTicket.seats.includes(seat) ||
                !venue.seats.find((venueSeat) => {
                  return venueSeat.id === seat;
                })
              ) {
                result = { error: true, errorCode: "037" };
              }
              boughtTickets.forEach((boughtTicket) => {
                if (String(boughtTicket._id) != String(thisEventId)) {
                  if (
                    boughtTicket?.tickets
                      .find((ticket) => ticket.ticketId === thisTicket.id)
                      ?.places?.includes(seat)
                  ) {
                    result = { error: true, errorCode: "033" };
                  }
                }
              });
            });
          } else if (
            (!ticketId.places || !ticketId.places.length) &&
            thisTicket?.seats?.length
          ) {
            result = { error: true, errorCode: "036" };
          } else if (thisTicket) {
            let amountOfThisTicket = 0;
            boughtTickets.forEach((boughtTicket) => {
              if (String(boughtTicket._id) != String(thisEventId)) {
                let amount = boughtTicket.tickets.find(
                  (item) => item.ticketId === thisTicket.id,
                )?.amount;
                if (
                  typeof boughtTicket.tickets.find(
                    (item) => item.ticketId === thisTicket.id,
                  )?.amount != "number"
                )
                  amount = Number(
                    boughtTicket.tickets.find(
                      (item) => item.ticketId === thisTicket.id,
                    )?.amount,
                  );
                amountOfThisTicket += amount ? amount : 0;
              }
            });
            if (
              amountOfThisTicket + ticketId.amount >
              thisTicket.numberOfTicket
            )
              result = { error: true, errorCode: "038" };
          }
        }
      } else {
        return { error: true, errorCode: "032" };
      }
    }
  }
  return result;
};

module.exports = controlEvent;

/*



*/
