import typeOfEvent from "./event";

type typeOfEventList = {
    events : Array<typeOfEvent>,
    refreshFunction : Function,
    openEvent : Function,
    setRefund : Function
}

export default typeOfEventList;