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
const ShortUniqueId = require('short-unique-id');
const getNameOfSeat = require("./getNameOfSeat.js");
const GetUserDatas = require("./getUserDatas.js");
const GetFullPrice = require("./getFullPrice.js");
const controlLocalDiscount = require("./controlLocalDiscount.js");
const getTime = require("./getTime.js");
const Sales = require("./get-sales.js");
const GenerateTicket = require("./genrate_ticket.js");
const Tickets = require("./tickets.js");
const createZip = require("./createZip.js");
const NodeCache = require('node-cache');

const Cache = new NodeCache();

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

const readConfig = async () => {
    try {
        let config = JSON.parse(fs.readFileSync(`${process.env.CONFIGDIR}/config.json`));
        return config;
    }catch(err){
        throw 'failed to read config file, check env variables';
    }
}

const config = readConfig().catch(err => console.log(err));

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        if (config["ACCEPTED_IMAGE_EXTENSIONS"].includes(file.mimetype.split("/")[1].toUpperCase())){
            callBack(null, 'uploads')
        }
    },
    filename: (req, file, callBack) => {
        if (config["ACCEPTED_IMAGE_EXTENSIONS"].includes(file.mimetype.split("/")[1].toUpperCase())){
            callBack(null, `${Functions.genrateToken()}.${file.mimetype.split("/")[1]}`)
        }
    }
})

let upload = multer({ storage: storage })


const logger = new Logger()

app.use(bodyParser.urlencoded({ extended: false }))


//EVENTS
app.get("/api/v1/events", async (req,res) =>{
    const cachedData = Cache.get('events');
  if (cachedData) {
    return res.send({events : cachedData});
  } else {
    let {collection, database} = new Database("events");
    let datas = await collection.find().toArray();
    let sendDatas = [];
    let cache = true;
    let cacheTime = getTime("CACHE_TIME")
    for (let i = 0; i < datas.length; i++){
        if (datas[i].eventData.objectDateOfRelease.getTime() <= new Date().getTime() && datas[i].eventData.objectDateOfEvent.getTime() >= new Date().getTime()){
            sendDatas.push({
                id : datas[i].eventData.readable_event_name,
                date : datas[i].eventData.objectDateOfEvent,
                title : datas[i].eventData.name,
                description : datas[i].eventData.description,
                imageName : datas[i].eventData.background
            });
            datas[i].eventData.objectDateOfEvent.getTime()+cacheTime <= new Date().getTime() ? cache = false : false;
            
        }
        else if (datas[i].eventData.objectDateOfRelease.getTime() >= new Date().getTime()+cacheTime){
            cache = false;
        }
    }
    if (cache){
        Cache.set('events', sendDatas, cacheTime/1000);
    }
    closeConnection(database);
    res.status(200).send({events : sendDatas});
    }
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
        closeConnection(l.database);
        res.send({allPendingPlaces : event.allPendingPlaces, media : event.media, id : event.readable_event_name, background : event.background ,title : event.name, description : event.description, date : event.objectDateOfEvent, tickets : Functions.getPlaces(event.tickets), places : place, location : event.location, position: event.position});
        return;
    }
    //closeConnection(database);
});


app.post("/api/v1/event-datas/:id", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token && req.params.id){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("local-sale")){
            let event = await getEventDatas(req.params.id);
            if (event.venue){
                let l = new Database("venue");
                place = {};
                place = await l.collection.findOne({_id : new ObjectId(event.venue)});
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
                closeConnection(l.database);
                place.seatsDatas = placesOfEvent;
                
            }
            for (let i = 0; i < event.tickets.length; i++){
                getPriceOfTicket(event.readable_event_name, event.tickets[i].id);
            }
            return res.send({media : event.media, id : event.readable_event_name, background : event.background ,title : event.name, description : event.description, date : event.objectDateOfEvent, tickets : Functions.getPlaces(event.tickets), places : place, location : event.location, position: event.position, localDiscounts : event.localDiscounts})
        }
    }
    handleError(logger, "400", res);
});


//ACCESS + LOGINS

app.post("/api/v1/users-id-name", (req,res, next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-events")){
            const {collection, database} = new Database("admin");
            let users = await collection.find({}, { projection : { _id : 1, username : 1} }).toArray();
            closeConnection(database);
            return res.send({error : false, users : users});
        }
    }
    return handleError(logger, "400", res);
})

app.post("/api/v1/get-user-data", (req,res,next)=>parseBodyMiddleeware(req,next) ,async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        try{
            const loginedUsersDatabase = new Database("long-token");
            let loginedUserDatas = await loginedUsersDatabase.collection.findOne({token : req.body.token});
            const usersDatabase = new Database("admin");
            let userDatas = await usersDatabase.collection.findOne({_id : ObjectId(loginedUserDatas.userData.id)}, { projection : {username : 1, _id : 0} });
            closeConnection(loginedUsersDatabase.database);
            closeConnection(usersDatabase.database);
            return res.send(userDatas);
        }catch{}
    }
    handleError(logger, "400", res);
});


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
            if (tokenDatas.datas.ip == Functions.getIp(req) && tokenDatas.datas.timeInMil + getTime("MAX_LOGIN_TOKEN_DELAY") > new Date().getTime()){
                let longTokenDatabase = new Database("long-token");
                let token = Functions.genrateToken();
                longTokenDatabase.collection.insertOne(await Topology.longTokenData(token, tokenDatas.userData, req));
                res.send({token : token, access : Functions.merge_Access(tokenDatas.userData.access), expires_in : getTime("TOKEN_SESSION_TIME")});
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
        if (!await ControlLoginRequest(req,res)){return}
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
                if (datas[i].datas.timeInMil+getTime("TOKEN_SESSION_TIME") > new Date().getTime()){
                    // console.log(datas[i].access);
                    sendDatas.push({
                        id : datas[i]._id,
                        addedBy : datas[i].datas.userData.username,
                        validTo : datas[i].datas.timeInMil+getTime("TOKEN_SESSION_TIME"),
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
        if (datas && datas.datas.timeInMil + getTime("TOKEN_SESSION_TIME") > new Date().getTime()){
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
            let userId = (await GetUserDatas(body.token))._id;
            if ((body.data.users && !body.data.users.length && userId) || (userId && !body.data.users.includes(userId))){body.data.users.push(String(userId))}
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
            let userId = String((await GetUserDatas(body.token))._id);
            closeConnection(database);
            if (datas && datas?.eventData && datas?.eventData.users.includes(userId)){
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
            let l;
            let userId = (await GetUserDatas(body.token))._id;
            if (data.eventData.users.includes(String(userId))){
                if (userId && body.data.users && !body.data.users.includes(userId)){body.data.users.push(String(userId));}
                else if (!body.data.users || !body.data.users.length){body.data.users = [String(userId)]}
                console.log(body.data.users);
                l = await collection.updateOne({_id : id}, {$set : {eventData : {...body.data, objectDateOfEvent : new Date(body.data.dateOfEvent), objectDateOfRelease : new Date(body.data.dateOfRelease)}, versions : [...data.versions, { eventData : data.eventData, otherDatas : data.otherDatas }], otherDatas : await otherData(req,body.token)}});
                closeConnection(database);
                if (l && l.modifiedCount){
                res.send({id : id});
                return;
            }
            else return handleError(logger, "000", res);
            }
            else {
                closeConnection(database);
                return handleError(logger, "004", res);
            }
            
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
            let userId = String((await GetUserDatas(body.token))._id);
            datas.forEach((element)=> element.eventData.users.includes(userId) ? events.push({eventData : element.eventData, addedBy : element.otherDatas.userData, id : element._id}) : false);
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
            let userId = String((await GetUserDatas(body.token))._id);
            if (datas.eventData.users.includes(userId)){
                let deleted = await collection.deleteOne({_id : id});
            closeConnection(database);
            if (deleted?.deletedCount){
                let {collection, database} = new Database("deleted-events");
                let insert = await collection.insertOne({eventData : datas.eventData, otherDatas : datas.otherDatas, versions : datas.versions});
                closeConnection(database);
                if (insert.insertedId) return handleError(logger, "011",res);
            } else return handleError(logger, "014", res);
            }
            else{
                closeConnection(database);
                return handleError(logger, "004", res);
            }
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
            let userId = String((await GetUserDatas(body.token))._id);
            for (let i = 0; i < all_Events.length; i++){
                if (all_Events[i]?.eventData.objectDateOfEvent.getTime() >= new Date().getTime()){
                    all_Events[i]?.eventData.users.includes(userId) ? sendList.push({name : all_Events[i].eventData.name, id : all_Events[i].eventData.readable_event_name, eventDate : all_Events[i].eventData.objectDateOfEvent}) : false;
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
                    let fullPrices = await GetFullPrice(body.datas, body.eventId);
                    if (fullPrices.error) return handleError(logger, fullPrices.errorCode, res);
                    savingDatas.tickets = fullPrices.tickets;
                    savingDatas.fullPrice = fullPrices.fullPrice;
                    savingDatas.fullAmount = fullPrices.fullAmount;
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
    if( !ticketInfo ) return handleError(logger, "030", res);
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
    closeConnection(database);
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
    console.log(ticketInfo)
    axios(axiosConfig)
        .then((email_response) => res.send({'filename': email_response.data}))
        .catch((err) => {logger.err(`Failed ticket creation with`); console.log(err)});
})

app.get("/api/v1/buy-ticket-details/:token", async (req,res)=>{
    if (req.params && req.params.token){
        const {collection, database} = new Database("pre-buying");
        let datas = await collection.findOne({_id : new ObjectId(req.params.token)});
        closeConnection(database);
        if (datas && datas.time + getTime("RESERVATION_TIME") >= new Date().getTime() && datas.eventId){
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
            let userId = String((await GetUserDatas(req.body.token))._id);
            res.send(await Sales(userId));
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
});

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
});

app.post("/api/v1/save-local-discount", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token && req.body.datas){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("local-discount")){
            if (req.body.datas.name && req.body.datas.amount){
                const {collection, database} = new Database("local-discount");
                let result = await collection.insertOne({name : req.body.datas.name, amount : req.body.datas.amount, money : req.body.datas.type, datas : await otherData(req,req.body.token)});
                closeConnection(database);
                return res.send({error : !result.insertedId});
            }
        }
        return handleError(logger, "004", res);
    }
    handleError(logger, "400",res);
});

app.post("/api/v1/save-local-discount/:id", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token && req.body.datas && req.params.id){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("local-discount")){
            if (req.body.datas.name && req.body.datas.amount){
                const {collection, database} = new Database("local-discount");
                let result = await collection.updateOne({_id : ObjectId(req.params.id)}, {$set : {name : req.body.datas.name, amount : req.body.datas.amount, money : req.body.datas.type, datas : await otherData(req,req.body.token)}});
                closeConnection(database);
                return res.send({error : !result.acknowledged});
            }
        }
        return handleError(logger, "004", res);
    }
    handleError(logger, "400",res);
});


app.post("/api/v1/get-local-discounts", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && (access.includes("local-discount") || access.includes("local-sale"))){
            const {collection, database} = new Database("local-discount");
            let result = await collection.find({}, { projection: { name: 1, amount: 1, money : 1, _id : 1 } }).toArray();
            closeConnection(database);
            return res.send({datas : result});
        }
        return handleError(logger, "004", res);
    }
    handleError(logger, "400",res);
});

app.post("/api/v1/delete-local-discount/:id", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token && req.params.id){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("local-discount")){
            console.log(req.params.id);
            const {collection, database} = new Database("local-discount");
            let result = await collection.deleteOne({_id : ObjectId(req.params.id)})
            closeConnection(database);
            return res.send({datas : result.deletedCount});
        }
        return handleError(logger, "004", res);
    }
    handleError(logger, "400",res);
})


//TODO error handling
app.post("/api/v1/control-coupon-code", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.code && body.eventId){
        res.send(await controlCoupon(body.code, body.eventId, 0));
    }
})

/*app.post("/upload-backgroumd-image-to-venue", (req,res)=>{
    console.log(req.files);
})*/

const simplesign = (data) => cryptoJs.enc.Base64.stringify(cryptoJs.HmacSHA384(JSON.stringify(data).replace(/\//g, "\\\/"), process.env.MERCHANT));

//PAYMENT

app.post("/api/v1/buy-local", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body && req.body.datas && typeof req.body.datas === "object" && req.body.token){
        let error = false;
        let access = await control_Token(req.body.token, req);
        if (access.includes("local-sale")){
        result = await controlEvent(req.body.datas.eventId, req.body.datas.tickets);
        if (result.error) return handleError(logger, result.errorCode, res);
        price = await GetFullPrice(req.body.datas.tickets, req.body.datas.eventId);
        if (!price.error){
            const uid = new ShortUniqueId({length: 32});
            const uuid = uid();
            let saveDatas = {
                    user : await GetUserDatas(req.body.token),
                    local : true,
                    customerDatas : {},
                    time : new Date().getTime(),
                    pending : false,
                    status : true,
                    bought : true,
                    salt : uuid,
                    fullPrice : price.fullPrice,
                    tickets : price.tickets,
                    price : await controlLocalDiscount(req.body.datas.discount, price.fullPrice, req.body.datas.eventId),
                    localCoupon : req.body.datas.discount ? req.body.datas.discount : false,
                    coupon : false,
                    eventId : req.body.datas.eventId,
                    fullAmount : price.fullAmount
            }
            //console.log(saveDatas);
            const {collection, database} = new Database("buy");
            let result = await collection.insertOne(saveDatas);
            let eventDatas = await getTicketByReadableId(req.body.datas.eventId);
            let tickets = await Tickets(result.insertedId,price.tickets, eventDatas.venue, req.body.datas.eventId, true);
            closeConnection(database);
            let files = await  GenerateTicket(tickets);
            let sysConfig = readConfig()
            for (let i = 0; i < files.length; i++){
                files[i] = sysConfig["NODE_SHARE"] + `/${files[i]}`;
            }
            //console.log(files);
            zip = await createZip(files, `${result.insertedId}.zip`);
            res.writeHead(200, {
                'Content-Disposition': `attachment; filename="${result.insertedId}.zip"`,
                'Content-Type': "application/zip",
              })
            return res.end(zip); //fs.readFileSync(`${__dirname}/${sysConfig["ZIP_DIR"]}/${result.insertedId}.zip`)
            //return res.send({error : !result.insertedId, id : saveDatas.salt});
        
        }
    }
        }
    return handleError(logger, "004", res);
        
});


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
                        let fullPrice = await GetFullPrice(buyingDatas.tickets, buyingDatas.eventId);
                        const uid = new ShortUniqueId({length: 32});
                        const uuid = uid();
                        saveDatas = {
                            price : price ? price : buyingDatas.fullPrice,
                            fullPrice : fullPrice.fullPrice,
                            customerDatas : req.body.datas.customerData,
                            time : new Date().getTime(),
                            coupon : !error ? name : false,
                            eventId : buyingDatas.eventId,
                            tickets : buyingDatas.tickets,
                            pending : true,
                            status : false,
                            bought : false,
                            salt: uuid,
                            fullAmount : buyingDatas.fullAmount
                        };
                    let l = new Database("buy");
                    result = await l.collection.insertOne(saveDatas);

                    /*let body = {
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
                        url: '',
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
                    /*await axios.post('https://sandbox.simplepay.hu/payment/v2/start', body, {headers: {
                        'Content-type': 'application/json',
                        'Signature': simplesign(body),
                    }}).then((simple_res) => {
                        return res.send({error : !result.acknowledged, paymentUrl: simple_res.body.paymentUrl});
                    })*/
                    closeConnection(l.database);
                    }
                }
                else{
                    return handleError(logger, result.errorCode ? result.errorCode : "001" ,res)
                }
            }
        }
    }
    handleError(logger, "400", res);
})


//COMPANIES
app.post("/api/v1/new-company", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && req.body.token && typeof req.body == TypeOfBody && typeof req.body.datas == "object"){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("companies")){
            const {collection, database} = new Database("companies");
            if (req.body.datas.name && req.body.datas.taxNumber){
                let result = await collection.insertOne({name : req.body.datas.name, tax : req.body.datas.taxNumber, otherDatas : await otherData(req, req.body.token)});
                return res.send({error : result.insertedId > 0});
            }
            closeConnection(database);
        }
    }
    handleError(logger, "004", res);
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
    handleError(logger, "003", res);
});


app.post("/api/v1/get-aszf",(req,res,next)=>parseBodyMiddleeware(req,next) ,async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-aszf")){
            try{
            let aszf = fs.readFileSync(`${__dirname}/local/aszf.html`);
            return res.send({error : false, aszf : aszf.toString()});
            }
            catch{
                return handleError(logger,"000",res);
            }
        }
    }
        handleError(logger, "004", res);

});


app.post("/api/v1/edit-aszf", (req,res,next)=>parseBodyMiddleeware(req,next) ,async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-aszf")){
            try{
                if (req.body.datas && req.body.datas.aszf){
                    fs.writeFileSync(`${__dirname}/local/aszf.html`, req.body.datas.aszf);
                    return res.send({error : false});
                }
                else{
                    return res.send({error : true});
                }
            }
            catch{
                return handleError(logger, "000",res);
            }
        }
    }   
    handleError(logger, "004", res);
});


app.get("/api/v1/aszf", async (req,res)=>{
    try{
        let aszf = fs.readFileSync(`${__dirname}/local/aszf.html`)
        return res.send({error : false, aszf : aszf.toString()});
    }catch{
        handleError(logger, "000", res);
    }
});

app.post("/api/v1/get-mail",(req,res,next)=>parseBodyMiddleeware(req,next) ,async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-letter")){
            try{
            let mail = fs.readFileSync(`${__dirname}/local/mail.html`);
            return res.send({error : false, mail : mail.toString()});
            }
            catch{
                return handleError(logger,"000",res);
            }
        }
    }
    handleError(logger, "004", res);

})

app.post("/api/v1/edit-mail", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-letter")){
            try{
                if (req.body.datas && req.body.datas.mail){
                    fs.writeFileSync(`${__dirname}/local/mail.html`, req.body.datas.mail);
                    return res.send({error : false});
                }
                else{
                    return res.send({error : true});
                }
            }
            catch{
                return handleError(logger, "000",res);
            }
        }
    }   
    handleError(logger, "004", res);
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
    let loginTokenDatabase = new Database("short-token");
    loginTokenDatabase.collection.deleteMany();
    collection.deleteMany();
    closeConnection(loginTokenDatabase.database);
    closeConnection(database);
})
cron.schedule("30 3 * * 6", async () => {
    let {collection, database} = new Database("pre-buying");
    //collection.deleteMany();
    let preBuying = collection.find({});
    for(const j in preBuying) if (new Date(coupons[j].time)+1800000 < new Date().getTime()) preBuying[j].delete();     //config
    closeConnection(database);
})
cron.schedule("0 3 * * *", async () => {
    let {collection, database} = new Database("coupons");
    let today = new Date()
    coupons = collection.find({})
    //for(let j in coupons) if (new Date(coupons[j]['validity']) < today) collection.deleteOne({_id : ObjectId(coupons[j]._id)});
    let eventsDatabase = new Database("events");
    let events = await eventsDatabase.collection.find({}).toArray();
    let addition = getTime("DELETABLE_EVENT");
    if (addition > 0) for (let i = 0; i < events.length; i++){ 
        if (new Date(events[i].eventData.dateOfEvent).getTime() + addition < new Date().getTime()) eventsDatabase.collection.deleteOne({_id : ObjectId(events[i]._id)})
    }
    console.log("Autómatikus törlés lefutott");
    closeConnection(database);
    closeConnection(eventsDatabase.database);
    //let orders = DELETABLE_ORDERS
})