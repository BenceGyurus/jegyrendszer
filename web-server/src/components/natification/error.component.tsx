import React from "react";
import "../../css/errorBox.css";


type typeOfErrorParams = {
    title? : string,
    message? : string,
}

const Error = ( { title, message }:typeOfErrorParams ) => {
  return (
    <div className="error-box">
        {title ? <h1>{title}</h1> : ""}
      <p>{message}</p>
    </div>
  );
};

export default Error;