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

const closeConnection = (database)=>{
    setTimeout(()=>{
        database.close();
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

app.use(bodyParser.urlencoded({ extended: false }))

        //GET requests//

app.get("/events", async (req,res) =>{
    let {collection, database} = new Database("events");
    let datas = await collection.find().toArray();
    let sendDatas = [];
    for (let i = 0; i < datas.length; i++){
        console.log(datas[i].eventData.objectDateOfRelease.getTime(), new Date().getTime(), datas[i].eventData.objectDateOfEvent.getTime(), new Date().getTime())
        console.log(datas[i].eventData.objectDateOfRelease.getTime() <= new Date().getTime() && datas[i].eventData.objectDateOfEvent.getTime() >= new Date().getTime())
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


app.get("/event/:id", async (req,res)=>{
    let id = req.params.id;
    let {collection, database} = new Database("events");
    let events = await collection.find().toArray();
    let event = {};
    if (events){
        for (let i = 0; i < events.length; i++){
            if (events[i].eventData.readable_event_name === id){
                event = events[i].eventData;
            }
        }
    }
    if (event){
        let l = new Database("venue");
        let placeCollection = l.collection;
        place = {};
        if (event.venue){
            place = await placeCollection.findOne({_id : new ObjectId(event.venue)});
            closeConnection(l.database);
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
            }
            place.seatsDatas = placesOfEvent;
            
        }
        res.send({id : event.readable_event_name, background : event.background ,title : event.name, description : event.description, date : event.objectDateOfEvent, tickets : Functions.getPlaces(event.tickets), places : place});
        closeConnection(database);
        return;
    }
});


app.get("/buy-ticket-details/:token", async (req,res)=>{
    if (req.params && req.params.token){
        const {collection, database} = new Database("pre-buying");
        let datas = await collection.findOne({token : req.params.token});
        if (datas.time + 1800000 >= new Date().getTime() && datas && datas.eventId){
            let eventDetails = await getTicketByReadableId(datas.eventId);
            if (eventDetails){
                res.send({eventId : datas.eventId, tickets : datas.tickets, fullAmount : datas.fullAmount, fullPrice : datas.fullPrice, eventName : eventDetails.name, dateOfEvent : eventDetails.objectDateOfEvent});
            }
            return;
        }
    }
    handleError("019", res);
    closeConnection(database);
});

        //POST requests//


//access query


app.use(express.static('uploads'));

app.post("/get-access", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    res.send({access : Functions.merge_Access(await control_Token(body.token, req))});
})


    //login begin

app.post("/get-long-token", async (req,res, next) =>{
    let body = Functions.parseBody(req.body);
    if (body.token){
        let {collection, database} = new Database("short-token");
        let tokenDatas = await collection.findOne({token : body.token});
        let database1 = database;
        if (tokenDatas && tokenDatas.datas.ip){
            if (tokenDatas.datas.ip == Functions.getIp(req) && tokenDatas.datas.timeInMil + 60000 > new Date().getTime()){
                let {collection, database} = new Database("long-token");
                let token = Functions.genrateToken();
                collection.insertOne(await Topology.longTokenData(token, tokenDatas.userData, req));
                res.send({token : token, access : Functions.merge_Access(tokenDatas.userData.access), expires_in : 21600000});
                closeConnection(database);
                closeConnection(database1);
                return 0;
            }
            else{
                handleError("002", res);
                //res.send({error : true, errorCode : "002"})     //Helytelen ip vagy időtúllépés a bejelentkezés során
                return 0;
            }
        }
        closeConnection(database1);
    }
    handleError("003", res);
    //res.send({error : true, errorCode : "003"});            //Nincs token
});



app.post("/login", async (req, res, next) =>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.username && body.password){
        let {collection, database} = new Database("admin");
        user = await collection.findOne({username : body.username, password : Functions.encryption(body.password)});
        closeConnection(database);
        if (user){
            let {collection, datebase} = new Database("short-token");
            let token = Functions.genrateToken();
            let datas = await otherData(req);
            let userData = Topology.newUserDatas(user);
            await collection.insertOne({token : token, datas : datas, userData : userData});
            res.send({
                token : token
            });
            closeConnection(database);
        }
        else{
            handleError("006", res);//res.send({error : true,errorCode : "006"}) //Rossz felhasználónév vagy jelszó
        }
        }
    else{
        handleError("006", res);
    }       
});

        //login end

app.post("/add-new-user", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
    let access = await  control_Token(body.token, req);
    if (access && access.includes("edit-users")){
        let { collection, database } = new Database("new-user");
        let token = Functions.genrateToken();
        let userAccess = [];
        let accesses = Functions.readJson("user/accesslist.json");
        if (body.access && accesses){
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
    else{
        handleError("004", res);
        //res.send({error : true, errorCode : "004"});        //Nincs hozzáférése
    }
    }
    else{
        handleError("004", res);
    }
});

app.post("/create-profile/:token", async (req,res)=>{
    let token = req.params.token;
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
            let { collection,database } = new Database("admin");
            let l = new Database("new-user");
            let pedding = l.collection;
            if (!await collection.findOne({username : body.username})){
                collection.insertOne({username : body.username, password : Functions.encryption(body.password), readable_user_id : Functions.sanitizeingId(body.username), addedBy : datas.datas.userData, datas : await otherData(req), deleteable : true, access : access});
                res.send({error :  !(await pedding.deleteOne({token : token})).acknowledged});
            }
            else{
                handleError("010", res);
                //res.send({error : true, errorCode : "010"});        //Felhasználónév foglalt
            }
            closeConnection(database);
            closeConnection(l.database);
        }
        else{
            handleError("008", res);
            //res.send({error : true, errorCode : "008"});        //A jelszónak minimum 8 karakterből kell állnia és kell tartalmaznia legalább 1 számot
        }
    }else{
        handleError("007", res);
        //res.send({error : true, errorCode : "007"});         //Rossz regisztrációs token vagy időtúllépés
    }
    }
    else{
        handleError("007", res);
    }
});

app.post("/delete-user", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        let l = new Database("admin");
        let usersCollection = l.collection;
        let userDatabase = l.database;
    if (access && access.includes("edit-users")){
        if (body.userId){
            let id = new ObjectId(body.userId);
            let user = await usersCollection.findOne({_id : id});
            let l = new Database("deleted-users");
            let deletedUsersCollection = l.collection;
            if (user && user.deleteable){ 
                usersCollection.deleteOne({_id : id}); 
                await deletedUsersCollection.insertOne({ userData : user, deletedBy : await otherData(req, req.token) , datas : Functions.getBrowerDatas});
                handleError("011", res);
                closeConnection(l.databse);
                return ;
            }
            closeConnection(l.databse);
            handleError("013", res);
        }
        else{
            handleError("012", res);
        }
    }else{
        handleError("004", res);
        //res.send({error : true, errorCode : "004"});
    }
    closeConnection(userDatabase);
    }
    else{
        handleError("004", res);
    }
});


app.post("/upload-venue/:id", (req,res,next)=>parseBodyMiddleeware(req,next) ,async (req,res)=>{
    if (req.params.id && req.body && typeof req.body === TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-rooms") && controlTypesOfVenues(req.body.datas)){
            let { collection,database } = new Database("venue");
            let id = new ObjectId(req.params.id);
            let lastVersion = await collection.findOne({_id : id});
            if (lastVersion){
                console.log(lastVersion.versions);
            lastVersion.versions.push({content : lastVersion.content, addedBy: lastVersion.addedBy, id : Functions.genrateToken})
            let updated = await collection.updateOne({_id : id}, {$set : {content : req.body.datas, addedBy : await otherData(req, req.body.token), versions : lastVersion.versions}});
            closeConnection(database);
            if (updated.modifiedCount){
                res.send({id : req.params.id});
                return;
            }
            else{
                handleError("000", res);
                return;
            }}
            else{
                handleError("000", res);
                return;
            }
        }
    }
    handleError("004", res);
});


app.post("/upload-venue", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
    let access = await control_Token(body.token, req);
    if (access && access.includes("edit-rooms") && controlTypesOfVenues(body.datas)){
        let { collection,database } = new Database("venue");
        let datas = await collection.insertOne({content : body.datas, addedBy : await otherData(req, body.token), versions : []});
        if (datas.insertedId){
        res.send({id : datas.insertedId});
        }
        else{
            handleError("000", res);
        }
        closeConnection(database);
        return;
    }}
    handleError("004", res);
})
app.post("/new-long-token", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
    let access = await control_Token(body.token, req);
    if (access && access.includes("profile")){
        let { collection, database } = new Database("long-token");
        let datas = await collection.findOne({token : body.token});
        let usersCollection = new Database("admin").collection;
        let userData = await usersCollection.findOne({username : datas.userData.username, _id : mongodb.ObjectId(datas.userData.id)});
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
            handleError("009", res);
            closeConnection(database);
            return;
            //res.send({error : true, errorCode : "009"});        //Felhasználó nem található
        }
    }
    }
    handleError("004", res);
})

app.post('/upload-image/:token', upload.single('file'), async (req, res, next) => {
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
            res.send({path : `${newFilePath}`, width: width,height : height});
        }
    }
    else{
        handleError("004", res);
    }
  });


app.post("/venues", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
    let access = await control_Token(body.token, req);
    if (access && access.includes("edit-rooms")){
        let { collection, database } = new Database("venue");
        let datas = await collection.find().toArray();
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
        closeConnection(database);
        return;
        }
    }
    handleError("004", res);
});

app.post("/venue/:id", (req,res, next)=>parseBodyMiddleeware(req, next), async (req,res)=> {
    if (req.body && typeof req.body == TypeOfBody && req.body.token && req.params.id){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-rooms") && req.params.id){
                if (req.params.id.length === 24){
                id = new ObjectId(req.params.id);
                let { collection, database } = new Database("venue");
                datas = await collection.findOne({ _id : id });
                closeConnection(database);
                if (datas){
                    datas.content.id = datas._id;
                    res.send(datas.content);
                    return;
            }
            }
        }
    }
    handleError("004", res);
})

app.post("/delete-venue/:id", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
    let access = await control_Token(body.token, req);
    if (access && access.includes("edit-rooms") && req.params.id){
        id = new ObjectId(req.params.id);
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
    }
    }
    handleError("004", res);
});

app.post("/users", (req,res, next)=>parseBodyMiddleeware(req,next) ,async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-users")){
            let { collection, database } = new Database("admin");
            let sendDatas = [];
            let datas = await collection.find().toArray();
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
            let pedding = l.collection;
            datas = await pedding.find().toArray();
            for (let i = 0; i < datas.length; i++){
                if (datas[i].datas.timeInMil+259200000 > new Date().getTime()){
                    console.log(datas[i].access);
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
    handleError("004", res);
});

app.post("/edit-user/:id", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-users")){
            if (req.body.datas && typeof req.body.datas == "object" && req.params.id){
                let {collection, database} = new Database("admin");
                let accesslist = Functions.readJson("user/accesslist.json");
                let updateDatas = [];
                if (accesslist){
                    for (let i = 0; i < Object.keys(req.body.datas).length; i++){
                        if (Object.keys(accesslist).includes(Object.keys(req.body.datas)[i]) && req.body.datas[Object.keys(req.body.datas)[i]]){
                            updateDatas.push(Object.keys(req.body.datas)[i]);
                        }
                    }
                }
                !updateDatas.length ? updateDatas = ["profile"] : false;
                console.log(updateDatas);
                let result = await collection.updateOne({_id : ObjectId(req.params.id)}, {$set : {access : updateDatas}});
                res.send({error : !result.modifiedCount});
                closeConnection(database);
            }
        }
    }
});


app.post(`/delete-pedding-user/:id`, (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        if (req.params.id){
            let access = await control_Token(req.body.token, req);
            if (access && access.includes("edit-users")){
                let {collection, database} = new Database("new-user");
                let result = await collection.deleteOne({_id : new ObjectId(req.params.id)});
                res.send({error : !result.deletedCount});
                closeConnection(database);
                return;
            }
        }
    }
    handleError("", res);
});

app.post(`/edit-pedding-user/:id`, (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
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
                }
                !updateDatas.length ? updateDatas = ["profile"] : false;
                let result = await collection.updateOne({_id : new ObjectId(req.params.id)}, {$set : {access : updateDatas}});
                res.send({error : !result.modifiedCount});
                closeConnection(database);
                return ;
            }
        }
    }
    handleError("001", res);
});

app.post("/get-all-access", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-users")){
            res.send(Functions.readJson("user/accesslist.json"));
        }
    }
});

app.post("/get-venues-in-array", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    console.log(req.body);
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
            }
            res.send({datas : sendArray});
            closeConnection(database);
            return;
        }
    }
    handleError("004", res);
})


app.post("/add-event",async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body === TypeOfBody &&body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("edit-events") && body.data && controlTypeOfEvents(body.data)){
            let {collection, database} = new Database("events");
            let insertData = {...body.data, readable_event_name : Functions.sanitizeingId(body.data.name),objectDateOfEvent : new Date(body.data.dateOfEvent), objectDateOfRelease : new Date(body.data.dateOfRelease)};
            let insert = await collection.insertOne({eventData : insertData, otherDatas : await otherData(req,body.token), versions : []});
            closeConnection(database);
            if (insert.insertedId){
                res.send({id : (await collection.findOne({_id : insert.insertedId}))._id});
                return;
            }
        }
    }
    return handleError("004", res);
});

app.post("/get-event-data/:id", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    let id = req.params.id;
    if (body && typeof body === TypeOfBody &&body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("edit-events") && id && id != "undefined"){
            let { collection, database } = new Database("events");
            id = new ObjectId(id);
            let datas = await collection.findOne({_id : id});
            closeConnection(database);
            if (datas && datas.eventData){
                res.send(datas.eventData);
                return;
            }
            else{

            }
        }
    }
    handleError("004", res);
});

app.post("/add-event/:id",async (req,res)=>{
    let body = Functions.parseBody(req.body);
    let id = req.params.id;
    if (body && typeof body === TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("edit-events") && body.data && controlTypeOfEvents(body.data) && id){
            let {collection, database} = new Database("events");
            id = new ObjectId(id);
            let data = await collection.findOne({_id : id});
            body.data = {...body.data, readable_event_name : Functions.sanitizeingId(body.data.name)};
            l = await collection.updateOne({_id : id}, {$set : {eventData : {...body.data, objectDateOfEvent : new Date(body.data.dateOfEvent), objectDateOfRelease : new Date(body.data.dateOfRelease)}, versions : [...data.versions, { eventData : data.eventData, otherDatas : data.otherDatas }], otherDatas : await otherData(req,body.token)}});
            closeConnection(database);
            if (l.modifiedCount){
                res.send({id : id});
                return;
            }
            return handleError("000", res)
        }
    }
    return handleError("004", res);
});

app.post("/events", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body === TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("edit-events")){
            let {collection,database} = new Database("events");
            let datas = await collection.find().toArray();
            let events = [];
            datas.forEach((element)=>{
                events.push({eventData : element.eventData, addedBy : element.otherDatas.userData, id : element._id});
            })
            res.send(events);
            closeConnection(database);
            return
        }
    }
    return handleError("004", res);
});

app.post("/delete-event/:id", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    let id = req.params.id;
    if (body && typeof body === TypeOfBody && body.token && id){
        let access = await control_Token(body.token, req);
        if (access && access.includes("edit-events")){
            let {collection, database} = new Database("events");
            id = ObjectId(id);
            let datas = await collection.findOne({_id : id});
            let deleted = await collection.deleteOne({_id : id});
            closeConnection(database);
            if (deleted.deletedCount){
                let {collection, database} = new Database("deleted-events");
                let insert = await collection.insertOne({eventData : datas.eventData, otherDatas : datas.otherDatas, versions : datas.versions});
                closeConnection(database);
                if (insert.insertedId){
                    return handleError("011",res);
                }
            } 
            else{
                return handleError("014", res);
            }
        }
    }
    handleError("003", res);
});


app.post("/get-user-data", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("profile")){
            let {collection, database} = new Database("long-token");
            datas = await collection.findOne({token : body.token});
            let l = new Database("admin");
            let usersCollection = l.collection;
            let username = (await usersCollection.findOne({_id : datas.userData.id})).username
            res.send({username : username, id : datas.userData.id});
            closeConnection(database);
            closeConnection(l.database);
            return;
        }
    }
    handleError("003", res)
})


app.post("/change-username", async (req,res) =>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("profile")){
            let l = new Database("admin");
            let changeUsernameCollection = l.collection;
            if (body.datas.username.length > 4 && !await changeUsernameCollection.findOne({username : body.datas.username})){
            let {collection, database} = new Database("long-token");
            datas = await collection.findOne({token : body.token});
            response = await changeUsernameCollection.updateOne({_id : datas.userData.id},{$set : {username : body.datas.username}});
            res.send({username : response.modifiedCount > 0 ? body.datas.username : (await changeUsernameCollection.findOne({_id : datas.userData.id})).username});
            closeConnection(database);
            closeConnection(l.database);
            }
            else{
                body.datas.username.length <= 4 ? handleError("018", res) : handleError("010", res);
            }
            return
        }
    }
    handleError("003", res)
})


app.post("/change-password", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("profile")){
            if (Functions.controlPassword(body.datas.password)){
                let {collection, database} = new Database("long-token");
                datas = await collection.findOne({token : body.token});
                let l = new Database("admin");
                let changeUsernameCollection = l.collection;
                response = await changeUsernameCollection.updateOne({_id : datas.userData.id, password : Functions.encryption(body.datas.oldPassword)}, {$set : {password : Functions.encryption(body.datas.password)}});
                res.send({update : response.modifiedCount > 0});
                closeConnection(database);
                closeConnection(l.database);
            }
            else{
                handleError("008",res);
            }
            return;
        }
    }
    handleError("003", res)
});


app.post("/order-ticket", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.datas && body.datas.length && body.eventId){
        let eventDatas = await getTicketByReadableId(body.eventId);
        let savingDatas = {eventId : body.eventId, tickets : [], token : Functions.genrateToken(), time : new Date().getTime(), fullPrice : 0, fullAmount : 0};
        for (let i = 0; i < body.datas.length; i++){
            if (body.datas[i].ticketId && body.datas[i].eventId && eventDatas){
                let response = await Control_Seats(body.datas[i].places, body.datas[i].ticketId, body.datas[i].eventId);
                if (response){
                    for (let j = 0; j < eventDatas.tickets.length; j++){
                        if (eventDatas.tickets[j].id == body.datas[i].ticketId){
                            if (!body.datas[i].places || (body.datas[i].places.length == body.datas[i].amount)){
                                savingDatas.tickets.push({places : body.datas[i].places, price : eventDatas.tickets[j].price*body.datas[i].amount, amount : body.datas[i].amount, name : eventDatas.tickets[j].name})
                                savingDatas.fullPrice += eventDatas.tickets[j].price*body.datas[i].amount
                                savingDatas.fullAmount += body.datas[i].amount;
                            }
                            else{
                                handleError("016", res);
                                return;
                            }
                        }
                    }
                }
                else{
                    handleError("015", res);
                    return;
                }
            }
            else{
                handleError("017", res);
            }
        }
        let {collection, database} = new Database("pre-buying");
        collection.insertOne({...savingDatas, otherDatas : await otherData(req)});
        res.send({error : false, token : savingDatas.token});
        closeConnection(database);
        return
    }
    handleError("000", res);
});

app.post("/get-all-event", async (req,res)=>{
    const body = Functions.parseBody(req.body);
    if (body && typeof body === TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("ref")){
            let sendList = [];
            let {collection, database} = new Database("events")
            let all_Events = await collection.find().toArray();
            for (let i = 0; i < all_Events.length; i++){
                if (all_Events[i].eventData.objectDateOfEvent.getTime() >= new Date().getTime()){
                    sendList.push({name : all_Events[i].eventData.name, id : all_Events[i].eventData.readable_event_name, eventDate : all_Events[i].eventData.objectDateOfEvent})
                }
            }
            res.send({events : sendList});
            closeConnection(database);
            return;
        }
    }
});


app.post("/new-coupon", async (req,res)=>{
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
                handleError("020", res);
            }
            else{
                handleError("001", res);
            }
            closeConnection(database)
        }
        else{
            handleError("004", res);
        }
    }
    else{
        handleError("030", res);
    }
})


app.post("/get-coupons", async (req,res)=>{
    const body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("ref")){
            let {collection, database} = new Database("coupons");
            let sendDatas = [];
            let datas = await collection.find().toArray();
            datas.forEach(element=>{
                new Date(element.validity).getTime() >= new Date().getTime() ? sendDatas.push(element) : false;
            });
            res.send({coupons : sendDatas});
            closeConnection(database);
            return;
        }
    }
});


app.post("/delete-coupon/:id", async (req,res) =>{
    const body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        let access = await control_Token(body.token, req);
        if (access && access.includes("ref")){
            if (req.params.id){
                let {collection, database} = new Database("coupons");
                d = await collection.deleteOne({_id : new ObjectId(req.params.id)});
                res.send({error : d.deletedCount==0});
                closeConnection(database);
                return;
            }
        }
    }
});

app.post("/edit-coupon/:id", async (req,res)=>{
    const body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token && body.datas){
        let access = await control_Token(body.token, req);
        if (req.params.id){
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
            }
    }
    }
})

app.post("/control-coupon-code", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.code && body.eventId){
        let {collection, database} = new Database("coupons");
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
        closeConnection(database);
    }
})

/*app.post("/upload-backgroumd-image-to-venue", (req,res)=>{
    console.log(req.files);
})*/



if (controlConnection()){
    console.log(`The connection is successfully, the app is listening on PORT${process.env.PORT || 3001}`)
    app.listen(process.env.PORT || 3001);
}
else{
    console.log("Couldn't connect to the database")
}