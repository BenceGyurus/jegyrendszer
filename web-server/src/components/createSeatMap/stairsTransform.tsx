import typeOfSeat from "./type/seat";
import typeOfStairsParams from "./type/stairsParams";

const stairsTransform = (seats : Array<typeOfSeat>,
    amount : number,
    isVertical? : boolean)=>{
    if (isVertical){
        seats.sort((a, b) => a.y - b.y);
        seats.forEach((seat, index)=>{
            seats[index].x += (index / seats.length)*amount
        })
    }
    else{
        seats.sort((a, b) => a.x - b.x);
        seats.forEach((seat, index)=>{
            seats[index].y += (index / seats.length)*amount
        })}
        return seats;
    }

export default stairsTransform;