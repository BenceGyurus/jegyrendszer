import typeOfArea from "./areaType";
import typeOfSeats from "./seatsType";
import typeOfStage from "./stage";


type typeOfTableParams = {
    seats : typeOfSeats,
    background : string,
    status : "edit" | "move" | "create"|"drag",
    widthOfSeats : number,
    heightOfSeats : number,
    spaceUnderTheSeats : number,
    spaceBetweenTheSeats : number,
    area : typeOfArea,
    setArea : Function,
    newSeats : Function,
    state : {
        scale: number,
        translation: { x: number, y: number }
    },
    setState : Function,
    selectedSeats : Array<string>,
    setSelectedSeats : Function,
    dragSelectedSeats : Function,
    setSelectedSeat : Function,
    watchingGroup : string,
    originalColor : boolean,
    isSector : boolean,
    stages : Array<typeOfStage>,
    setError : Function
};

export default typeOfTableParams;