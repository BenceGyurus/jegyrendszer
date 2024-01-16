type typeOfGroupParams = {
    name : string,
    id : string,
    watchingGroup : string,
    setWatchingGroup : Function,
    seatName : string,
    rowName : string,
    seatType : boolean,
    rowType : boolean,
    changeStairs : Function,
    direction : "left" | "right",
    numberOfSeats : number,
    type : "seat" | "stage",
    color : {red : number, blue : number, green : number},
    setDirectionOfSeats : Function,
    originalColor : boolean,
    rotated : number
};

export default typeOfGroupParams;