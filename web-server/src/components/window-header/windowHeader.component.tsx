import "../../css/windowHeader.css";
type typeOfWindowHeader = {
    title : string,
    closeWindowFunction? : Function,
    className? : string
}

const WindowHeader = ({title, closeWindowFunction, className}:typeOfWindowHeader)=>{
    return (
        <div className={`header ${className}`}>
            <div className="title">{title}</div>
            <div className = "controls">
                {closeWindowFunction ? <div onClick = {event => closeWindowFunction()} className = "close-button"></div> : ""}
            </div>
        </div>
    );
}
export default WindowHeader;