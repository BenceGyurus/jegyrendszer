type typeOfEditSectorParams = {
    name : string,
    changeStairs : Function,
    rowName : string,
    rowType : boolean,
    seatName : string,
    seatType : boolean,
    direction : "right" | "left",
    setWatchingGroup : Function,
    open : boolean,
    type : "seat" | "stage",
    setDirectionOfSeats : Function,
    id : string,
    rotated : number
}

export default typeOfEditSectorParams