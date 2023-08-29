const getTime = require("./getTime");
const Database = require("./mongo/mongo");

const closeConnection = (database)=>{
    try{
        setTimeout(()=>{
            database.close();
        },10000);
    }catch{
        return;
    }
}

const SimplePayPayment = (salt, orderRef, customerDatas, ticketDatas, price)=>{
    let body = {
                salt: salt,
                merchant: process.env.MERCHANT,
                orderRef: orderRef,
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
                        name: `${customerDatas.firstname} ${customerDatas.lastname}`,
                        company: 'hu',
                        //state: ,
                        city: customerDatas.city,
                        zip: customerDatas.postalCode,
                        address: customerDatas.address,
                        address2: customerDatas.address2 == 'null' ? null : req.body.datas.customerDatas.address2,
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
                    /*await axios.post('https://sandbox.simplepay.hu/payment/v2/start', body, {headers: {
                        'Content-type': 'application/json',
                        'Signature': simplesign(body),
                    }}).then((simple_res) => {
                        return res.send({error : !result.acknowledged, paymentUrl: simple_res.body.paymentUrl});
                    })*/


    }

module.exports = SimplePayPayment;