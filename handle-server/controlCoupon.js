const Functions = require("./functions.js");
const getTime = require("./getTime.js");
const Database = require("./mongo/mongo.js");

const getPrice = (money, fullPrice, amount) => {
  return {
    price: money
      ? fullPrice > amount
        ? fullPrice - amount
        : 0
      : fullPrice - fullPrice * (amount / 100),
    used: true,
    amount: amount,
    money: money,
  };
};

const error = () => {
  return {
    error: true,
    message: "Ez a kupon nem használható fel ehhez az eseményhez",
    used: false,
  };
};

const ControlCoupon = async (couponName, eventId, fullPrice) => {
  const { collection, database } = new Database("coupons");
  const buyingDatabase = new Database("buy");
  console.log("couponName:", couponName);
  let coupon = await collection.findOne({ name: couponName });
  let buyings = await buyingDatabase.collection.find({ $and : [{coupon: couponName}, {time : {$gt : new Date().getTime() - getTime("RESERVATION_TIME")}}] }).toArray(); //


  Functions.closeConnection(database);
  Functions.closeConnection(buyingDatabase.database);
  if (coupon) {
      if (
        (coupon.type == 2 ||
        coupon.type == 1) &&
        ( coupon.events.includes(eventId) && buyings.filter((buying)=>buying.eventId==eventId).length >= 1)
      )
        return error();
    if (new Date(coupon.validity).getTime() >= new Date().getTime()) {
      if (coupon.type == 0 && coupon.events.includes(eventId)) {
        return {
          ...getPrice(coupon.money, fullPrice, coupon.amount),
          name: coupon.name,
        };
      }
      else if (
        coupon.type == 1 &&
        coupon.events.includes(eventId) &&
        !buyings.filter(buying=>buying.eventId==eventId).length
      ) {
        return {
          ...getPrice(coupon.money, fullPrice, coupon.amount),
          name: coupon.name,
        };
      }
      else if (
        coupon.type == 2 &&
        coupon.events.includes(eventId) &&
        !coupon.usedTicket
      ) {
        return {
          ...getPrice(coupon.money, fullPrice, coupon.amount),
          name: coupon.name,
        };
      } else {
        return error();
      }
    } else {
      return { error: true, message: "Ez kupon már nem használható fel" };
    }
  } else {
    return { error: true, message: "Nem található ilyen kupon" };
  }
};

module.exports = ControlCoupon;
