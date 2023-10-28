import typeOfSeat from "./seat"

type typeOfStairsParams = {
    seats : Array<typeOfSeat>,
    amount : number,
    isVertical? : boolean
}

export default typeOfStairsParams;