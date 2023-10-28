import typeOfSizeOfArea from "../../admin/operation/seats/type/sizeOfArea"
import typeOfGroup from "./group"
import typeOfSeat from "./seat"
import typeOfSizeOfSeat from "./sizeOfSeat"
import typeOfSpaceBetween from "./spaceBetween"

type typeOfCreateigSettingsParams = {
    sizeOfSeat : typeOfSizeOfSeat,
    spaceBetween : typeOfSpaceBetween,
    setSizeOfSeat : Function,
    setSizeOfBetween : Function,
    nameOfPosition : string,
    setNameOfPosition : Function,
    nameOfCoulmn : string,
    setNameOfCoulmn : Function,
    nameOfSeat : string,
    setNameOfSeat : Function,
    groups : Array<typeOfGroup>,
    seats : Array<typeOfSeat>
    
}

export default typeOfCreateigSettingsParams