const ControlDatas = require("./controlTypesOfDatas")

const Datas = {
    name : "string",
    description : "string",
    tickets : "object",
    background : "string",
    dateOfEvent : "string",
    dateOfRelease : "string",
    venue : "string"
}

const controlTypeOfEvents = (inputs)=>{
    return ControlDatas(inputs, Datas);
}

module.exports = controlTypeOfEvents;