const { ObjectId } = require("mongodb");
const Database = require("./mongo/mongo");
const getTime = require("./getTime.js");

const closeConnection = (database) => {
  try {
    setTimeout(() => {
      database.close();
    }, 10000);
  } catch {}
};

const statusOfPayment = async (id) => {
  try {
    if (typeof id != "object" && id) id = new ObjectId(id);
  } catch {}
  if (id) {
    const { collection, database } = new Database("buy");
    try {
      let data = await collection.findOne(
        { _id: id },
        {
          projection: {
            bought: 1,
            pending: 1,
            status: 1,
            paymentMethod: 1,
            time: 1,
          },
        },
      );
      if (
        data &&
        data.time &&
        new Date().getTime() - getTime("RESERVATION_TIME") < data.time
      )
        data.expired = false;
      else data.expired = true;
      closeConnection(database);
      return data;
    } catch {
      closeConnection(database);
      return false;
    }
  } else return false;
};

module.exports = statusOfPayment;
