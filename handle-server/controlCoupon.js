const Database = require("./mongo/mongo.js");

const getPrice = (money, fullPrice, amount)=>{
    return {price :  money ? fullPrice > amount ? fullPrice-amount : 0 : fullPrice - (fullPrice*(amount/100)), used : true, amount : amount, money : money};
}

const error = ()=>{
    return {error : true, message : "Ez a kupon nem használható fel ehhez az eseményhez", used : false};
}

const ControlCoupon = async (couponName, eventId, fullPrice)=>{
    console.log(fullPrice)
    const {collection, database} = new Database("coupons");
    let coupon = await collection.findOne({name : couponName});
    console.log(coupon);
    setTimeout(
        ()=>{
            database.close();
        },
        10000
    )
    if (coupon){
        if (new Date(coupon.validity).getTime() >= new Date().getTime()){
            if (coupon.type == 0 && coupon.events.includes(eventId)){
                return {...getPrice(coupon.money, fullPrice, coupon.amount), name : coupon.name};
            }
            if (coupon.type == 1 && coupon.events.includes(eventId) && !coupon.usedEvent.includes(eventId)){
                return {...getPrice(coupon.money, fullPrice, coupon.amount), name : coupon.name};
            }
            if (coupon.type == 2 && coupon.events.includes(eventId) && !coupon.usedTicket){
                return {...getPrice(coupon.money, fullPrice, coupon.amount), name : coupon.name};
            }
            else{
                return error();
            }
        }
        else{
            return {error : true, message : "Ez kupon már nem használható fel"};
        }
    }
    else{
        return {error : true, message : "Nem található ilyen kupon"};
    }
}

module.exports = ControlCoupon;