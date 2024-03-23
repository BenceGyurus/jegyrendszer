const CryptoJS = require("crypto-js");

//const signWithCryptoJS = (data) => cryptoJs.enc.Base64.stringify(cryptoJs.HmacSHA384(JSON.stringify(data).replace(/\//g, "\\\/"), process.env.MERCHANT_KEY))
const signWithCrypto = (data) =>  {
    const hash = CryptoJS.HmacSHA384(JSON.stringify(data), process.env.MERCHANT_KEY);
    let othersignautre = hash.toString(CryptoJS.enc.Base64)
    return othersignautre
}

module.exports = signWithCrypto;