const cryptoJs = require("crypto-js");
const crypto = require('crypto');

const key = "FxDa5w314kLlNseq2sKuVwaqZshZT5d6"

const signWithCryptoJS = (data) => cryptoJs.enc.Base64.stringify(cryptoJs.HmacSHA384(JSON.stringify(data).replace(/\//g, "\\\/"), key))
const signWithCrypto = (data) =>  {
    let othersignautre = crypto.createHmac('sha384', key)
        .update(JSON.stringify(body).replace(/\//g, "\\\/"))
        .digest('base64');
    return othersignautre
}

let body = {
    "salt":"c1ca1d0e9fc2323b3dda7cf145e36f5e",
    "merchant":"PUBLICTESTHUF",
    "orderRef":"101010516348232058105",
    "currency":"HUF",
    "customerEmail":"sdk_test@otpmobil.com",
    "language":"HU",
    "sdkVersion":"SimplePayV2.1_Payment_PHP_SDK_2.0.7_190701:dd236896400d7463677a82a47f53e36e",
    "methods":["CARD"],
    "total":"25",
    "timeout":"2021-10-30T12:30:11+00:00",
    "url":"https:\/\/sdk.simplepay.hu\/back.php"}

console.log(signWithCrypto(body));
console.log(signWithCryptoJS(body));