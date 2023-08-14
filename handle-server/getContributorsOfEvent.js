const { ObjectId } = require("mongodb");
const Database = require("./mongo/mongo.js");

const closeConnection = (database)=>{
    try{
        setTimeout(()=>{
            database.close()
        },10000)
    }
    catch{

    }
}

const getContributors = async (event)=>{
    let users = [];
    const {collection, database} = new Database("admin");
    users.push((await collection.findOne({_id : ObjectId(event.otherDatas.userData.userId)})).username);
    if (event.versions){
        for (let i = 0; i <event.versions.length; i++){
            if (event.versions[i].otherDatas && event.versions[i].otherDatas.userData){
                let user = (await collection.findOne({_id : ObjectId(event.versions[i].otherDatas.userData.userId)})).username;
                if (!users.includes(user)){
                    users.push(user);
                }
                
            }
        }
    }
    closeConnection(database);
    return users;
}

module.exports = getContributors;