type typeOfSeats = {
    name? : string,
    id : string,
    x : number,
    y : number,
    indexX : number,
    indexY : number,
    group? : string,
    size : {width : number, height : number},
    background? : string,
    color? : string,
    fontSize? : number,
    title? : string,
    className? : string,
    nameDatas? : { seatName : string, rowName : string, typeOfRowNumber : boolean, typeOfSeatNumber : boolean },
};


export default typeOfSeats;