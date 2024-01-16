const ControlDatas = require("./controlTypesOfDatas")

const Datas = {
    name : "string",
    id : "string",
    x : "number",
    y : "number",
    indexX : "number",
    indexY : "number",
    group : "string",
    size : "object",
    background : "string",
    color : "string",
    fontSize : "number",
    title : "string",
    className : "string",
    nameDatas : "object",
}

const controlTypeOfSeat = (inputs)=>{
    return ControlDatas(inputs, Datas);
}

module.exports = controlTypeOfSeat;