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
        let {collection} = new Database("short-token");
        let tokenDatas = await collection.findOne({token : body.token});
        if (tokenDatas && tokenDatas.datas.ip){
            if (tokenDatas.datas.ip == Functions.getIp(req) && tokenDatas.datas.timeInMil + 60000 > new Date().getTime()){
                let {collection} = new Database("long-token");
                let token = Functions.genrateToken();
                console.log(await Topology.longTokenData(token, tokenDatas.userData, req));
                collection.insertOne(await Topology.longTokenData(token, tokenDatas.userData, req));
                res.send({token : token, access : Functions.merge_Access(tokenDatas.userData.access), expires_in : 21600000});
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

app.post("/upload-venue/:id", async (req,res)=>{
    if (body.params.id){
        console.log(body.params.id);
    }
    else{
        console.log("nincs")
    }
    console.log(Functions.parseBody(req.body));
});


app.post("/upload-venue", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    let access = await control_Token(body.token, req);
    console.log(controlTypesOfVenues(body.datas));
    if (access && access.includes("edit-rooms") && controlTypesOfVenues(body.datas)){
        let { collection } = new Database("venue");
        let datas = await collection.insertOne(body.datas);
        console.log(datas);
        res.send(datas);
    }
    else{
        handleError("004", res);
    }
})
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

app.post('/upload-backgroumd-image-to-venue', upload.single('file'), async (req, res, next) => {
    const file = req.file;
    console.log(file.buffer);
    if (!file) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
    console.log(file);
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
    res.send({path : newFilePath, width: width,height : height});
  })


app.post("/venues", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    let access = await control_Token(body.token, req);
    if (access && access.includes("edit-rooms")){
        let { collection } = new Database("venue");
        let datas = await collection.find().toArray();
        let sendDatas = [];
        for (let i = 0; i < datas.length; i++){
            sendDatas.push({
                name : datas[i].name,
                places : datas[i].places,
                seatsDatas : datas[i].seatsDatas,
                colorOfBackGround : datas[i].colorOfBackGround,
                id : datas[i]._id,
                sizeOfSeat : datas[i].sizeOfSeat,
                colorOfSeat : datas[i].colorOfSeat,
                sizeOfArea : datas[i].sizeOfArea
            });
        }
        res.send({venues : sendDatas});
    }
    else{
        handleError("004", res);
    }
})

app.post("/delete-venue/:id", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    let access = await control_Token(body.token, req);
    if (access && access.includes("edit-rooms") && req.params.id){
        id = new ObjectId(req.params.id);
        let { collection } = new Database("venue");
        let Ddatas = await collection.findOne({_id : id});
        let datas = await collection.deleteOne({_id : id});
        let deletedDb = new Database("deleted-venues").collection;
        deletedDb.insertOne(Ddatas);
        res.send(datas);
    }
})

/*app.post("/upload-backgroumd-image-to-venue", (req,res)=>{
    console.log(req.files);
})*/


app.listen(process.env.PORT || 3001);