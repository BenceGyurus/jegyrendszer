import React from "react";
import "../../css/success.css";
import { Alert } from "antd";

type typeOfErrorParams = {
    title? : string,
    message? : string,
    closeFunction? : Function
}


const Success = ( { title, message,closeFunction }:typeOfErrorParams ) => {
    return (
      <div className="notification-box">
        <Alert description = {message} message = {title} closable showIcon type="success" onClose={e=>{if (closeFunction) closeFunction(false)}} />
      </div>
    );
  };
  

export default Success;
