import { Button } from "antd";
import "../../css/backbutton.css";
type typeOfBackButton = {
    url : string,
    className? : string
}

const BackButton = ( { url, className }:typeOfBackButton )=>{
    return (
        <Button onClick = {()=>{ window.location.pathname = url; }} className={className}><span className = "back-arrow"><i className="fas fa-angle-left"></i></span> <span className = "back-button-title">Vissza</span></Button>
    );
}

export default BackButton;