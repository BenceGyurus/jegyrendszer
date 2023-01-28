const express = require("express");
const app = express();
module.exports = app;

app.use(express.static("public"));

app.get("/", (req,res)=>{
    res.sendFile("public/index.html");
});

app.listen(process.env.PORT || 8000);