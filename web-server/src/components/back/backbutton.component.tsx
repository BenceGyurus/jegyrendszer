import "../../css/backbutton.css";
type typeOfBackButton = {
    url : string
}

const BackButton = ( { url }:typeOfBackButton )=>{
    return (
        <button className="back-button" onClick = {()=>{ window.location.pathname = url; }}><i className="fa fa-arrow-left"></i> Vissza</button>
    );
}

export default BackButton;