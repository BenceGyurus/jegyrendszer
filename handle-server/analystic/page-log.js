const { ObjectId } = require("mongodb");
const Database = require("../mongo/mongo");
const getActiveEventIds = require("./activeEvents")


const closeDatabase = (database)=>{
    try{
        setTimeout(()=>{
            database.close();
        }, 10000);
    }catch{

    }
}


const pageLog = async (fromDate, toDate, event)=>{
    let activeEvents = await getActiveEventIds();
    try{
        if (event) event = ObjectId(event);
    }catch{};
    const {collection, database} = new Database("log");
    const eventsDatabase = new Database("events");
    closeDatabase(database);
    conditions  = [];
    if (fromDate) conditions.push({time : {$gt : new Date(fromDate)}});
    if (toDate) conditions.push({time : {$lt : new Date(toDate)}});
    if (event) conditions.push({event : event});
    let counted = (await collection.aggregate([
        {
            $match : {
                $and : [
                    {event : {$in : activeEvents}},
                    ...conditions
                ]
            }   
        },
        {
            $group: {
              _id: "$event",
              tokens: { $addToSet: "$token" },
              totalTokens: { $sum: 1 }
            }
          },
          {
            $unwind: "$tokens"
          },
          {
            $group: {
              _id: {
                event: "$_id",
                token: "$tokens"
              },
              count: { $sum: 1 }
            }
          },
          {
            $group: {
              _id: "$_id.event",
              tokens: {
                $push: {
                  token: "$_id.token",
                  count: "$count"
                }
              },
              totalTokens: { $sum: "$count" }
            }
          },
          {
            $project: {
              _id: 1,
              tokens: 1,
              totalTokens: 1
            }
          } 
    ]).toArray());
    let sendData = [];
    for (let i = 0; i < counted.length; i++){
        let id = counted[i]._id
        try{
            if (typeof id === "string") id = ObjectId(id);
        }catch{}
        sendData.push({number : counted[i].totalTokens,event : (await eventsDatabase?.collection?.findOne({_id : id}, {projection : { _id : 0, "eventData.name" : 1, "eventData.background" : 1, "eventData.readable_event_name" : 1, "eventData.location" : 1 }}))?.eventData});
    }
    closeDatabase(eventsDatabase.database);
    return sendData;
}

module.exports = pageLog;


/*
{
            $group: {
              _id: "$event",
              tokens: { $addToSet: "$token" },
              totalTokens: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 1,
              tokens: 1,
              totalTokens: 1
            }
          }*/