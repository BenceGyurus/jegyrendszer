const { ObjectId } = require("mongodb");
const Database = require("./mongo/mongo");

const closeConnection = (database)=>{
    try{
        setTimeout(()=>{
            database.close();
        }, 10000);
    }catch{

    }
}

const statusOfPayment = async (id)=>{
    try{ if (typeof id != "object" && id) id = new ObjectId(id) }catch{};
    if (id) {
        const { collection, database } = new Database("buy");
        try{
            let data = collection.findOne({ _id : id }, {projection : { bought : 1, pending : 1, status : 1, paymentMethod : 1 }})
            closeConnection(database);
            return await data;
        }catch{
            closeConnection(database);
            return false
        }
    }
    else return false;
}

module.exports = statusOfPayment;