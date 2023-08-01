const getTime = require("./getTime.js");
const Database = require("./mongo/mongo.js");


const closeConnection = (database)=>{
    try{
        database.close();
    }
    catch{}
}

const sumTickets = (tickets)=>{
    let amount = 0;
    for (let i = 0; i < tickets.length; i++){
        amount += tickets[i].amount;
    }
    return amount;
}

const getStatOfEvent = async (id)=>{
    if (id){
        let {collection, database} = new Database("pre-buying");
        let eventStats = await collection.find({eventId : id}).toArray();
        closeConnection(database);
        let datas = [];
        for (let i = 0; i < eventStats.length; i++){
            if (eventStats[i].time + getTime("RESERVATION_TIME") > new Date().getTime()){          //config prebuying active time
                datas.push({
                    date : new Date(eventStats[i].time),
                    fullPrice : eventStats[i].fullPrice,
                    amount : eventStats[i].fullAmount,
                    bought : false,
                    tickets : eventStats[i].tickets
                });
            }
        }
        let buyingDatabase = new Database("buy");
        let boughtDatas = await buyingDatabase.collection.find({eventId : id}).toArray();
        for (let i = 0; i < boughtDatas.length; i++){
            if ((boughtDatas[i].pending && boughtDatas[i].time + getTime("RESERVATION_TIME") > new Date().getTime()) || (boughtDatas[i].bought))            //config prebuying active time
            datas.push({
                date : new Date(boughtDatas[i].time),
                fullPrice : boughtDatas[i].fullPrice,
                amount : sumTickets(boughtDatas[i].tickets),
                tickets : boughtDatas[i].tickets,
                bought : boughtDatas[i].bought
            })
        } 
        closeConnection(buyingDatabase.database);
        return datas;
    }
}

const getFullNumberOfTickets = (tickets)=>{
    if (tickets){
        let numberOfTickets = 0;
        tickets.forEach(element => {
            numberOfTickets+=element.numberOfTicket;
        });
        return numberOfTickets;
    }
    else{
        return 0;
    }
}

const getStatsOfEvents = async ()=>{
    let {collection, database} = new Database("events");
    let eventDatas = await collection.find().toArray();
    let sendDatas = [];
    for (let i = 0; i < eventDatas.length; i++){
        sendDatas.push({numberOfTickets : getFullNumberOfTickets(eventDatas[i].eventData.tickets) ,id : eventDatas[i].eventData.readable_event_name ,eventName : eventDatas[i].eventData.name, image : eventDatas[i].eventData.background, datas : await getStatOfEvent(eventDatas[i].eventData.readable_event_name)});
    }
    closeConnection(database);
    return sendDatas;
}

module.exports = getStatsOfEvents;