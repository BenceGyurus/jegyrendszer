const { ObjectId } = require("mongodb");
const Database = require("./mongo/mongo");
const seatMatrixToArray = require("./seatMatrixToArray");
const { closeConnection } = require("./functions");

const getVenueFromId = async (id) => {
  const { collection, database } = new Database("venue");
  try {
    if (typeof id != "object") id = new ObjectId(id);
  } catch {}
  let datas = await collection.findOne(
    { _id: id },
    { projection: { _id: 1, "content.name": 1, "content.seats": 1 } },
  );
  closeConnection(database);
  if (datas && datas.content && datas.content.seats) {
    datas.content.seats = seatMatrixToArray(datas.content.seats).seats;
    datas = { _id: datas._id, ...datas.content };
  }
  return datas;
};

module.exports = getVenueFromId;
