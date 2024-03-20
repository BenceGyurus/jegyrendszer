import typeOfStageBorderRadius from "./stageBorderRadius";

type typeOfStage = {
    name : string,
    title : boolean,
    x : number,
    y : number,
    color : string,
    borderRadius : typeOfStageBorderRadius,
    width : number,
    height : number
    id : string,
    editColor : {red : number, blue : number, green : number}
}

export default typeOfStage;