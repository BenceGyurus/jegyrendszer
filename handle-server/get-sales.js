const { ObjectId } = require("mongodb");
const Database = require("./mongo/mongo");
const getTicketByReadableId = require("./getTicketByReadableId");
const getTime = require("./getTime");

const closeConnection = (database)=>{
    setTimeout(
        ()=>{
            try{
                database.close();
            }catch{}
        },
    10000
    );
}

const Sales = async (userId, external)=>{
    const eventDatabase = new Database("events");
    let events = await eventDatabase.collection.find({}, { projection : {eventData : 1}}).toArray();
    closeConnection(eventDatabase.database);
    let eventsOfUser = [];
    events.forEach(
        (event)=>{
            if (event.eventData && event.eventData.users && event.eventData.users.includes(userId)){
                eventsOfUser.push(event.eventData);
            }
        }
    );
    const salesDatabase = new Database("buy");
    let sales = await salesDatabase.collection.find({}).toArray();
    sendSales = [];
    closeConnection(salesDatabase.database);
    const usersDatabase = new Database("admin");
    const localCoupons = new Database("local-discount");
    const ticketsDatabase = new Database("coupons");
    let sale;
    for (let i = 0; i < sales.length; i++){
        sale = sales[i];
        if (eventsOfUser.find(event=>event.readable_event_name == sale.eventId)){
            let userName = "";
            let coupon = "";
            if (sale.local){
                userName = (await usersDatabase.collection.findOne({_id : ObjectId(sale.user._id)}, { projection : { username : 1, _id : 0 } })).username;
                coupon = sale.localCoupon ? (await localCoupons.collection.findOne({_id : ObjectId(sale.localCoupon)}, { projection : { name : 1 } })).name : "";
                
            }
            else{
                coupon = sale.coupon ? sale.coupon : "";
            }
            if (sale.bought && (!external || sale.user._id == userId)) sendSales.push({user : userName, coupon : coupon, price : sale.price, local : !!sale.local, tickets : sale.tickets, date : new Date(sale.time), fullPrice : sale.fullPrice, eventName : eventsOfUser.find(event=>event.readable_event_name == sale.eventId).name, eventId : sale.eventId, fullAmount : sale.fullAmount, buyId : sale._id, custormerName : sale.customerDatas ? `${sale.customerDatas.fistname} ${sale.customerDatas.lastname}` : "", cusotmerEmail : sale.customerDatas ? `${sale.customerDatas.mail}` : ""});
        };
    }
    closeConnection(ticketsDatabase.database);
    closeConnection(localCoupons.database);
    closeConnection(usersDatabase.database);
    return sendSales;
};

module.exports = Sales;