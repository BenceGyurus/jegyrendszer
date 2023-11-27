import typeOfGroup from "./group"
import typeOfSeat from "./seat"

type typeOfSeatParams = {
    seat : typeOfSeat,
    onClickFunction? : Function,
    isSelected? : boolean,
    background? : string
}

export default typeOfSeatParams