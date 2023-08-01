const { ObjectId } = require("mongodb");
const Database = require("./mongo/mongo.js");
const getTicketByReadableId = require("./getTicketByReadableId.js");

const closeConnection = (database)=>{
    try{
        setTimeout(()=>{
            database.close()
        },10000);
    }
    catch{}
}

const controlLocalDiscount = async (id, price, eventId)=>{
    if (id && price){
        let eventDatas = await getTicketByReadableId(eventId);
        if (eventDatas && eventDatas.localDiscounts){
            const {collection , database} = new Database("local-discount");
            let couponDatas = await collection.findOne({_id : ObjectId(id)});
            closeConnection(database);
            if (couponDatas && couponDatas.amount){
                return couponDatas.money ? price>couponDatas.amount ? price-couponDatas.amount : 0 : price - price*(couponDatas.amount/100);
            }
        }
        
    }
    return price;
}

module.exports = controlLocalDiscount;