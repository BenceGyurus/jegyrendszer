import typeOfSeats from "./seatsType";
import typeOfStage from "./stage";

type typeOfCreateSeatsTypesParams = {
    inSeats? : typeOfSeats,
    inName? : string,
    inBackground? : string,
    inIsSector? : boolean,
    inOriginalColor? : boolean,
    inStatus? : "move"|"edit"|"create"|"drag",
    inStages? : Array<typeOfStage>,
    id? : string

}

export default typeOfCreateSeatsTypesParams;