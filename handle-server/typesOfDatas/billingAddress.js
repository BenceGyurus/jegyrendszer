const ControlDatas = require("./controlTypesOfDatas")

const Datas = {
    firstname : "string",
    lastname : "string",
    postalCode : 'string',
    city : "string",
    address : "string",
    address2 : "string",
    taxNumber : "string",
    phone : "string",
    mail : "string"
}

const controlTypeOfBillingAddress = (inputs)=>{
    return ControlDatas(inputs, Datas);
}

module.exports = controlTypeOfBillingAddress;