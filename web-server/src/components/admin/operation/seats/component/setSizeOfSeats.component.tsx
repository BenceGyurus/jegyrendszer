import { useEffect, useRef } from "react";
type typeOfSetSizeOfSeatsParams = {
    onChangeFunction : Function,
    size:number
};
const SetSizeOfSeats = ({ onChangeFunction, size }:typeOfSetSizeOfSeatsParams)=>{

    const seatRef:any = useRef(null);

    useEffect(()=>{
        if (seatRef && seatRef.current){
            seatRef.current.value = size > 0 ? Math.ceil(size) : 1;
        }
    })

    return (
        <div>
            <input type="number" name="sizeOfSeat" id="sizeOfSeat" onChange={event => onChangeFunction(Number(event.target.value))} ref={seatRef}/>
        </div>
    );
}

export default SetSizeOfSeats;