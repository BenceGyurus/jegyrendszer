const { ObjectId } = require("mongodb");
const Database = require("./mongo/mongo");

const closeConnection = (database)=>{
    setTimeout(()=>{
        try{
            database.close();
        }
        catch{
            
        }
    },10000);
}

const GetUserDatas = async (token)=>{
    if (token){
        const tokenDatabase = new Database("long-token");
        let userId = await tokenDatabase.collection.findOne({token : token});
        closeConnection(tokenDatabase.database);
        if (userId && userId.userData && userId.userData.id){
            const {collection, database} = new Database("admin");
            let user = await collection.findOne({_id : ObjectId(userId.userData.id)}, { projection : { username : 1, _id : 1 } });
            closeConnection(database);
            return user
        }
    }
    return false;
}

module.exports = GetUserDatas;