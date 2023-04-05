import "../../css/tooltip.css";
type typeOfTooltip = {
    title : any,
    text : any
};


const Tooltip = ( { title, text }:typeOfTooltip )=>{
    return (<div className="ttip">
            {title}
            <span className="ttiptext">{text}</span>
            </div>)
}
export default Tooltip;