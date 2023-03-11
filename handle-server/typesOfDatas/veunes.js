const ControlDatas = require("./controlTypesOfDatas")

const Datas = {
    name : "string",
    places : "number",
    colorOfBackGround : "string",
    sizeOfArea : "object",
    background : "object",
    seatsDatas : "object",
    groups : "object",
    selecttedGroup : "string",
    sizeOfSeat : "number",
    colorOfSeat : "string",
    seatsMode : "boolean",
    suggestedGroups : "object"
}

const controlTypesOfVenues = (inputs)=>{
    return ControlDatas(inputs, Datas);
}

module.exports = controlTypesOfVenues;


