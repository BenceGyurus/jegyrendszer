const Database = require("./mongo/mongo.js");
const get_Events = async ()=>{
    let {collection, database} = new Database("events");
    datas = await collection.find().toArray();
    setTimeout(()=>{
        database.close();
    },10000);
}

module.exports = get_Events;