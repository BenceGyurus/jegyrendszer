const Database = require("./mongo/mongo.js");
const Functions = require("./functions.js");
const fs = require("fs");

const get_Accesses = ()=>{
    try{
        return Object.keys(JSON.parse(fs.readFileSync(`${__dirname}/user/accesslist.json`)));
    }
    catch{
        return false
    }
}

const controlConnection = async () => {
    try{
        let {collection, database} = new Database("admin")
        datas = await collection.findOne({role : "admin"});
        setTimeout(()=>{
            database.close()
        },10000);
        if (!datas){
            collection.insertOne({username : "admin", password : Functions.encryption("admin"), readable_user_id : "admin", addedBy : {username : "system added"}, cantEdit : true, access : get_Accesses(), role : "admin"})
            console.log("Admin user is added to the database. username: admin, password: admin")
        }
        return true;
    }
    catch{
    }
    return false;
}

module.exports = controlConnection;