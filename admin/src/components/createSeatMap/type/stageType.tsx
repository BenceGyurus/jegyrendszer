import typeOfStageBorderRadius from "./stageBorderRadius";

type typeOfStageParams = {
    name : string,
    x : number,
    y : number,
    id : string,
    borderRadius : typeOfStageBorderRadius,
    color : string,
    title : boolean,
    width : number,
    height : number,
    isSelected? : boolean
}

export default typeOfStageParams;