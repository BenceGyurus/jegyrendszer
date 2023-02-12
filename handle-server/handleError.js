const fs = require("fs");
const handleError = (errorCode, res, numberOfTrys)=>{
    error = {};
    try{
        error = JSON.parse(fs.readFileSync(`${__dirname}/errorCodes.json`))[errorCode];
        if (!error && numberOfTrys < 1){
            handleError("000", res, numberOfTrys ? numberOfTrys+1 : 0);
            return 0;
        }
        else if (!error && numberOfTrys >= 1){
            error = {message : "Váratlan hiba történt kérjük próbálja megkésőbb", type : "error", responseCode : 404}
        }
    }
    catch{
        error = {message : "Váratlan hiba történt kérjük próbálja újra később", error : true, type : "error", responseCode : 404};
    }
    res.status(error.responseCode);
    res.send({message : error.message,type : error.type});
}

module.exports = handleError;