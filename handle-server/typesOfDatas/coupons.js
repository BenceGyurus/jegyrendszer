const ControlDatas = require("./controlTypesOfDatas")

const Datas = {
    name : "string",
    events : "object",
    money : "boolean",
    amount : "number",
    validity : "string",
    type : "number"
}

const controlTypeOfCoupon = (inputs)=>{
    return ControlDatas(inputs, Datas);
}

module.exports = controlTypeOfCoupon;