import typeOfSeats from "./seatType";


type typeOfSeatParamsType = {
    seat : typeOfSeats,
    selectedSeats : Array<string>,
    onClickFunction : Function,
    isWatchingGroup : boolean,
    editColor : {red : number, blue : number, green : number},
    originalColor : boolean
};

export default typeOfSeatParamsType;