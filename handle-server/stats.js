const getTicketByReadableId = require("./getTicketByReadableId");
const Database = require("./mongo/mongo");

const closeDatabase = (database)=>{
    try{
        setTimeout(()=>{
            database.close();
        }, 10000);
    }catch{

    }
}

const statsMiddleware = async (req,res, next)=>{
    let {collection, database} = new Database("log");
    var event = {};
    if (req?.params?.id){
        event = await getTicketByReadableId(req.params.id);
    }
    await collection.insertOne({event : event.id, time : new Date(), token : req?.cookies?.token});
    closeDatabase(database);
    next();
}

module.exports = statsMiddleware;