import { Tag } from "antd";
import typeOfStageGroupParams from "./type/stageGroupParams";

const StageGroup = ({name, id, editColor}:typeOfStageGroupParams)=>{
    return (
        <div className = "group-div">
        <div className = "group-div-header" style={{borderLeft : `10px solid rgb(${editColor.red}, ${editColor.green}, ${editColor.blue})`}}>
            <div>
                <h2 onClick = {e=>()=>{}}>{name}</h2>
            </div>
            <Tag className="group-tag" color={"cyan"} >Színpad</Tag>
        </div></div>);
}

export default StageGroup;