const crypto = require('crypto');

//const signWithCryptoJS = (data) => cryptoJs.enc.Base64.stringify(cryptoJs.HmacSHA384(JSON.stringify(data).replace(/\//g, "\\\/"), process.env.MERCHANT_KEY))
const signWithCrypto = (data) =>  {
    let othersignautre = crypto.createHmac('sha384', process.env.MERCHANT_KEY)
        .update(JSON.stringify(data).replace(/\//g, "\\\/"))
        .digest('base64');
    return othersignautre
}

module.exports = signWithCrypto;