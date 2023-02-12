const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const Database = require("./mongo/mongo.js");
const otherData = require("./deitals.js");
const Functions = require("./functions.js");
const control_Token = require("./control-token.js");
const mongodb = require("mongodb");
const Topology = require("./databasesTopology.js");
module.exports = app;
const handleError = require("./handleError.js");

app.use(bodyParser.urlencoded({ extended: false }))

        //GET requests//




        //POST requests//


//access query

app.post("/get-access", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    res.send({access : Functions.merge_Access(await control_Token(body.token, req))});
})


    //login begin

app.post("/get-long-token", async (req,res, next) =>{
    let body = Functions.parseBody(req.body);
    if (body.token){
        let {collection} = new Database("short-token");
        let tokenDatas = await collection.findOne({token : body.token});
        if (tokenDatas && tokenDatas.datas.ip){
            if (tokenDatas.datas.ip == Functions.getIp(req) && tokenDatas.datas.timeInMil + 60000 > new Date().getTime()){
                let {collection} = new Database("long-token");
                let token = Functions.genrateToken();
                console.log(await Topology.longTokenData(token, tokenDatas.userData, req));
                collection.insertOne(await Topology.longTokenData(token, tokenDatas.userData, req));
                res.send({token : token, access : Functions.merge_Access(tokenDatas.userData.access)});
                return 0;
            }
            else{
                handleError("002", res);
                //res.send({error : true, errorCode : "002"})     //Helytelen ip vagy időtúllépés a bejelentkezés során
                return 0;
            }
        }
    }
    handleError("003", res);
    //res.send({error : true, errorCode : "003"});            //Nincs token
});



app.post("/login", async (req, res, next) =>{
    let body = Functions.parseBody(req.body);
    let {collection} = new Database("admin");
    user = await collection.findOne({username : body.username, password : Functions.encryption(body.password)});
    if (user){
        let {collection} = new Database("short-token");
        let token = Functions.genrateToken();
        //console.log(otherData(req));
        let datas = await otherData(req);
        let userData = Topology.newUserDatas(user);
        await collection.insertOne({token : token, datas : datas, userData : userData});
        res.send({
            token : token
        })
    }
    else{
        handleError("006", res);//res.send({error : true,errorCode : "006"}) //Rossz felhasználónév vagy jelszó
    }
});

        //login end

app.post("/add-new-user", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    let access = await  control_Token(body.token, req);
    if (access && access.includes("edit-users")){
        let { collection } = new Database("new-user");
        let token = await Functions.genrateToken();
        collection.insertOne({token : token, datas : await otherData(req, body.token)});
        res.send({token : token});
    }
    else{
        handleError("004", res);
        //res.send({error : true, errorCode : "004"});        //Nincs hozzáférése
    }
});

app.post("/create-profile/:token", async (req,res)=>{
    let token = req.params.token;
    let body = Functions.parseBody(req.body);
    let { collection } = new Database("new-user");
    let datas = await collection.findOne({token : token});
    let access = Functions.control_Access(body);
    if (datas && datas.datas.timeInMil + 259200000 > new Date().getTime()){
        if (Functions.control_Password_And_Username(body) && access){
            let { collection } = new Database("admin");
            if (!await collection.findOne({username : body.username})){
                collection.insertOne({username : body.username, password : body.password, readable_user_id : Functions.sanitizeingId(body.username), addedBy : datas.datas.userData, datas : await otherData(req), deleteable : true, access : access});
                res.send({error : !await (collection.deleteOne({token : token})).acknowledged});
            }
            else{
                handleError("010", res);
                //res.send({error : true, errorCode : "010"});        //Felhasználónév foglalt
            }
        }
        else{
            handleError("008", res);
            //res.send({error : true, errorCode : "008"});        //A jelszónak minimum 8 karakterből kell állnia és kell tartalmaznia legalább 1 számot
        }
    }else{
        handleError("007", res);
        //res.send({error : true, errorCode : "007"});         //Rossz regisztrációs token vagy időtúllépés
    }
});

app.delete("/delete-user", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    let access = control_Token(body, req);
    let usersCollection = new Database("admin").collection;
    if (access && access.includes("edit-users")){
        if (body.deletingUserId){

        }
    }else{
        handleError("004", res);
        //res.send({error : true, errorCode : "004"});
    }
});


app.post("/create-venue", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    let access = await control_Token(body.token, req);
    if (access && access.includes("edit-rooms")){
        let { collection } = new Database("venue");
    }
    else{
        handleError("004", res);
        //res.send({error : true, errorCode : "004"});        //Nincs hozzáférése
    }
});

app.post("/add-event", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    let access = await control_Token(body.token, req);
    if (access && access.includes("edit-users")){
        let { collection } = new Database("events");
    }
    else{
        handleError("004", res);
        //res.send({error : true, errorCode : "004"});        //Nincs hozzáférése
    }
});

app.post("/new-long-token", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    let access = await control_Token(body.token, req);
    if (access && access.includes("profile")){
        let { collection } = new Database("long-token");
        let datas = await collection.findOne({token : body.token});
        let usersCollection = new Database("admin").collection;
        let userData = await usersCollection.findOne({username : datas.userData.username, _id : mongodb.ObjectId(datas.userData.id)});
        let newToken = Functions.genrateToken();
        console.log(userData);
        if (userData){
            console.log(await Topology.longTokenData(newToken, Topology.newUserDatas(userData), req, body.token));
            let result = collection.insertOne(await Topology.longTokenData(newToken,Topology.newUserDatas(userData), req, body.token));
            let result2;
            if (result){
                result2 = (await collection.updateOne({token : body.token}, {$set : {status : false}})).acknowledged;
                console.log(result2);
            }
            res.send(result && result2 ? {token : newToken} : {error : true, errorCode : "001"});
        }
        else{
            handleError("009", res);
            //res.send({error : true, errorCode : "009"});        //Felhasználó nem található
        }
    }
    else{
        handleError("004", res);
        //res.send({error : true, errorCode : "004"})     //Nincs hozzáférése
    }
})

app.listen(process.env.PORT || 3001);