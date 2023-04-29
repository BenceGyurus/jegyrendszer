import "../../css/calendar.css";
import { useRef,useEffect } from "react";

type typeOfCalendarParams = {
    title? : string,
    onChangeFunction? : Function,
    value? : string
}

const Calendar = ( { title, onChangeFunction, value }:typeOfCalendarParams )=>{

    const dateRef:any = useRef(null);

    useEffect(()=>{
        if (dateRef && dateRef.current && value ){
            dateRef.current.value = value
        }
    });

    return <div className = "calendar-div">
        {title ? <label className = "calendar-label" htmlFor="datetime-input">{title}</label> : ""}
        <div><input type="datetime-local" id="datetime-input" name="datetime-input" onChange={e=>onChangeFunction ? onChangeFunction(e.target.value) : ""} ref={dateRef} /></div>
        </div>
    
};

export default Calendar;