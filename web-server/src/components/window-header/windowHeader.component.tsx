import "../../css/windowHeader.css";
type typeOfWindowHeader = {
    title : string,
    closeWindowFunction : Function
}

const windowHeader = ({title, closeWindowFunction}:typeOfWindowHeader)=>{
    return (
        <div className="header">
            <div className="title">{title}</div>
            <div className = "controls">
                <div onClick = {event => closeWindowFunction()} className = "close-button"></div>
            </div>
        </div>
    );
}
export default windowHeader;