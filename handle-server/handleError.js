const fs = require("fs");
const handleError = (logger, errorCode, res, numberOfTries)=>{
    error = {};
    try{
        error = JSON.parse(fs.readFileSync(`${__dirname}/errorCodes.json`))[errorCode];
        if (!error && numberOfTries < 1){
            handleError("000", res, numberOfTries ? numberOfTries+1 : 0);
            return 0;
        }
        else if (!error && numberOfTries >= 1){
            error = {message : "Váratlan hiba történt kérjük próbálja megkésőbb", type : "error", responseCode : 404, error : true}
        }
    }
    catch{
        error = {message : "Váratlan hiba történt kérjük próbálja újra később", error : true, type : "error", responseCode : 404};
    }
    error.responseCode ? res.status(error.responseCode) : false; 
    logger.log(`Bad request - Error code ${errorCode}: ${error?.message}`)
    res.send({message : error.message, type : error.type, error : error.type == "error"});
}

module.exports = handleError;