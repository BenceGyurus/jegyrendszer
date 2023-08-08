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
          start : eventData.dateOfEvent,
          price : ticketData.price,
          seat : ticketData.seatName,
          title : eventData.name,
          local : ticketData.local,
          email_body : ""
        });
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${sysConfig["EMAIL_SERVER"]}/createCode`,
          headers: { 
              'Content-Type': 'application/json'
          },
          data : data
        };
        pdfs.push((await axios.request(config)).data);
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