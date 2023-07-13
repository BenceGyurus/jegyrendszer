const Database = require("./mongo/mongo.js");
const setStatusOfPayment = async (id, status)=>{
    if (id){
        const {collection, database} = new Database("buy");
        let updateStatus =  await collection.updateOne({_id : id}, {$set : {status : status, bought : status == "SUCCESS"}});
        setTimeout(()=>{
            database.close();
        },10000);
        return {error : !updateStatus.matchedCount};
    }
    else{
        return {error : true, errorCode : "001"};
    }
}

module.exports = setStatusOfPayment;
