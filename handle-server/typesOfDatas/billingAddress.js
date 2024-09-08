const ControlDatas = require("./controlTypesOfDatas")

const Datas = {
    isCompany : "boolean",
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

const CompanyDatas = {
    isCompany : "boolean",
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
    if (inputs.isCompany){
        return ControlDatas(inputs, CompanyDatas);
    }
    return ControlDatas(inputs, Datas);
}

module.exports = controlTypeOfBillingAddress;