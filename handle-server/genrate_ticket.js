const Database = require("./mongo/mongo.js");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const createTicket = require("./ticket/createPdfTicket.js");
const { closeConnection } = require("./functions.js");

const readConfig = () => {
  try {
    let config = JSON.parse(
      fs.readFileSync(`${process.env.CONFIGDIR}/config.json`),
    );
    return config;
  } catch (err) {
    console.log("failed to read config file, check env variables");
  }
};

const createDateToJson = (date) => {
  date = new Date(date);
  return {
    h: date.getHours(),
    y: date.getFullYear(),
    d: date.getDate(),
    m: date.getMinutes(),
    month: date.getMonth(),
  };
};

const GenerateTicket = (ticketsIds) => {
  return new Promise(async (resolve, reject)=>{
    let sysConfig = readConfig();
  const ticketsDatabase = new Database("tickets");
  const saleDatabase = new Database("buy");
  const eventDatabse = new Database("events");
  let pdfs = [];
  for (let i = 0; i < ticketsIds.length; i++) {
    idOfTicket = ticketsIds[i];
    try {
      idOfTicket = new ObjectId(ticketsIds[i]);
    } catch {}
    ticketData = await ticketsDatabase.collection.findOne({ _id: idOfTicket });
    if (ticketData) {
      id = ticketData.eId;
      try {
        id = new ObjectId(id);
      } catch {}
      let eventData = (await eventDatabse.collection.findOne({ _id: id }))
        ?.eventData;
      if (eventData) {
        customerData = !eventData?.local
          ? await saleDatabase.collection.findOne({
              _id: ObjectId(ticketData.orderId),
            })
          : false;
        fs.writeFileSync(
          process.env.NODE_ENV === "production"
            ? `${sysConfig["TICKET_NODE_SHARE"]}/${String(ticketData._id)}.pdf`
            : `${__dirname}/${sysConfig["NODE_SHARE"]}/${String(ticketData._id)}.pdf`,
          await createTicket(
            eventData.name,
            ticketData.nameOfTicket,
            ticketData.price,
            String(ticketData._id),
            eventData.location,
            createDateToJson(eventData.dateOfEvent),
            createDateToJson(eventData.end_Of_The_Event),
            createDateToJson(eventData.gate_Opening),
            ticketData.seatName,
            eventData.wardrobe,
          ),
        );
      }
      pdfs.push(`${String(ticketData._id)}.pdf`);
    }
  }

  closeConnection(ticketsDatabase.database);
  closeConnection(saleDatabase.database);
  closeConnection(eventDatabse.database);
  resolve(pdfs);

  })
  
  /*.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});*/
};
module.exports = GenerateTicket;
