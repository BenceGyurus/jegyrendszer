import typeOfSeat from "./typeOfSeat";

export default interface typeOfMinimapParams{
    sizeOfArea : {width : number, height : number},
    seats : Array<typeOfSeat>,
    originSizeOfArea : {width : number, height : number},
    canvasKey : string,
    selectedSeats? : Array<string>,
    selectedColor? : string
};