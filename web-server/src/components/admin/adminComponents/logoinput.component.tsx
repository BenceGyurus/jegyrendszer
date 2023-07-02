import React from 'react';
import "../../../css/logoInput.css";

type typeOfLogoInputParams = {
    logo : string,
    placeholder : string,
    onChangeFunction : Function,
    params? : Array<any>,
    value? : string
}

function LogoInput({ logo, placeholder, onChangeFunction, params, value }:typeOfLogoInputParams) {
    return (
        <div className="logo-input">
          <input type="text" placeholder={placeholder} value = {value} onChange={e=>{params && params.length ? onChangeFunction(e.target.value, [...params]) : onChangeFunction(e.target.value)}} />
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
        </div>
      );
}

export default LogoInput;
