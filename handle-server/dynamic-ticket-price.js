const getEventDatas = require("./getEventDatas.js");
const Database = require("./mongo/mongo.js");

const dateIndicator = ()=>{

}


const closeConnection = (database)=>{
    setTimeout(()=>{
        try{
            database.close();
        }
        catch{
    
        }
    },10000);
}

const getPriceOfTicket = async (eventId, ticketId)=>{
    console.log("getPriceOfTicket", eventId, ticketId);
    if (eventId){
        let eventDatas = await getEventDatas(eventId);
        if (eventDatas){
            const boughtDatabase = new Database("buy");
            let boughtDatas = await boughtDatabase.collection.find({eventId : eventId}).toArray();
            closeConnection(boughtDatas.database);
            numberOfTickets = 0;
            dateOfTickets = [];
            for (let i = 0; i < boughtDatas.length; i++){
                if (boughtDatas[i].tickets){
                    for (let j = 0; j < boughtDatas[i].tickets.length; j++){
                        if (boughtDatas[i].tickets[j].ticketId == ticketId && boughtDatas[i].bought){
                            numberOfTickets+=boughtDatas[i].tickets[j].amount;
                            dateOfTickets.push(new Date(boughtDatas[i].time));
                        }
                    }
                }
            }
        }
}
}

module.exports = getPriceOfTicket;