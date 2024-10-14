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

const Sales = async (userId, external, page, limit, search, filters, pagination)=>{
    const eventDatabase = new Database("events");
    let events = await eventDatabase.collection.find({ "eventData.users" :  userId }, { projection : {eventData : 1}}).toArray();
    closeConnection(eventDatabase.database);
    let eventsOfUser = [];
    events.forEach(
        (event)=>{
            if (event.eventData && event.eventData.users && event.eventData.users.includes(userId)){
                eventsOfUser.push(event._id);
            }
        }
    );
    const salesDatabase = new Database("buy");
    const skipValue = (page - 1) * limit;
    let conditions = []
    try{
        userId = ObjectId(userId);
    }
    catch{
        console.log("UserId couldn't be created ObjectId")
    }
    if (external) conditions.push( { "otherDatas.userData.userId" : userId } );
    let eventsDatabase = new Date("events");
    let nameIdsObject = await eventDatabase.collection.find({"eventData.name" : {$regex: new RegExp(search, 'i')}}, {projection : {_id : 1}}).toArray();
    let nameIds = [];
    nameIdsObject.forEach(item=>{
        nameIds.push(item._id);
    });
    //let localFilter = filters.web && filters.local ? {} : filters.web ? {local : false} : filters.local ? {local : true} : { $or : [{local : true }, {local : false}]};
    closeConnection(eventsDatabase.database);
    if (search) conditions.push( {$or : [{ "customerDatas.firstname" : {$regex: new RegExp(search, 'g')} }, { "customerDatas.lastname" : {$regex: new RegExp(search, 'g')} }, {id : {$in : nameIds}}, { price : {$regex: new RegExp(search, 'i')}}, { "customerDatas.fullName" : {$regex: new RegExp(search, 'i')}}]} )
    console.log(conditions);
    let query = salesDatabase.collection.find({ $and : [ {id : { $in : eventsOfUser}}, {bought : true},  ...conditions]}).sort({ time: -1 })
    let sales = pagination ? await query.skip(skipValue).limit(limit).toArray() : await query.toArray();
    let max;
    if (pagination) max = await salesDatabase.collection.countDocuments({ $and : [ {id : { $in : eventsOfUser}}, {bought : true},  ...conditions]});
    sendSales = [];
    closeConnection(salesDatabase.database);
    const usersDatabase = new Database("admin");
    const localCoupons = new Database("local-discount");
    const ticketsDatabase = new Database("coupons");
    let sale;
    for (let i = 0; i < sales.length; i++){
        sale = sales[i];
        if (eventsOfUser.find(item=>String(item)==String(sale.id))){
            let userName = "";
            let coupon = "";
            if (sale.local){
                userName = (await usersDatabase.collection.findOne({_id : ObjectId(sale.user._id)}, { projection : { username : 1, _id : 0 } })).username;
                coupon = sale.localCoupon ? (await localCoupons.collection.findOne({_id : ObjectId(sale.localCoupon)}, { projection : { name : 1 } })).name : "";
                
            }
            else{
                coupon = sale.coupon ? sale.coupon : "";
            }
            sendSales.push({user : userName, coupon : coupon, price : sale.price, local : !!sale.local, tickets : sale.tickets, date : new Date(sale.time), fullPrice : sale.fullPrice, eventName : events.find(item =>String(item._id) == eventsOfUser.find(event=>String(event) == String(sale.id)))?.eventData?.name, eventId : sale.eventId, fullAmount : sale.fullAmount, buyId : sale._id, customerName : sale.customerDatas ? `${sale?.customerDatas?.firstname ? sale.customerDatas.firstname : ""}${sale?.customerDatas?.lastname ? ` ${sale.customerDatas.lastname}` : ""}` : "", cusotmerEmail : sale.customerDatas ? `${sale.customerDatas.mail}` : "", phoneNumber : sale?.customerDatas?.phone ? sale?.customerDatas?.phone : ""});
        };
    }
    closeConnection(ticketsDatabase.database);
    closeConnection(localCoupons.database);
    closeConnection(usersDatabase.database);
    return { sales : sendSales, max : max};
};

module.exports = Sales;