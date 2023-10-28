import typeOfGroup from "./group"
import typeOfSeat from "./seat";

type typeOfGroupSettings = {
    groups : Array<typeOfGroup>,
    setGroups : Function,
    seats : Array<typeOfSeat>
}

export default typeOfGroupSettings;