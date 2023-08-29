const axios = require('axios');
const Database = require("./mongo/mongo.js");
const { ObjectId } = require('mongodb');
const getTicketByReadableId = require('./getTicketByReadableId.js');
const fs = require("fs");

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
    let pdfs = [];
    for (let i = 0; i < ticketsIds.length; i++){
      ticketData = await ticketsDatabase.collection.findOne({_id : ObjectId(ticketsIds[i])});
      if (ticketData){
        eventData = await getTicketByReadableId(ticketData.eventId);
        customerData = !eventData.local ? await saleDatabase.collection.findOne({_id : ObjectId(ticketData.orderId)}) : false;
        data = JSON.stringify({
          id : String(ticketData._id),
          email : customerData ? customerData.mail : false,
          name : customerData ? customerData.name : false,
          location : eventData.location,
          start : createDateToJson(eventData.dateOfEvent),
          end : createDateToJson(eventData.end_Of_The_Event),
          open : createDateToJson(eventData.gate_Opening),
          wardrobe : eventData.wardrobe,
          price : ticketData.price,
          seat : ticketData.seatName,
          title : eventData.name,
          local : ticketData.local,
          nameOfTicket : ticketData.nameOfTicket,
          email_body : ""
        });
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${sysConfig["EMAIL_SERVER"]}/createCode`,
          headers: { 
              'Content-Type': 'application/json'
          },
          data : data,
          responseType: 'stream'
        };
        response = await axios.request(config)
        console.log(data);
        await saveFile(response);
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