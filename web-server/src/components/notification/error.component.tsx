import "../../css/errorBox.css";


type typeOfErrorParams = {
    title? : string,
    message? : string,
    closeFunction? : Function
}

const Error = ( { title, message,closeFunction }:typeOfErrorParams ) => {
  return (
    <div className="error-notification">
    <span className="error-icon">❌</span>
    <div className="error-title">{title ? title : "Hiba történet!"}</div>
    <p className="error-message">{message}</p>
    {closeFunction ? <a className="cta-button" onClick={e=>closeFunction()} >Bezár</a> : ""}
  </div>
  );
};


/*
<div className="error-box">
        {closeFunction ? <i style={{cursor: "pointer"}} onClick={e => closeFunction()} className ="fas fa-times"></i> : ""}
        {title ? <h1>{title}</h1> : ""}
      <p>{message}</p>
    </div>*/

export default Error;