const getTime = require("./getTime");
const Database = require("./mongo/mongo");
const signWithCryptoJS = require("./simple_signature");
const axios = require('axios');

const closeConnection = (database)=>{
    try{
        setTimeout(()=>{
            database.close();
        },10000);
    }catch{
        return;
    }
}

const SimplePayPayment = async (salt, orderRef, customerDatas, ticketDatas, price)=>{
    return new Promise((resolve, reject)=>{

        let body = {
            salt: salt,
            merchant: process.env.MERCHANT,
            orderRef: String(orderRef),
            currency: 'HUF',
            customerEmail: customerDatas.mail,
            language: 'HU',
            sdkVersion: 'SimplePayV2.1_Payment_PHP_SDK_2.0.7_190701:dd236896400d7463677a82a47f53e36e',
            methods:[
                "CARD"
            ],
            total: price,
            timeout: new Date(new Date().getTime() + getTime("PAYMENT_DELAY")).toISOString(),
            url: '',
            invoice: {
                    name: customerDatas.isCompany ? customerDatas.firstname : `${customerDatas.firstname} ${customerDatas.lastname}`,
                    company: 'hu',
                    //state: ,
                    city: customerDatas.city,
                    zip: customerDatas.postalCode,
                    address: customerDatas.address,
                    address2: customerDatas.address2 == 'null' ? null : customerDatas.address2,
                    phone: customerDatas.phone
                },
                items: [
                    ticketDatas.map(x => {
                        return {
                            ref: x.ticketId,
                            title: x.name,
                            desc: '',
                            amount: x.amount,
                            price: x.unitPrice
                            }
                        })
                    ]
                }

            const sign = signWithCryptoJS(body);

            let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://sandbox.simplepay.hu/payment/v2/start',
                    headers: {
                        'Content-type': 'application/json',
                        'Signature': sign,
                     },
                     data : body
                };
    
            /*axios.request('https://sandbox.simplepay.hu/payment/v2/start',config).then((result) => {
                resolve({paymentUrl: result.body.paymentUrl});
            })
            .catch(()=>{
                reject({error : true, response : result});
            })*/

            resolve(config);
    });


    }

module.exports = SimplePayPayment;