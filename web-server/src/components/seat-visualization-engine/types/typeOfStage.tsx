import typeOfBorderRadiusOfStage from "./typeOfBorderRadiusOfStage"
import typeOfEditColorOfStage from "./typeOfEditColorOfStage";

type typeOfStage = {
    name : string,
    id : string,
    borderRadius: typeOfBorderRadiusOfStage,
    title : boolean | string,
    x : number,
    y : number,
    width : number,
    height : number,
    color : string,
    editColor : typeOfEditColorOfStage
}

export default typeOfStage;