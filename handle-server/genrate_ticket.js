const axios = require('axios');
const Database = require("./mongo/mongo.js");
const { ObjectId } = require('mongodb');
const getTicketByReadableId = require('./getTicketByReadableId.js');
const fs = require("fs");
const createTicket = require('./ticket/createPdfTicket.js');

const closeConnection = (database)=>{
  setTimeout(()=>{
    database.close();
  },10000);
};


const readConfig = () => {
  try {
    let config = JSON.parse(fs.readFileSync(`${process.env.CONFIGDIR}/config.json`));
    return config;
  }catch(err){
      console.log('failed to read config file, check env variables');
  }
}

const saveFile = (response)=>{
  let sysConfig = readConfig();
  return new Promise((resolve, reject)=>{
    const fileStream = fs.createWriteStream(`${__dirname}/${sysConfig['NODE_SHARE']}/${String(ticketData._id)}.pdf`);
            response.data.pipe(fileStream);
            fileStream.on('finish', () => {
              resolve()
              console.log('File downloaded successfully');
            });
            fileStream.on('error', err => {
              reject
              console.error('Error saving file:', err.message);
            });
  });
}

const createDateToJson = (date)=>{
  date = new Date(date);
  return { 
    h : date.getHours(),
    y : date.getFullYear(),
    d : date.getDate(),
    m : date.getMinutes(),
    month : date.getMonth()
  }
}

const GenerateTicket = async (ticketsIds)=>{
    let sysConfig = readConfig();
    const ticketsDatabase = new Database("tickets");
    const saleDatabase = new Database("buy");
    const eventDatabse = new Database("events");
    let pdfs = [];
    for (let i = 0; i < ticketsIds.length; i++){
      idOfTicket = ticketsId;
      try{
        idOfTicket = new ObjectId(ticketsIds[i]);
      }
      catch{}
      ticketData = await ticketsDatabase.collection.findOne({_id : idOfTicket});
      console.log(ticketData);
      if (ticketData){
        const buyDatabase = new Database("buy");
        id = ticketData.eId;
        try{
          id = new ObjectId(id);
        }
        catch{}
        let eventData = (await eventDatabse.collection.findOne({_id : id}))?.eventData;
        closeConnection(buyDatabase.database);
        if(eventData){
          customerData = !eventData?.local ? await saleDatabase.collection.findOne({_id : ObjectId(ticketData.orderId)}) : false;
          fs.writeFileSync(`${__dirname}/${sysConfig['NODE_SHARE']}/${String(ticketData._id)}.pdf`, await createTicket(eventData.name, ticketData.nameOfTicket, ticketData.price, String(ticketData._id), eventData.location, createDateToJson(eventData.dateOfEvent), createDateToJson(eventData.end_Of_The_Event), createDateToJson(eventData.gate_Opening), ticketData.seatName, eventData.wardrobe));
        }
        pdfs.push(`${String(ticketData._id)}.pdf`);

      }
    }

    closeConnection(ticketsDatabase.database);
    closeConnection(saleDatabase.database);
    return pdfs;

    


/*.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});*/

}
module.exports = GenerateTicket;