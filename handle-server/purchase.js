const Database = require("./mongo/mongo");
const Functions = require("./functions.js");
const otherData = require("./deitals.js");

class Purchase{
    constructor(objectId){
        this.objectId = Functions.createObjectId(objectId);
        let databaseObject = new Database("buy");
        this.database = databaseObject.database;
        this.collection = databaseObject.collection;
    }

    async get(filter = [], projection){
        return await this.collection.findOne({$and : [{$and : [{_id : this.objectId}, ...filter]}]}, {projection : {...projection}});;
    }

    async update(data){
        return this.collection.updateOne({_id : this.objectId}, {$set : {...data}});
    }

    async getFullPrice(){
        let price = 0;
        let tickets = await this.get({}, {tickets : 1});
        if (tickets){
            tickets.tickets.forEach(types => {
                types.types.forEach(type=>{
                    price += type.price;
                })
            });
        }
        return price;
    }

    async getCoupon(){
        let coupon = (await this.get({}, {coupon : 1})).coupon;
        if (coupon){
            const {collection, database} = new Database("coupons");
            let coupon = collection.findOne({name : coupon});
            Functions.closeConnection(database);
            return coupon;
        }
        return false
    }

    close(){
        Functions.closeConnection(this.database);
    }

    async new(price, fullPrice, customerDatas, couponName, uuid, req) {
        let data = await this.get();
        return this.update({
            price: price,
            fullPrice: fullPrice,
            customerDatas : customerDatas,
            time: Date.now(),
            coupon: couponName || false,
            eventId: data.eventId,
            tickets: data.tickets,
            pending: true,
            status: false,
            bought: false,
            salt: uuid,
            fullAmount: data.fullAmount,
            otherDatas: await otherData(req),
          });
    }

    

}
;

module.exports = Purchase;