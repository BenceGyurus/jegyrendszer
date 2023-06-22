import "../../css/errorBox.css";


type typeOfErrorParams = {
    title? : string,
    message? : string,
    closeFunction? : Function
}

const Error = ( { title, message,closeFunction }:typeOfErrorParams ) => {
  return (
    <div className="error-box">
        {closeFunction ? <i style={{cursor: "pointer"}} onClick={e => closeFunction()} className ="fas fa-times"></i> : ""}
        {title ? <h1>{title}</h1> : ""}
      <p>{message}</p>
    </div>
  );
};

export default Error;