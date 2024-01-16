const ControlDatas = require("./controlTypesOfDatas")

const Datas = {
    name : "string",
    description : "string",
    tickets : "object",
    background : "string",
    dateOfEvent : "string",
    dateOfRelease : "string",
    venue : "string",
    media : "object",
    location : "string",
    company : "string",
    position: "object",
    localDiscounts : "boolean",
    users : "object",
    address : "string",
    gate_Opening : "string",
    end_Of_The_Event : "string",
    wardrobe : "boolean",
    isGroupPerformer : "boolean",
    performer : "string"
}

const controlTypeOfEvents = (inputs)=>{
    return ControlDatas(inputs, Datas);
}

module.exports = controlTypeOfEvents;