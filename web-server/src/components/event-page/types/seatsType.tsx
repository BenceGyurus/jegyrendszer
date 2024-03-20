import typeOfSeat from "./seatType";
type typeOfSeats = Array<{ sector : {
    direction : "left" | "right",
    rotated : number, 
    id : string,
    name : string, 
    seatName : string, 
    rowName : string, 
    seatType : boolean, 
    rowType : boolean
    type : "seat" | "stage",
    color : {red : number, blue : number, green : number},
    startCounting : number
} , 
    
    seats : Array<Array<typeOfSeat>> | []}
    >;


export default typeOfSeats;