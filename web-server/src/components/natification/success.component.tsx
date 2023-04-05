import React from "react";
import "../../css/success.css";

type typeOfErrorParams = {
    title? : string,
    message? : string,
}


const Success = ( { title, message }:typeOfErrorParams ) => {
    return (
      <div className="success-box">
          {title ? <h1>{title}</h1> : ""}
        <p>{message}</p>
      </div>
    );
  };
  

export default Success;
