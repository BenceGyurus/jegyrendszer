import "../../css/backbutton.css";
type typeOfBackButton = {
    url : string,
    className? : string
}

const BackButton = ( { url, className }:typeOfBackButton )=>{
    return (
        <button className={className ? `back-button ${className}` : "back-button"} onClick = {()=>{ window.location.pathname = url; }}><i className="fa fa-arrow-left"></i> Vissza</button>
    );
}

export default BackButton;