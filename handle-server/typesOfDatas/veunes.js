const ControlDatas = require("./controlTypesOfDatas")

const Datas = {
    name : "string",
    background : "string",
    status : "string",
    isSector : "boolean",
    originalColor : "boolean",
    stages : "object",
    seats : "object"
}

const controlTypesOfVenues = (inputs)=>{
    return ControlDatas(inputs, Datas);
}

module.exports = controlTypesOfVenues;


