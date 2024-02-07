const { ObjectId } = require("mongodb");
const getVenueFromId = require("./getVenue.js");

const getNameOfSeat = async (venueId, seatId) => {
  try {
    venueId = ObjectId(venueId);
  } catch {}
  let venueDatas = await getVenueFromId(venueId);
  //let venueDatas = (await collection.findOne({_id : ObjectId(venueId)}, {projection : {content : 1}})).content;
  if (venueDatas.seats && venueDatas.seats.length) {
    return venueDatas.seats.find((seat) => String(seat.id) == String(seatId));
  }
  return false;
};

module.exports = getNameOfSeat;
