import "../../css/calendar.css";
import { useRef,useEffect, useState } from "react";

type typeOfCalendarParams = {
    title? : string,
    onChangeFunction? : Function,
    value? : string,
    disabled? : boolean,
    info? : {text? : string, image? : string}
}

const Calendar = ( { title, onChangeFunction, value, disabled, info }:typeOfCalendarParams )=>{

    const dateRef:any = useRef(null);

    const [showTooltip, setShowTooltip] = useState(false);

    const handleInfoButtonHover = () => {
      setShowTooltip(true);
    };
  
    const handleInfoButtonLeave = () => {
      setShowTooltip(false);
    };
  
      useEffect(()=>{
          if (dateRef.current && value){dateRef.current.value = value}
      })

    useEffect(()=>{
        if (dateRef && dateRef.current && value ){
            dateRef.current.value = value
        }
    });

    return <div className="input-container">
        {title ? <label className = "calendar-label" htmlFor="datetime-input">{title}</label> : ""}
        <div><input type="datetime-local" id="datetime-input" name="datetime-input" onChange={e=>onChangeFunction ? onChangeFunction(e.target.value) : ""} ref={dateRef} disabled = {disabled ? disabled : false} /></div>
        {info && (
          <div
            className="info-button"
            onMouseEnter={handleInfoButtonHover}
            onMouseLeave={handleInfoButtonLeave}
          >
            {showTooltip && (
              <span className="info-tooltip">
                {info.image ? <img src={info.image} alt="Info Icon" /> : ""}
                {info.text ? <p>{info.text}</p> : ""}
              </span>
            )}
            <i className="fas fa-question" style={{color : "#007bff"}}></i>
          </div>
        )}
        </div>
    
};

export default Calendar;