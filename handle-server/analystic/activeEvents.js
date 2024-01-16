const Database = require("../mongo/mongo");

const closeDatabase = (database)=>{
    try{
        setTimeout(()=>{
            database.close();
        }, 10000);
    }catch{

    }
}

const getActiveEventIds = async ()=>{
    const {collection, database} = new Database("events");
    let inObject =  await collection.find({$and : [{"eventData.objectDateOfEvent" : {$gt : new Date()}}, {"eventData.objectDateOfRelease" : {$lt : new Date()}}]}, {projection : {_id : 1}}).toArray();
    closeDatabase(database);
    return inObject?.map(event=>{return event?._id});
}

module.exports = getActiveEventIds;
