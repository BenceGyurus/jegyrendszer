import { useRef,useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import "../../css/inputStyle.css";
type typeOfInputTextParams = {
    title : string,
    onChangeFunction : Function,
    value? : string,
    params? : Array<any>,
    disabled? : boolean,
    info? : { image? : string, text? : string}
}


const InputText = ({ title,onChangeFunction,value,params, disabled,info }:typeOfInputTextParams)=>{
    const inputRef:any = useRef(null);
    let id = uuid();

    const [showTooltip, setShowTooltip] = useState(false);

  const handleInfoButtonHover = () => {
    setShowTooltip(true);
  };

  const handleInfoButtonLeave = () => {
    setShowTooltip(false);
  };

    useEffect(()=>{
        if (inputRef.current && value){inputRef.current.value = value}
    })

    return (
      <div className="input-container">
        <div>
            <label htmlFor={id} className = "inputLabel">{title}</label>
            <input type="text" id = {id} className = "textInput" onChange={e => {params ? onChangeFunction(e.target.value, ...params) : onChangeFunction(e.target.value)}} ref = {inputRef} disabled = {disabled ? disabled : false}/>
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
        </div>
    );
}

export default InputText;