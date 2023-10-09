import { useEffect, useRef } from "react";
import InputNumber from "../../../../input/inputNumber.component";
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
            <InputNumber title = "" value = {size > 0 ? Math.ceil(size) : 1} onChangeFunction = {onChangeFunction}/> 
        </div>
    );
}


export default SetSizeOfSeats;