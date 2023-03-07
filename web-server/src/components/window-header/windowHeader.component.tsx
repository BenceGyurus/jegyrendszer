import "../../css/windowHeader.css";
type typeOfWindowHeader = {
    title : string,
    closeWindowFunction? : Function
}

const WindowHeader = ({title, closeWindowFunction}:typeOfWindowHeader)=>{
    return (
        <div className="header">
            <div className="title">{title}</div>
            <div className = "controls">
                {closeWindowFunction ? <div onClick = {event => closeWindowFunction()} className = "close-button"></div> : ""}
            </div>
        </div>
    );
}
export default WindowHeader;