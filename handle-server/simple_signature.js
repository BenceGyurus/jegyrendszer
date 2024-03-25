const CryptoJS = require("crypto-js");


const signWithCrypto = (data) =>  {
    if (process.env.MERCHANT_KEY){
        const hash = CryptoJS.HmacSHA384(JSON.stringify(data), process.env.MERCHANT_KEY);
        let othersignautre = hash.toString(CryptoJS.enc.Base64)
        return othersignautre
    }
    return false;
}

module.exports = signWithCrypto;