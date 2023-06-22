const Database = require("./mongo/mongo.js");

const getTicketByReadableId = async (id)=>{
    if (id){
        let {collection} = new Database("events");
        let tickets = await collection.find().toArray();
        if (tickets.length){
            for (let i = 0; i < tickets.length; i++){
                if (tickets[i].eventData && tickets[i].eventData.readable_event_name == id){
                    return tickets[i].eventData;
                }
            }
        }
    }

}

module.exports = getTicketByReadableId;