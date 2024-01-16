import typeOfSeats from "./seatsType";
import typeOfStage from "./stage";

type typeOfGroupListParams = {
    seats : typeOfSeats,
    watchingGroup : string,
    setWatchingGroup : Function,
    changeStairs : Function,
    originalColor : boolean,
    setOriginalColor : Function,
    stages : Array<typeOfStage>,
    setDirectionOfSeats : Function
};

export default typeOfGroupListParams;