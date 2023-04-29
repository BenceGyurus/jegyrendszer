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
const TypeOfBody = "object";

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
    if (body && typeof body == TypeOfBody && body.username && body.password){
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
        let { collection } = new Database("new-user");
        let token = Functions.genrateToken();
        let userAccess = [];
        let accesses = Functions.readJson("user/accesslist.json");
        console.log(body.access, accesses);
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
    let { collection } = new Database("new-user");
    let datas = await collection.findOne({token : token});
    body.access = datas ? datas.access : false;
    let access = Functions.control_Access(body);
    console.log(access);
    console.log(datas && datas.datas.timeInMil + 259200000,new Date().getTime())
    if (datas && datas.datas.timeInMil + 259200000 > new Date().getTime()){
        if (Functions.control_Password_And_Username(body) && access){
            let { collection } = new Database("admin");
            let pedding = new Database("new-user").collection;
            if (!await collection.findOne({username : body.username})){
                collection.insertOne({username : body.username, password : Functions.encryption(body.password), readable_user_id : Functions.sanitizeingId(body.username), addedBy : datas.datas.userData, datas : await otherData(req), deleteable : true, access : access});
                res.send({error :  !(await pedding.deleteOne({token : token})).acknowledged});
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
    }
    else{
        handleError("007", res);
    }
});

app.post("/delete-user", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
        console.log(body);
        let access = await control_Token(body.token, req);
        console.log(access);
        let usersCollection = new Database("admin").collection;
    if (access && access.includes("edit-users")){
        if (body.userId){
            let id = new ObjectId(body.userId);
            let user = await usersCollection.findOne({_id : id});
            let deletedUsersCollection = new Database("deleted-users").collection;
            if (user && user.deleteable){ 
                usersCollection.deleteOne({_id : id}); 
                await deletedUsersCollection.insertOne({ userData : user, deletedBy : await otherData(req, req.token) , datas : Functions.getBrowerDatas});
                handleError("011", res);
                return ;
            }
            handleError("013", res);
        }
        else{
            handleError("012", res);
        }
    }else{
        handleError("004", res);
        //res.send({error : true, errorCode : "004"});
    }
    }
    else{
        handleError("004", res);
    }
});

app.post("/add-event", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body && body.token){
    let access = await control_Token(body.token, req);
    if (access && access.includes("edit-users")){
        let { collection } = new Database("events");
        return;
    }
    }
    handleError("004", res);
});

app.post("/upload-venue/:id", (req,res,next)=>parseBodyMiddleeware(req,next) ,async (req,res)=>{
    if (req.params.id && req.body && typeof req.body === TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-rooms") && controlTypesOfVenues(req.body.datas)){
            let { collection } = new Database("venue");
            let id = new ObjectId(req.params.id);
            let lastVersion = await collection.findOne({_id : id});
            if (lastVersion){
                console.log(lastVersion.versions);
            lastVersion.versions.push({content : lastVersion.content, addedBy: lastVersion.addedBy, id : Functions.genrateToken})
            let updated = await collection.updateOne({_id : id}, {$set : {content : req.body.datas, addedBy : await otherData(req, req.body.token), versions : lastVersion.versions}});
            console.log(updated);
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
        let { collection } = new Database("venue");
        let datas = await collection.insertOne({content : body.datas, addedBy : await otherData(req, body.token), versions : []});
        if (datas.insertedId){
        res.send({id : datas.insertedId});
        }
        else{
            handleError("000", res);
        }
        return;
    }}
    handleError("004", res);
})
app.post("/new-long-token", async (req,res)=>{
    let body = Functions.parseBody(req.body);
    if (body && typeof body == TypeOfBody && body.token){
    let access = await control_Token(body.token, req);
    if (access && access.includes("profile")){
        let { collection } = new Database("long-token");
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
            return;
        }
        else{
            handleError("009", res);
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
        if (access.includes("edit-events") || access.includes("edit-rooms")){
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
        let { collection } = new Database("venue");
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
                let { collection } = new Database("venue");
                datas = await collection.findOne({ _id : id });
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
        let { collection } = new Database("venue");
        let Ddatas = {}
        Ddatas.deletedContent = await collection.findOne({_id : id});
        let datas = await collection.deleteOne({_id : id});
        let deletedDb = new Database("deleted-venues").collection;
        Ddatas.deletedBy = await otherData(req, body.token);
        deletedDb.insertOne(Ddatas);
        res.send(datas);
        return;
    }
    }
    handleError("004", res);
});

app.post("/users", (req,res, next)=>parseBodyMiddleeware(req,next) ,async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-users")){
            let { collection } = new Database("admin");
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
            let pedding = new Database("new-user").collection;
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
            return;
        }
    }
    handleError("004", res);
});

app.post("/edit-user/:id", (req,res,next)=>parseBodyMiddleeware(req,next), async (req,res)=>{
    if (req.body && typeof req.body == TypeOfBody && req.body.token){
        let access = await control_Token(req.body.token, req);
        if (access && access.includes("edit-users")){
            console.log(req.body.datas);
        }
    }
})

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
            let {collection} = new Database("venue")
            let datas = await collection.find().toArray();
            let sendArray = []
            if (datas){
                for (let i = 0; i < datas.length; i++){
                    sendArray.push({title : datas[i].content.name, value : datas[i]._id});
                }
            }
            res.send({datas : sendArray});
            return;
        }
    }
    handleError("004", res);
})

/*app.post("/upload-backgroumd-image-to-venue", (req,res)=>{
    console.log(req.files);
})*/


app.listen(process.env.PORT || 3001);