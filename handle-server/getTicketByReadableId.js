const Database = require("./mongo/mongo.js");

const getTicketByReadableId = async (id)=>{
    if (id){
        let {collection, database} = new Database("events");
        let tickets = (await collection.findOne({"eventData.readable_event_name" : id}))
        if  (tickets && tickets.eventData) {tickets = tickets.eventData}else {tickets = false};
        setTimeout(()=>{
            database.close();
        },10000);
        return tickets ? tickets : false;
    }
    return false;

}

module.exports = getTicketByReadableId;