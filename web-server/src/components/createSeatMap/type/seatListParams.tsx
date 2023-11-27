import typeOfGroup from "./group"
import typeOfSeat from "./seat"

type typeOfSeatListParams = {
    seats : Array<typeOfSeat>,
    groups : Array<typeOfGroup>,
    onClickFunction : Function,
    selectedSeats? : Array<string>
}

export default typeOfSeatListParams;