const Database = require("../mongo/mongo");

const closeDatabase = (database)=>{
    try{
        setTimeout(()=>{
            database.close();
        }, 10000);
    }catch{

    }
}

const visitors = async (fromDate, toDate)=>{
    const {collection, database} = new Database("log");
    let conditions = [];
    if (fromDate) conditions.push({time : {$gt : new Date(fromDate)}});
    if (toDate) conditions.push({time : {$lt : new Date(toDate)}});
    let result = {};
    if (conditions && conditions.length){
        conditions = {$and : [
            ...conditions
        ]}
    }
    else if (conditions && conditions.length === 1){
        conditions = conditions;
    }
    if (conditions){
        result = await collection.aggregate([
            {
                $match : {
                    ...conditions
                    }   
            },
            {
                $group: {
                    _id: null,
                    uniqueTokens: { $addToSet: "$token" }
                  }
                },
                {
                  $project: {
                    _id: 0,
                    totalUniqueTokens: { $size: "$uniqueTokens" }
                }
              }
        ]).toArray()
    }
    else{
        result = await collection.aggregate([
            {
                $group: {
                  _id: null,
                  tokens: { $addToSet: "$token" }
                }
              },
              {
                $project: {
                  _id: 0,
                  tokens: { $size: "$tokens" }
                }
              }
        ]).toArray();
    }
    if (result.length) result = result[0];
    else{
        result = {
            totalUniqueTokens : 0
        }
    }
   
    closeDatabase(database);
    return result;
}

module.exports = visitors;