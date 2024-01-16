import typeOfSeats from "./seatsType";

type typeOfSeatListParams = {
    seats : typeOfSeats,
    selectedSeats : Array<string>,
    onClickFunction : Function,
    watchingGroup : string,
    originalColor : boolean
}

export default typeOfSeatListParams;