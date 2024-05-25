const otherData = require("./deitals");
const Functions = require("./functions");
const getEventByObjectId = require("./getEventByObjectId");
const Database = require("./mongo/mongo");

const createReport = async (startDate, endDate, justLocal, req)=>{
    const {collection, database} = new Database("buy");
    const eventDatabase = new Database("events");
    let report = await collection.find({$and : [{bought : true}, {pending : false}, {time : {$gte : startDate.getTime()}}, {time : {$lte : endDate.getTime()}}]}, {projection : {eventId : 1, fullPrice : 1, time : 1, tickets : 1, local : 1, id : 1}}).toArray();
    for (let i = 0; i < report.length; i++){
        let event ="";
        try{
            event = await eventDatabase.collection.findOne({_id : report[i].id}, {projection : {"eventData.name" : 1, "eventData.tickets" : 1}});
        }
        catch{
            event = false;
        }
        console.log(event);
        report[i].event = event ? event.eventData.name : "";
        if (event){
            for (let j = 0; j < report[i].tickets.length; j++){
                if (report[i].tickets[j].id){
                    report[i].tickets[j].ticketName = event.eventData.tickets.find(ticket=>String(ticket.id) === report[i].tickets[j].id);
                }
            }
    }
    }
    report.startDate = startDate;
    report.endDate = endDate;
    const reportDatabase = new Database("reports");
    id = (await reportDatabase.collection.insertOne({report : report, otherDatas : otherData(req, req.body.token)})).insertedId;
    Functions.closeConnection(reportDatabase.database);
    Functions.closeConnection(eventDatabase.database);
    Functions.closeConnection(database);
    console.log(report, id);
    return {report : report, id : String(id)}
 }

module.exports = createReport;