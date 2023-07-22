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
const multer = require('multer');
const Jimp = require('jimp');
const controlTypesOfVenues = require("./typesOfDatas/veunes.js");
const  { ObjectId } = require('mongodb');
const controlTypeOfEvents = require("./typesOfDatas/events.js");
const TypeOfBody = "object";
const controlConnection = require("./controlConnection.js");
const Control_Seats = require("./control-seats.js");
const getTicketByReadableId = require("./getTicketByReadableId.js");
const controlTypeOfCoupon = require("./typesOfDatas/coupons.js");
const controlTypeOfBillingAddress = require("./typesOfDatas/billingAddress.js");
const axios = require('axios').default;
const fs = require("fs");
const cron = require('node-cron');
const controlCoupon = require("./controlCoupon.js");
const Logger = require('./slack-logger');
const controlEvent = require("./controlEvent.js");
const getEventDatas = require("./getEventDatas.js");
const getStatsOfEvents = require("./getStatsOfEvents.js");
const getPriceOfTicket = require("./dynamic-ticket-price.js");
const { PKPass } = require('passkit-generator');
const ControlLoginRequest = require("./loginConrtol.js");
const cryptoJs = require("crypto-js");
const {ShortUniqueId} = require('short-unique-id')

const closeConnection = (database)=>{
    setTimeout(()=>{
        try{
            database.close();
        }
        catch{

        }
    },10000);
}

const parseBodyMiddleeware = (req, next)=>{
    req.body = Functions.parseBody(req.body);
    next();
}

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${Functions.genrateToken()}.${file.mimetype.split("/")[1]}`)
    }
})

let upload = multer({ storage: storage })

const readConfig = async () => {
        try {
            let config = JSON.parse(fs.readFileSync(`${process.env.CONFIGDIR}/config.json`));
            return config;
        }catch(err){
            console.log('failed to read config file, check env variables');
        }
}

const config = readConfig().catch(err => console.log(err));
const logger = new Logger()

app.use(bodyParser.urlencoded({ extended: false }))


//EVENTS
app.get("/api/v1/events", async (req,res) =>{
    let {collection, database} = new Database("events");
    let datas = await collection.find().toArray();
    let sendDatas = [];
    for (let i = 0; i < datas.length; i++){
        // console.log(datas[i].eventData.objectDateOfRelease.getTime(), new Date().getTime(), datas[i].eventData.objectDateOfEvent.getTime(), new Date().getTime())
        // console.log(datas[i].eventData.objectDateOfRelease.getTime() <= new Date().getTime() && datas[i].eventData.objectDateOfEvent.getTime() >= new Date().getTime())
        if (datas[i].eventData.objectDateOfRelease.getTime() <= new Date().getTime() && datas[i].eventData.objectDateOfEvent.getTime() >= new Date().getTime()){
            sendDatas.push({
                id : datas[i].eventData.readable_event_name,
                date : datas[i].eventData.objectDateOfEvent,
                title : datas[i].eventData.name,
                description : datas[i].eventData.description,
                imageName : datas[i].eventData.background
            });
        }
    }
    closeConnection(database);
    res.status(200).send({events : sendDatas});
});

app.get("/api/v1/event/:id", async (req,res)=>{
    let id = req?.params?.id;
    if(id == undefined) return handleError(logger, "400", res);
    //let {collection, database} = new Database("events");
    /*let events = await collection.find().toArray();
    let event = {};
    if (events){
        for (let i = 0; i < events.length; i++){
            if (events[i].eventData.readable_event_name === id){
                event = events[i].eventData;
            }
        }
    }*/
    let event = await getEventDatas(id);
    if (event){
        let l = new Database("venue");
        let placeCollection = l.collection;
        place = {};
        closeConnection(l.database);
        if (event.venue){
            place = await placeCollection.findOne({_id : new ObjectId(event.venue)});
            if (place){
                placesOfEvent = [];
                place = {sizeOfArea : place.content.sizeOfArea, background : place.content.background, sizeOfSeat : place.content.sizeOfSeat, colorOfBackGround : place.content.colorOfBackGround, colorOfSeat : place.content.colorOfSeat, seatsDatas : place.content.seatsDatas, stage : place.content.stage};
                for (let i = 0; i < event.tickets.length; i++){
                    for (let j = 0; j < event.tickets[i].seats.length; j++){
                        for (let k = 0; k < place.seatsDatas.length; k++){
                            if (place.seatsDatas[k].id == event.tickets[i].seats[j]){
                                placesOfEvent.push(place.seatsDatas[k]);
                            }
                        }
                    }
                }
            }else logger.warn(`Place not found with id ${event.venue}`)
            place.seatsDatas = placesOfEvent;
            
        }
        for (let i = 0; i < event.tickets.length; i++){
            getPriceOfTicket(event.readable_event_name, event.tickets[i].id);
        }
        res.send({allPendingPlaces : event.allPendingPlaces, media : event.media, id : event.readable_event_name, background : event.background ,title : event.name, description : event.description, date : event.objectDateOfEvent, tickets : Functions.getPlaces(event.tickets), places : place, location : event.location, position: event.position});
        return;
    }
    //closeConnection(database);
});


//ACCESS + LOGINS
app.post("/api/v1/get-access", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    res.send({access : Functions.merge_Access(await control_Token(body.token, req))});
})

app.post("/api/v1/get-long-token", async (req,res, next) =>{
    let body = Functions.parseBody(req.body);
    if (body.token){
        let {collection, database} = new Database("short-token");
        let tokenDatas = await collection.findOne({token : body.token});
        closeConnection(database);
        if (tokenDatas && tokenDatas.datas.ip){
            if (tokenDatas.datas.ip == Functions.getIp(req) && tokenDatas.datas.timeInMil + 60000 > new Date().getTime()){
                let longTokenDatabase = new Database("long-token");
                let token = Functions.genrateToken();
                longTokenDatabase.collection.insertOne(await Topology.longTokenData(token, tokenDatas.userData, req));
                res.send({token : token, access : Functions.merge_Access(tokenDatas.userData.access), expires_in : 21600000});
                closeConnection(longTokenDatabase.database);
                return 0;
            }
            else{
                handleError(logger, "002", res);
                //res.send({error : true, errorCode : "002"})     //Helytelen ip vagy időtúllépés a bejelentkezés során
                return 0;
            }
        }else logger.warn(`Tokendatas database entry not found with by token ${body.token}`)
        //closeConnection(database1);
    }
    handleError(logger, "003", res);
    //res.send({error : true, errorCode : "003"});            //Nincs token
});

app.post("/api/v1/login", async (req, res, next) =>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.username && body.password){
        let {collection, database} = new Database("admin");
        let user = await collection.findOne({username : body.username, password : Functions.encryption(body.password)});
        closeConnection(database);
        if (user){
            let shortTokenDatabase = new Database("short-token");
            let token = Functions.genrateToken();
            let datas = await otherData(req);
            let userData = Topology.newUserDatas(user);
            await shortTokenDatabase.collection.insertOne({token : token, datas : datas, userData : userData});
            res.send({
                token : token
            });
            closeConnection(shortTokenDatabase.database);
        }
        else{
            if (!await ControlLoginRequest(req,res)){return}
            handleError(logger, "006", res);//res.send({error : true,errorCode : "006"}) //Rossz felhasználónév vagy jelszó
        }
        }
    else{
        handleError(logger, "006", res);
    }
});

app.post("/api/v1/new-long-token", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("profile")){
            let { collection, database } = new Database("long-token");
            let datas = await collection.findOne({token : body.token});
            if (!datas) return logger.error(`Long-token entry not found with token ${body.token}`);
            let usersDatabase = new Database("admin");
            let userData = await usersDatabase.collection.findOne({username : datas.userData.username, _id : mongodb.ObjectId(datas.userData.id)});
            closeConnection(usersDatabase.database);
            let newToken = Functions.genrateToken();
            if (userData){
                let result = collection.insertOne(await Topology.longTokenData(newToken,Topology.newUserDatas(userData), req, body.token));
                let result2;
                if (result){
                    result2 = (await collection.updateOne({token : body.token}, {$set : {status : false}})).acknowledged;
                }
                res.send(result && result2 ? {token : newToken} : {error : true, errorCode : "001"});
                closeConnection(database);
                return;
            }
            else{
                logger.warn(`Userdata entry not found with id ${datas.userData.id} and name: ${datas.userData.username}`)
                handleError(logger, "009", res);
                closeConnection(database);
                return;
                //res.send({error : true, errorCode : "009"});        //Felhasználó nem található
            }
        }
    }
    handleError(logger, "004", res);
})

app.post("/api/v1/get-all-access", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-users")){
            let response_json = Functions.readJson("user/accesslist.json");
            if (response_json) res.send(response_json);
            else handleError(logger, "500", res)
        }
    }
    else{
        handleError(logger, "004", res)
    }
});



//USERS
app.post("/api/v1/users", (req,res, next)=>parseBodyMiddleeware(req,next) ,async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-users")){
            let { collection, database } = new Database("admin");
            let sendDatas = [];
            let datas = await collection.find()?.toArray();
            if(datas == undefined) {
                handleError(logger, "500", res);
                logger.error(`Admin db cant be read`);
                closeConnection(l.database);
                closeConnection(database);
                return;
            }
            for (let i = 0; i < datas.length; i++){
                sendDatas.push({
                    id : datas[i]._id,
                    username : datas[i].username,
                    access : Functions.merge_Access(datas[i].access),
                    cantEdit : datas[i].cantEdit,
                    status : true
                });
            }
            let l = new Database("new-user");
            let pending = l.collection;
            datas = await pending.find().toArray();
            if(datas == undefined) {
                handleError(logger, "500", res);
                logger.error(`New-user db cant be read`);
                closeConnection(l.database);
                closeConnection(database);
                return;
            }
            for (let i = 0; i < datas.length; i++){
                if (datas[i].datas.timeInMil+259200000 > new Date().getTime()){
                    // console.log(datas[i].access);
                    sendDatas.push({
                        id : datas[i]._id,
                        addedBy : datas[i].datas.userData.username,
                        validTo : datas[i].datas.timeInMil+259200000,
                        created : datas[i].datas.timeInMil,
                        status: false,
                        access : Functions.merge_Access(datas[i].access),
                        token : datas[i].token,
                        url : "/uj-profil/"
                    })
                }
            }
            res.send({users : sendDatas});
            closeConnection(database);
            closeConnection(l.database);
            return;
        }
    }
    try{
    closeConnection(l.database);
    closeConnection(database);
    }
    catch{}
    handleError(logger, "004", res);
});

app.post("/api/v1/add-new-user", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("edit-users")){
            let { collection, database } = new Database("new-user");
            let token = Functions.genrateToken();
            let userAccess = [];
            let accesses = Functions.readJson("user/accesslist.json");
            if(!accesses){
                handleError(logger, "500", res);
                logger.error("Failed to read accesslist.json");
                return;
            }
            else if (body.access && accesses){
                for (let i = 0; i < Object.keys(body.access).length; i++){
                    for (let j = 0; j < Object.keys(accesses).length; j++){
                        if (Object.keys(body.access)[i] == Object.keys(accesses)[j] && body.access[Object.keys(body.access)[i]]){
                            userAccess.push(Object.keys(body.access)[i]);
                        }
                    }
                }
            }
            collection.insertOne({token : token,access: userAccess ,datas : await otherData(req, body.token)});
            res.send({token : token, url : "/uj-profil/"});
            closeConnection(database);
        }
        else {
            handleError(logger, "004", res);
            //res.send({error : true, errorCode : "004"});        //Nincs hozzáférése
        }
    }
    else{
        handleError(logger, "004", res);
    }
});

app.post("/api/v1/create-profile/:token", async (req,res)=>{
    let token = req?.params?.token;
    if(token == undefined) return handleError(logger, "400", res);
    let body = Functions.parseBody(req.body);
    if (token){
        let { collection,database } = new Database("new-user");
        let datas = await collection.findOne({token : token});
        body.access = datas ? datas.access : false;
        let access = Functions.control_Access(body);
        closeConnection(database);
        //console.log(datas && datas.datas.timeInMil + 259200000,new Date().getTime())
        if (datas && datas.datas.timeInMil + 259200000 > new Date().getTime()){
            if (Functions.control_Password_And_Username(body) && access){
                let adminDatabase = new Database("admin");
                let l = new Database("new-user");
                let pedding = l.collection;
                if (!(await adminDatabase.collection.findOne({username : body.username}))){
                    await adminDatabase.collection.insertOne({username : body.username, password : Functions.encryption(body.password), readable_user_id : Functions.sanitizeingId(body.username), addedBy : datas.datas.userData, datas : await otherData(req), deleteable : true, access : access});
                    res.send({error : !(await pedding.deleteOne({token : token})).acknowledged});
                }
                else{
                    handleError(logger, "010", res);
                    //res.send({error : true, errorCode : "010"});        //Felhasználónév foglalt
                }
                closeConnection(adminDatabase.database);
                closeConnection(l.database);
            }
            else{
                handleError(logger, "008", res);
                //res.send({error : true, errorCode : "008"});        //A jelszónak minimum 8 karakterből kell állnia és kell tartalmaznia legalább 1 számot
            }
        }else{
            handleError(logger, "007", res);
            //res.send({error : true, errorCode : "007"});         //Rossz regisztrációs token vagy időtúllépés
        }
    }
    else{
        handleError(logger, "007", res);
    }
});

app.post("/api/v1/delete-user", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        let l = new Database("admin");
        let usersCollection = l.collection;
        if (access && access.includes("edit-users")){
            if (body.userId){
                let id = new ObjectId(body.userId);
                let user = await usersCollection.findOne({_id : id});
                if(user == undefined) logger.warn(`User not found with id ${id}`)
                let l = new Database("deleted-users");
                let deletedUsersCollection = l.collection;
                if (user && user.deleteable){ 
                    usersCollection.deleteOne({_id : id}); 
                    await deletedUsersCollection.insertOne({ userData : user, deletedBy : await otherData(req, req.token) , datas : Functions.getBrowerDatas});
                    handleError(logger, "011", res);
                    closeConnection(l.databse);
                    return ;
                }
                closeConnection(l.databse);
                handleError(logger, "013", res);
            }
            else{
                handleError(logger, "012", res);
            }
        }else{
            handleError(logger, "004", res);
            //res.send({error : true, errorCode : "004"});
        }
        closeConnection(l.database);
    }
    else{
        handleError(logger, "004", res);
    }
});

app.post("/api/v1/edit-user/:id", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-users")){
            if (req?.body?.datas && typeof req?.body?.datas == "object" && req?.params?.id){
                let {collection, database} = new Database("admin");
                let accesslist = Functions.readJson("user/accesslist.json");
                let updateDatas = [];
                if (accesslist){
                    for (let i = 0; i < Object.keys(req.body.datas).length; i++){
                        if (Object.keys(accesslist).includes(Object.keys(req.body.datas)[i]) && req.body.datas[Object.keys(req.body.datas)[i]]){
                            updateDatas.push(Object.keys(req.body.datas)[i]);
                        }
                    }
                }else {
                    logger.error("Failed to read accesslist.json");
                    handleError(logger, "500", res);
                    return;
                }
                !updateDatas.length ? updateDatas = ["profile"] : false;
                // console.log(updateDatas);
                let result = await collection.updateOne({_id : ObjectId(req.params.id)}, {$set : {access : updateDatas}});
                res.send({error : !result.modifiedCount});
                closeConnection(database);
            }
        }
    }else handleError(logger, "400", res);
});

app.post(`/api/v1/delete-pedding-user/:id`, (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        if (req?.params?.id){
            let access = await control_Token(req.body.token, req);
            if (access && access.includes("edit-users")){
                let {collection, database} = new Database("new-user");
                let result = await collection.deleteOne({_id : new ObjectId(req.params.id)});
                if(result == undefined) logger.warn(`new-user DB entry not found with id ${req?.params?.id}`)
                res.send({error : !result.deletedCount});
                closeConnection(database);
                return;
            }
        }
        else handleError(logger, "400", res);
    }else handleError(logger, "400", res);
});

app.post(`/api/v1/edit-pedding-user/:id`, (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        if (req.params.id && req.body.datas){
            let access = await control_Token(req.body.token, req);
            if (access && access.includes("edit-users")){
                let {collection, database} = new Database("new-user");
                let accesslist = Functions.readJson("user/accesslist.json");
                let updateDatas = [];
                if (accesslist){
                    for (let i = 0; i < Object.keys(req.body.datas).length; i++){
                        if (Object.keys(accesslist).includes(Object.keys(req.body.datas)[i]) && req.body.datas[Object.keys(req.body.datas)[i]]){
                            updateDatas.push(Object.keys(req.body.datas)[i]);
                        }
                    }
                }else {
                    logger.error("Failed to read accesslist.json");
                    handleError(logger, "500", res);
                    return;
                }
                !updateDatas.length ? updateDatas = ["profile"] : false;
                let result = await collection.updateOne({_id : new ObjectId(req.params.id)}, {$set : {access : updateDatas}});
                res.send({error : !result.modifiedCount});
                closeConnection(database);
                return;
            }
        } else handleError(logger, "400", res);
    } else handleError(logger, "001", res);
});

app.post("/api/v1/get-user-data", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("profile")){
            let {collection, database} = new Database("long-token");
            let datas = await collection.findOne({token : body.token});
            if(datas == undefined){
                logger.error(`Token not found in db: ${body.token}`);
                handleError(logger, "500", res);
            }
            let l = new Database("admin");
            let usersCollection = l.collection;
            let username = (await usersCollection.findOne({_id : datas.userData.id}))?.username;
            if(username == undefined){
                logger.error(`User not found in with id ${datas.userData.id}`);
                handleError(logger, "500", res);
            }
            res.send({username : username, id : datas.userData.id});
            closeConnection(database);
            closeConnection(l.database);
            return;
        }else handleError(logger, "004", res);
    }else handleError(logger, "003", res);
})

app.post("/api/v1/change-username", async (req,res) =>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("profile")){
            let l = new Database("admin");
            let changeUsernameCollection = l.collection;
            if (body.datas.username.length > 4 && !(await changeUsernameCollection.findOne({username : body.datas.username}))){
                let {collection, database} = new Database("long-token");
                let datas = await collection.findOne({token : body.token});
                if(datas == undefined){
                    logger.warn(`Long-token not found in db: ${body.token}`);
                    handleError(logger, "500", res);
                }
                let response = await changeUsernameCollection.updateOne({_id : datas.userData.id},{$set : {username : body.datas.username}});
                res.send({username : response.modifiedCount > 0 ? body.datas.username : (await changeUsernameCollection.findOne({_id : datas.userData.id})).username});
                closeConnection(database);
                closeConnection(l.database);
            }
            else{
                body.datas.username.length <= 4 ? handleError(logger, "018", res) : handleError(logger, "010", res);
            }
            return
        }else handleError(logger, "004", res);
    }else handleError(logger, "003", res);
})

app.post("/api/v1/change-password", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("profile")){
            if (Functions.controlPassword(body.datas.password)){
                let {collection, database} = new Database("long-token");
                let datas = await collection.findOne({token : body.token});
                if(datas == undefined){
                    logger.warn(`Long-token not found in db: ${body.token}`);
                    handleError(logger, "500", res);
                }
                let l = new Database("admin");
                let changeUsernameCollection = l.collection;
                let response = await changeUsernameCollection.updateOne({_id : datas.userData.id, password : Functions.encryption(body.datas.oldPassword)}, {$set : {password : Functions.encryption(body.datas.password)}});
                res.send({update : response.modifiedCount > 0});
                closeConnection(database);
                closeConnection(l.database);
            }
            else{
                handleError(logger, "008",res);
            }
        }else return handleError(logger, "", res);
    }
    handleError(logger, "003", res)
});


//VENUES
app.post("/api/v1/upload-venue/:id", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.params.id && req.body && typeof req.body === TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-rooms") && controlTypesOfVenues(req.body.datas)){
            let { collection, database } = new Database("venue");
            let id = new ObjectId(req.params.id);
            let lastVersion = await collection.findOne({_id : id});
            if (lastVersion){
                // console.log(lastVersion.versions);
                lastVersion.versions.push({content : lastVersion.content, addedBy: lastVersion.addedBy, id : Functions.genrateToken});
                let updated = await collection.updateOne({_id : id}, {$set : {content : req.body.datas, addedBy : await otherData(req, req.body.token), versions : lastVersion.versions}});
                closeConnection(database);
                if (updated.modifiedCount){
                    res.send({id : req.params.id});
                    return;
                }
                else return handleError(logger, "000", res);
            }
            else return handleError(logger, "000", res);
        } else return handleError(logger, "004", res);
    } else return handleError(logger, "400", res);
});

app.post("/api/v1/upload-venue", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("edit-rooms") && controlTypesOfVenues(body.datas)){
            let { collection,database } = new Database("venue");
            let datas = await collection.insertOne({content : body.datas, addedBy : await otherData(req, body.token), versions : []});
            if (datas?.insertedId) res.send({id : datas.insertedId});
            else handleError(logger, "000", res);
            closeConnection(database);
            return;
        } else return handleError(logger, "004", res);
    } else return handleError(logger, "400", res);
})

app.post("/api/v1/venues", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("edit-rooms")){
            let { collection, database } = new Database("venue");
            let datas = await collection.find().toArray();
            if(datas == undefined){
                logger.warn(`Venue information not found`);
                return handleError(logger, "500", res);
            }
            let sendDatas = [];
            for (let i = 0; i < datas.length; i++){
                sendDatas.push({
                    name : datas[i].content.name,
                    places : datas[i].content.places,
                    seatsDatas : datas[i].content.seatsDatas,
                    colorOfBackGround : datas[i].content.colorOfBackGround,
                    id : datas[i]._id,
                    sizeOfSeat : datas[i].content.sizeOfSeat,
                    colorOfSeat : datas[i].content.colorOfSeat,
                    sizeOfArea : datas[i].content.sizeOfArea,
                    addedBy: datas[i].addedBy.userData.username
                });
            }
            res.send({venues : sendDatas});
            return closeConnection(database);
        } else return handleError(logger, "004", res);
    } else return handleError(logger, "400", res);
});

app.post("/api/v1/venue/:id", (req,res, next)=>parseBodyMiddleeware(req, next), async (req,res)=> {
    if (req.body && typeof req.body == TypeOfBody && req.body.token && req.params.id){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-rooms") && req.params.id){
            if (req.params.id.length === 24){
                let id = new ObjectId(req.params.id);
                let { collection, database } = new Database("venue");
                let datas = await collection.findOne({ _id : id });
                closeConnection(database);
                if (datas){
                    datas.content.id = datas._id;
                    res.send(datas.content);
                    return;
                } else {
                    logger.err(`Venue id failed to read id ${id}`)
                    return handleError(logger, "500", res);
                }
            } else return handleError(logger, "404", res);
        } else return handleError(logger, "004", res);
    } else return handleError(logger, "400", res);
})

app.post("/api/v1/delete-venue/:id", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("edit-rooms") && req.params.id){
            let id = new ObjectId(req.params.id);
            let { collection, database } = new Database("venue");
            let Ddatas = {}
            Ddatas.deletedContent = await collection.findOne({_id : id});
            let datas = await collection.deleteOne({_id : id});
            let deletedDb = new Database("deleted-venues").collection;
            Ddatas.deletedBy = await otherData(req, body.token);
            deletedDb.insertOne(Ddatas);
            res.send(datas);
            closeConnection(database);
            return;
        } else return handleError(logger, "004", res);
    } else return handleError(logger, "400", res);
});

app.post("/api/v1/get-venues-in-array", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    // console.log(req.body);
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-events")){
            let {collection, database} = new Database("venue")
            let datas = await collection.find().toArray();
            let sendArray = []
            if (datas){
                for (let i = 0; i < datas.length; i++){
                    sendArray.push({title : datas[i].content.name, value : datas[i]._id});
                }
            }else{
                logger.err(`Venue db failed to read`)
                return handleError(logger, "500", res);
            }
            res.send({datas : sendArray});
            closeConnection(database);
            return;
        } else return handleError(logger, "004", res);
    } else return handleError(logger, "400", res);
})


//EVENTS
app.post("/api/v1/add-event",async (req,res)=>{
    let body = Functions.parseBody(req.body);
    // console.log(req.body)
    if (body && typeof body === TypeOfBody &&body.token){
        let access = await control_Token(body.token, req);
        // console.log(access);
        // console.log(controlTypeOfEvents(body.data))
        if (access && access.includes("edit-events") && body.data && controlTypeOfEvents(body.data)){
            let {collection, database} = new Database("events");
            let insertData = {...body.data, readable_event_name : Functions.sanitizeingId(body.data.name),objectDateOfEvent : new Date(body.data.dateOfEvent), objectDateOfRelease : new Date(body.data.dateOfRelease)};
            let insert = await collection.insertOne({eventData : insertData, otherDatas : await otherData(req,body.token), versions : []});
            closeConnection(database);
            if (insert.insertedId){
                res.send({id : (await collection.findOne({_id : insert.insertedId}))._id});
                return;
            }else return handleError(logger, "500", res);
        } else return handleError(logger, "004", res);
    } else return handleError(logger, "400", res);
    
});

app.post("/api/v1/get-event-data/:id", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    let id = req.params.id;
    if (body && typeof body === TypeOfBody &&body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("edit-events") && id && id != "undefined"){
            let { collection, database } = new Database("events");
            id = new ObjectId(id);
            let datas = await collection.findOne({_id : id});
            closeConnection(database);
            if (datas && datas?.eventData){
                res.send(datas.eventData);
                return;
            }
            else{
                logger.err(`Event not found with id ${id}`);
                return handleError(logger, "500", res);
            }
        } else return handleError(logger, "004", res);
    } else return handleError(logger, "400", res);
});

app.post("/api/v1/add-event/:id",async (req,res)=>{
    let body = Functions.parseBody(req.body);
    let id = req.params.id;
    if (body && typeof body === TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("edit-events") && body.data && controlTypeOfEvents(body.data) && id){
            let {collection, database} = new Database("events");
            id = new ObjectId(id);
            let data = await collection.findOne({_id : id});
            body.data = {...body.data, readable_event_name : Functions.sanitizeingId(body.data.name)};
            let l = await collection.updateOne({_id : id}, {$set : {eventData : {...body.data, objectDateOfEvent : new Date(body.data.dateOfEvent), objectDateOfRelease : new Date(body.data.dateOfRelease)}, versions : [...data.versions, { eventData : data.eventData, otherDatas : data.otherDatas }], otherDatas : await otherData(req,body.token)}});
            closeConnection(database);
            if (l.modifiedCount){
                res.send({id : id});
                return;
            }else return handleError(logger, "000", res);
        } else return handleError(logger, "004", res);
    } else return handleError(logger, "400", res);
    
});

app.post("/api/v1/events", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body === TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("edit-events")){
            let {collection,database} = new Database("events");
            let datas = await collection.find().toArray();
            if (!datas) {
                logger.err(`Failed to read db edit-events`);
                return handleError(logger, "500", res);
            }
            let events = [];
            datas.forEach((element)=> events.push({eventData : element.eventData, addedBy : element.otherDatas.userData, id : element._id}) )
            res.send(events);
            closeConnection(database);
            return;
        } else return handleError(logger, "004", res);
    } else return handleError(logger, "400", res);
});

app.post("/api/v1/delete-event/:id", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    let id = req.params.id;
    if (body && typeof body === TypeOfBody && body.token && id){
        let access = await control_Token(body.token, req);
        if (access && access.includes("edit-events")){
            let {collection, database} = new Database("events");
            id = ObjectId(id);
            let datas = await collection.findOne({_id : id});
            let deleted = await collection.deleteOne({_id : id});
            closeConnection(database);
            if (deleted?.deletedCount){
                let {collection, database} = new Database("deleted-events");
                let insert = await collection.insertOne({eventData : datas.eventData, otherDatas : datas.otherDatas, versions : datas.versions});
                closeConnection(database);
                if (insert.insertedId) return handleError(logger, "011",res);
            } else return handleError(logger, "014", res);
        } else return handleError(logger, "003", res);
    } else return handleError(logger, "400", res);
});

app.post("/api/v1/get-all-event", async (req,res)=>{
    const body = Functions.parseBody(req.body);
    if (body && typeof body === TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("ref")){
            let sendList = [];
            let {collection, database} = new Database("events")
            let all_Events = await collection.find().toArray();
            for (let i = 0; i < all_Events.length; i++){
                if (all_Events[i]?.eventData.objectDateOfEvent.getTime() >= new Date().getTime()){
                    sendList.push({name : all_Events[i].eventData.name, id : all_Events[i].eventData.readable_event_name, eventDate : all_Events[i].eventData.objectDateOfEvent})
                } else {
                    logger.err(`Failed to read db events`);
                    return handleError(logger, "500", res);
                }
            }
            res.send({events : sendList});
            closeConnection(database);
            return;
        } else return handleError(logger, "004", res);
    } else return handleError(logger, "400", res);
});


//TICKETS
app.post("/api/v1/order-ticket", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.datas && body.datas.length && body.eventId){
        let eventDatas = await getTicketByReadableId(body.eventId);
        let savingDatas = {eventId : body.eventId, tickets : [], time : new Date().getTime(), fullPrice : 0, fullAmount : 0};
        for (let i = 0; i < body.datas.length; i++){
            if (body.datas[i].ticketId && body.datas[i].eventId && eventDatas){
                let response = await Control_Seats(body.datas[i].places, body.datas[i].ticketId, body.datas[i].eventId);
                if (response){
                    for (let j = 0; j < eventDatas.tickets.length; j++){
                        console.log(eventDatas.tickets[j].id,body.datas[i].ticketId);
                        if (eventDatas.tickets[j].id == body.datas[i].ticketId){
                            if (!body.datas[i].places || (body.datas[i].places.length == body.datas[i].amount)){
                                savingDatas.tickets.push({ticketId : body.datas[i].ticketId ,places : body.datas[i].places, price : eventDatas.tickets[j].price*body.datas[i].amount, amount : body.datas[i].amount, name : eventDatas.tickets[j].name})
                                savingDatas.fullPrice += eventDatas.tickets[j].price*body.datas[i].amount
                                savingDatas.fullAmount += body.datas[i].amount;
                            }
                            else return handleError(logger, "016", res);
                        }// else return handleError(logger, "500", res);
                    }
                }
                else return handleError(logger, "015", res);
            }
            else return handleError(logger, "017", res);
        }
        let response = await controlEvent(body.eventId, savingDatas.tickets, "");
        if (!response.error){
            console.log(getEventDatas(body.eventId));
            let {collection, database} = new Database("pre-buying");
            let result = await collection.insertOne({...savingDatas, otherDatas : await otherData(req)});
            res.send({error : false, token : result.insertedId});
            closeConnection(database);
        }
        else return handleError(logger, response.errorCode, res);
        return;
    } else return handleError(logger, "400", res);
});

app.post("/api/v1/create-ticket", async (req, res) => {
    const ticketInfo = Functions.parseBody(req.body);
    if(!ticketInfo) return handleError(logger, "030", res);
    let axiosConfig = {
        method: 'post',
        url: `${config['EMAIL_SERVER']}/createCode`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : ticketInfo
    };

    let {collection, database} = new Database("events");
    let eventInDb = await collection.findOne({_id : new ObjectId(req.body.event_id)});
    if(!eventInDb) return handleError(logger, "500", res);

    await PKPass.from({
        model: './ticket_model/generic.pkpass', //! change to actual
        certificates: {
            wwdr: fs.readFileSync("./certs/wdr.pem"), 
            signerCert: fs.readFileSync("./certs/signerCert.pem"),
            signerKey: fs.readFileSync("./certs/signerKey.pem"),
            signerKeyPassphrase: "test" //! change
        },
    }, {
            logoText: "",
            serialNumber: "",
            authenticationToken: process.env.APPLE_PASS_IDENTIFIER,
        }.then(async (newPass) => {
            newPass.primaryFiels.push({
                key: "primary",
                label: "eventname",
                value: eventInDb.name, //?
            });
            newPass.secondaryFields.push({
                key: "secondary",
                label: "eventdate",
                value: req.body.start,
            });
            // newPass.setBarcodes()
        })
    )
    axios(axiosConfig)
        .then((email_response) => res.send({'filename': email_response.data}))
        .catch((err) => logger.err(`Failed ticket creation with ${ticketInfo}`));
})

app.get("/api/v1/buy-ticket-details/:token", async (req,res)=>{
    if (req.params && req.params.token){
        const {collection, database} = new Database("pre-buying");
        let datas = await collection.findOne({_id : new ObjectId(req.params.token)});
        closeConnection(database);
        if (datas && datas.time + 1800000 >= new Date().getTime() && datas.eventId){
            let eventDetails = await getTicketByReadableId(datas.eventId);
            if (eventDetails) res.send({eventId : datas.eventId, tickets : datas.tickets, fullAmount : datas.fullAmount, fullPrice : datas.fullPrice, eventName : eventDetails.name, dateOfEvent : eventDetails.objectDateOfEvent});
            else {
                logger.err(`Failed to get event details`);
                return handleError(logger, "500", res);
            }
            return;
        } else return handleError(logger, "500", res);
    } else return handleError(logger, "019", res);
});


app.post("/api/v1/ticket-sales", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("ticket-sells")){
            res.send(await getStatsOfEvents());
        }
    }
});
//COUPONS
app.post("/api/v1/new-coupon", async (req,res)=>{
    const body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token && body.datas){
        let access = await control_Token(body.token, req);
        if (access && access.includes("ref") && controlTypeOfCoupon(body.datas)){
            let {collection, database} = new Database("coupons");
            if ( (await collection.insertOne({
                name : body.datas.name,
                amount : body.datas.amount,
                money : body.datas.money,
                validity : body.datas.validity,
                usedEvent : [],
                events : body.datas.events,
                usedTicket : 0,
                type : body.datas.type
            })).insertedId){
                handleError(logger, "020", res);
            }
            else handleError(logger, "001", res);
            closeConnection(database);
            return;
        } else return handleError(logger, "004", res);
    } else return handleError(logger, "030", res);
})

app.post("/api/v1/get-coupons", async (req,res)=>{
    const body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("ref")){
            let {collection, database} = new Database("coupons");
            let sendDatas = [];
            let datas = await collection.find().toArray();
            if(!datas){
                logger.err(`Failed to read db coupons`);
                closeConnection(database);
                return handleError(logger, "500", res);
            }
            datas.forEach(element => new Date(element.validity).getTime() >= new Date().getTime() ? sendDatas.push(element) : false);
            res.send({coupons : sendDatas});
            closeConnection(database);
            return;
        } else return handleError(logger, "004", res);
    } else return handleError(logger, "400", res);
});

app.post("/api/v1/delete-coupon/:id", async (req,res) =>{
    const body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("ref")){
            if (req.params.id){
                let {collection, database} = new Database("coupons");
                let d = await collection.deleteOne({_id : new ObjectId(req.params.id)});
                res.send({error : d.deletedCount == 0});
                closeConnection(database);
                return;
            }else return handleError(logger, "500", res);
        } else return handleError(logger, "004", res);
    } else return handleError(logger, "400", res);
});

app.post("/api/v1/edit-coupon/:id", async (req,res)=>{
    const body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token && body.datas){
        let access = await control_Token(body.token, req);
        if (req?.params?.id){
            if (access && access.includes("ref") && controlTypeOfCoupon(body.datas)){
                let {collection, database} = new Database("coupons");
                let d = await collection.updateOne({_id : new ObjectId(req.params.id)} , { $set:{
                        name : body.datas.name,
                        amount : body.datas.amount,
                        money : body.datas.money,
                        validity : body.datas.validity,
                        events : body.datas.events,
                        type : body.datas.type
                    }
                });
                res.send({error : d.matchedCount==0})
                closeConnection(database);
            }else return handleError(logger, "004", res);
        } else return handleError(logger, "400", res);
    } else return handleError(logger, "400", res);
})

//TODO error handling
app.post("/api/v1/control-coupon-code", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.code && body.eventId){
        /*let {collection, database} = new Database("coupons");
        let coupon = await collection.findOne({name : body.code});
        if (coupon){
            console.log(coupon);
            let send = false;
            if (coupon.type == 0 && coupon.events.includes(body.eventId)){
                send = true;
            }
            else if (coupon.type == 1 && coupon.events.includes(body.eventId) && !coupon.usedEvent.includes(body.eventId)){
                send = true;
            }
            else if (coupon.type == 2 && coupon.usedTicket < 1 && coupon.events.includes(body.eventId)){
                send = true;
            }
            if (send){
                res.send({used : true, amount : coupon.amount, money : coupon.money});
            }
            else{
                res.send({used : false, message : "Nem lehet használni ezt a kupont"})
            }
        }
        else{
            res.send({used : false, message : "Nincs ilyen kupon"})
        }
        closeConnection(database);*/
        res.send(await controlCoupon(body.code, body.eventId, 0));
    }
})

/*app.post("/upload-backgroumd-image-to-venue", (req,res)=>{
    console.log(req.files);
})*/

app.get("/test", async (req, res) => {
    let data = {"salt":"c1ca1d0e9fc2323b3dda7cf145e36f5e","merchant":"PUBLICTESTHUF","orderRef":"101010516348 232058105","currency":"HUF","customerEmail":"sdk_test@otpmobil.com","language":"HU","sdkVersio n":"SimplePayV2.1_Payment_PHP_SDK_2.0.7_190701:dd236896400d7463677a82a47f53e36e","methods":["C ARD"],"total":"25","timeout":"2021-10-30T12:30:11+00:00","url":"https:\/\/sdk.simplepay.hu\/ba ck.php"}
    let dataJSON = JSON.stringify(data);
    let sign = cryptoJs.HmacSHA384(dataJSON, 'FxDa5w314kLlNseq2sKuVwaqZshZT5d6');
    sign = cryptoJs.enc.Base64.stringify(sign);
    console.log(sign)
})

// const simplesign = (data) => cryptoJs.enc.Base64.stringify(cryptoJs.HmacSHA384(JSON.stringify(data), process.env.MERCHANT));

//PAYMENT
app.post("/api/v1/payment/:id", (req,res,next)=>parseBodyMiddleeware(req,next) , async (req, res)=>{
    if (req.body && typeof req.body && req.body.datas && typeof req.body.datas === "object"){
        if (req.body.datas.customerData && controlTypeOfBillingAddress(req.body.datas.customerData) && req.params.id){
            let {collection, database} = new Database("pre-buying");
            let buyingDatas = await collection.findOne({_id : ObjectId(req.params.id)});
            collection.deleteOne({_id : ObjectId(req.params.id)});
            closeConnection(database);
            if (buyingDatas){
                let error = false;
                /*for (let i = 0; i < buyingDatas.tickets.length; i++){
                    Control_Seats(buyingDatas.tickets[i].places, buyingDatas.tickets[i].ticketId, buyingDatas.eventId) ? true : error = false;
                }*/
                let result = await controlEvent(buyingDatas.eventId, buyingDatas.tickets, buyingDatas._id);
                if (!result.error){
                    let saveDatas = {};
                    if (!error){
                        let {price, error,name} = (await controlCoupon(req.body.datas.coupon, buyingDatas.eventId, buyingDatas.fullPrice));
                        const uid = new ShortUniqueId({length: 32});
                        const uuid = uid();
                        saveDatas = {
                            price : price,
                            fullPrice : buyingDatas.fullPrice,
                            customerDatas : req.body.datas.customerData,
                            time : new Date().getTime(),
                            coupon : !error ? name : false,
                            eventId : buyingDatas.eventId,
                            tickets : buyingDatas.tickets,
                            pending : true,
                            status : false,
                            bought : false,
                            salt: uuid
                        };
                    let l = new Database("buy");
                    result = await l.collection.insertOne(saveDatas);

                    let body = {
                        salt: uuid,
                        merchant: process.env.MERCHANT,
                        orderRef: result.insertedId,
                        currency: 'HUF',
                        customerEmail: req.body.datas.customerData.mail,
                        language: 'HU',
                        sdkVersion: 'SimplePayV2.1_Payment_PHP_SDK_2.0.7_190701:dd236896400d7463677a82a47f53e36e',
                        methods:[
                            "CARD"
                        ],
                        total: price,
                        timeout: new Date(new Date().getTime() + 15 * 60000).toISOString(),
                        url: 'pornhub.com',
                        invoice: {
                            name: `${req.body.datas.customerData.firstName} ${req.body.datas.customerData.lastName}`,
                            company: 'hu',
                            // state: ,
                            city: req.body.datas.customerData.city,
                            zip: req.body.datas.customerData.postalCode,
                            address: req.body.datas.customerData.address,
                            address2: req.body.datas.customerData.address2 == 'null' ? null : req.body.datas.customerData.address2,
                            phone: req.body.datas.customerData.phone
                        },
                        items: [
                            buyingDatas.tickets.map(x => {
                                return {
                                    ref: x.ticketId,
                                    title: x.name,
                                    desc: '',
                                    amount: x.amount,
                                    price: x.price / x.amount
                                }
                            })
                        ]
                    }
                    await axios.post('https://sandbox.simplepay.hu/payment/v2/start', body, {headers: {
                        'Content-type': 'application/json',
                        'Signature': simplesign(body),
                    }}).then((simple_res) => {
                        res.send({error : !result.acknowledged, paymentUrl: simple_res.body.paymentUrl});
                    })
                    closeConnection(l.database);
                    }
                }
                else{
                    handleError(logger, result.errorCode ? result.errorCode : "001" ,res)
                }
            }
        }
    }
})


//COMPANIES
app.post("/api/v1/new-company", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && req.body.token && typeof req.body == TypeOfBody && typeof req.body.datas == "object"){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("companies")){
            const {collection, database} = new Database("companies");
            if (req.body.datas.name && req.body.datas.taxNumber){
                let result = await collection.insertOne({name : req.body.datas.name, tax : req.body.datas.taxNumber, otherDatas : await otherData(req, req.body.token)});
                res.send({error : result.insertedId > 0});
            }
            closeConnection(database);
        }
    }
});

app.post("/api/v1/get-companies", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token,req);
        if (access && access.includes("companies")){
            const {collection, database} = new Database("companies");
            datas = await collection.find().toArray();
            let sendDatas = [];
            for (let i = 0; i < datas.length; i++){
                sendDatas.push({name : datas[i].name, tax : datas[i].tax, _id : datas[i]._id});
            }
            res.send({datas : sendDatas});
            closeConnection(database);
        }
    }
});

app.post("/api/v1/delete-company/:id", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.params.id){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("companies")){
            const {collection, database} = new Database("companies");
            let result = await collection.deleteOne({_id : ObjectId(req.params.id)});
            res.send({error : result.deletedCount == 0});
            closeConnection(database);
        }
    }
});

app.post("/api/v1/edit-company/:id", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.params.id && req.body.datas){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("companies")){
            console.log(req.body.datas);
            if (req.body.datas.name && req.body.datas.taxNumber){
                const {collection, database} = new Database("companies");
                let result = await collection.updateOne({_id : ObjectId(req.params.id)}, {$set : {name : req.body.datas.name, tax : req.body.datas.taxNumber}});
                res.send({error : result.matchedCount == 0});
                closeConnection(database);
            }
        }
    }
});

//OTHER
app.post('/api/v1/upload-image/:token', upload.single('file'), async (req, res, next) => {
    const token = req.params.token;
    if (token){
        let access = await control_Token(token, req);
        if (access && (access.includes("edit-events") || access.includes("edit-rooms"))){
            const file = req.file;
            if (!file) {
                const error = new Error('No File')
                error.httpStatusCode = 400
                return next(error)
            }
            let newFilePath = "";
            for (let i = 1; i < file.path.split("/").length; i++){
                newFilePath += "/"+ file.path.split("/")[i];
            }
            let width = 0;
            let height = 0;
            try{
                let jimage = await Jimp.read(`${__dirname}/${file.path}`);
                width = jimage.bitmap.width;
                height = jimage.bitmap.height;
            }catch{

            }
            res.send({path : `/api/v1${newFilePath}`, width: width,height : height});
        } else return handleError(logger, "500", res);
    }
    else return handleError(logger, "004", res);
});

app.post("/api/v1/get-companies-in-array", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-events")){
            let {collection, database} = new Database("companies")
            let companies =  await collection.find().toArray();
            res.send({companies : companies});
            closeConnection(database);
            return;
        }
    }
    handleError("003", res);
});


app.use((req, res)=>{
    if (req.method === "GET"){
    imageName = req.url.split("/")[req.url.split("/").length-1];
    console.log(imageName);
    try{
        res.sendFile(`${__dirname}/uploads/${imageName}`);
    }
    catch{
        res.send({error : true})
    }
    }
});

if (controlConnection()){
    console.log(`The connection is successfully, the app is listening on PORT ${process.env.PORT || 3001}`)
    app.listen(process.env.PORT || 3001);
}
else{
    console.log("Couldn't connect to the database")
}

// CRONS
cron.schedule("0 3 * * *", async () => {
    let {collection, database} = new Database("long-token");
    collection.deleteMany();
    closeConnection(database);
})
cron.schedule("30 3 * * 6", async () => {
    let {collection, database} = new Database("pre-buying");
    //collection.deleteMany();
    let preBuying = collection.find({});
    for(const j in preBuying) if (new Date(coupons[j].time)+1800000 < new Date().getTime()) preBuying[j].delete();     //config
    closeConnection(database);
})
cron.schedule("0 0 1 * *", async () => {
    let {collection, database} = new Database("coupons");
    let today = new Date()
    coupons = collection.find({})
    for(const j in coupons) if (new Date(coupons[j]['validity']) < today) coupons[j].delete();
    closeConnection(database);
})