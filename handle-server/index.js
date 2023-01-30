const express = require("express");
const app = express();
const fs = require("fs");
module.exports = app;

function getEvents(id){
    let datas = JSON.parse(fs.readFileSync(`${__dirname}/public/datas.json`));
    if (!id){
        return datas;
    }
    let findData;
    datas.forEach(element => {
        String(element._id) == String(id) ? findData = element : false;
    });
    return findData;
}

app.use(express.static("public"));

app.get("/", (req,res)=>{
    res.sendFile(`${__dirname}/public/index.html`);
});

app.get("/:id", (req,res)=>{
    res.sendFile(`${__dirname}/public/event.html`);
});

app.post("/event/:id", (req,res)=>{
    let d = getEvents(req.params.id);
    if (!d){
        d = {error: true};
    }
    res.send(JSON.stringify(d));
})

app.listen(process.env.PORT || 3000);