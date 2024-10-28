const handleError = require("./handleError");
const Purchase = require("./purchase");
const { Queue } = require('bullmq');
const Tickets = require("./tickets");
const Functions = require("./functions");
const getTime = require("./getTime");
const LoggerModule = require("./slack-logger");
const GenerateTicket = require("./genrate_ticket");
//const getEventDatas = require("./getEventDatas");
const Database = require("./mongo/mongo");

const logger = LoggerModule();

var redis_con = {
    host: "redis-release-master.service.svc.cluster.local",
    port: 6379,
    username: "default",
    password: process.env.REDIS_PASS,
    db: 1,
  }
  if (process.env.NODE_ENV != "production") {
    redis_con = {
      host: "localhost",
      port: 6379,
      db: 1,
    }
  }

const queue = new Queue('mail', {redis_con});
/**
 * Send message to queue based on provided object
 * @param {mailData}: MailDTO - all information regarding the ema
 * 
 * @example
 * await sendMail({
 *      type: 'TICKET',
 *      recip: 'asdasd@asdasd.com',
 *      body: {
 *        name: 'Teszt Jancsi',
 *        fileName: ['x.pdf', 'y.pdf'],
 *        tickets: [
 *          {
 *            ticketName: 'X Előadás',
 *            ticketType: 'Normál',
 *            ticketQty: 10,
 *            ticketDate: '2025-01-01',
 *          },
 *        ]
 *      },
 * })
 */
const sendMail = async (mailData) => {
    console.log(mailData)
  await queue.add('send', mailData);
}

const tickets = async (orderId, tickets, venue, eventId, local, id, invited)=>{
    const ticketsIds = await Tickets(orderId, tickets, venue, eventId, local, id, invited);
    return await GenerateTicket(ticketsIds);
}

const paymentResponse = async (response, res)=>{
    /*
    "salt":"223G0O18VAqdLhQYbJz73adT36YzLtak",
    "orderRef":"101010515680292482600",
    "method":"CARD",
    "merchant":"PUBLICTESTHUF",
    "finishDate":"2019-09-09T14:46:18+0200",
    "paymentDate":"2019-09-09T14:41:13+0200",
    "transactionId":99844942,
    "status":"FINISHED"
    */
   const receiveDate = new Date();
    let purchase = new Purchase(response.orderRef);
    switch (response.status){
        case "FINISHED":
            let buying = await purchase.get([{time : {$gt : new Date().getTime() - getTime("RESERVATION_TIME")}}, {salt : response.salt, pending : true, bought : false, isPayingStarted : true}]);
            if (!buying){
                purchase.close();
                return handleError(logger, "051", res);
            }
            if (buying.bought){
                purchase.close();
                return handleError(logger, "052", res);
            }
            let update = await purchase.update({status : response.status, bought : true, pending: false, paymentDate : receiveDate, transactionId : response.transactionId, paymentDate : response.paymentDate, isPayingStarted : false, paymentMethod : response.method});
            if (!update || !update.acknowledged || !update.modifiedCount){
                purchase.close();
                return handleError(logger, 500, res);
            }
            const {collection, database} = new Database("events");
            let event = await collection.findOne({_id : buying.id});
            let venue = "";
            if (event) venue = event.eventData.venue;
            Functions.closeConnection(database);
            const ticketList = await tickets(Functions.createObjectId(response.orderRef), buying.tickets,venue, buying.eventId, buying.local, buying.id, buying.invited);
            sendMail({
                type : "TICKET",
                recip : buying.customerDatas.mail,
                body : {
                    name : buying.customerDatas.isCompany ? buying.customerDatas.firstname : `${buying.customerDatas.firstname} ${buying.customerDatas.lastname}`,
                    fileName : ticketList,
                    tickets : buying.tickets.map(types => {
                        return types.types.map(x => {
                        return {
                            ticketName : x.name,
                            ticketType : x.type,
                            ticketQty : x.amount,
                            ticketDate : x.date
                        }
                        });
                    }).flat()
                }
            })
            break;
        case "CANCELLED":
            let cancel = await purchase.update({status : response.status, pending: true, isPayingStarted : false, bought : false});
            if (!cancel.modifiedCount){
                purchase.close();
                return handleError(logger, 500, res);
            }
            break;
        case "TIMEOUT":
            let timeout = await purchase.update({status : response.status, pending: true, isPayingStarted : false, bought : false});
            if (!timeout.modifiedCount){
                purchase.close();
                return handleError(logger, 500, res);
            }
            break;
    }
    purchase.close();
    return res.status(200).send(
        {
            ...response,
            receiveDate : receiveDate
        }
    );


}

module.exports = paymentResponse;