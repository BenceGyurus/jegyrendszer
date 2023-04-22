import React from "react";
import "../../css/success.css";

type typeOfErrorParams = {
    title? : string,
    message? : string,
    closeFunction? : Function
}


const Success = ( { title, message,closeFunction }:typeOfErrorParams ) => {
    return (
      <div className="success-box">
        {closeFunction ? <i style={{cursor: "pointer"}} onClick={e => closeFunction()} className ="fas fa-times"></i> : ""}
          {title ? <h1>{title}</h1> : ""}
        <p>{message}</p>
      </div>
    );
  };
  

export default Success;
