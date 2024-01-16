const Database = require("../mongo/mongo.js");
const closeConnection = (database)=>{
    try{
        setTimeout(()=>{
            database.close();
        },10000);
    }catch{}
}
const calcAllOfIncome = async ()=>{
    const { collection, database } = new Database("buy");
    await collection.aggregate([
        {
            match : {
                bought : true,
            }
        },
        {
            _id: null,
            totalAmount: { $sum: fullPrice},
            count: { $sum: 1 }
          }
    ]).toArray();
};

module.exports = calcAllOfIncome;