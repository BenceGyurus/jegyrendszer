import StageGroup from "./stageGroup.component";
import typeOfStageGroupListParams from "./type/stageGroupListParams";

const StageGroupList = ({stages}:typeOfStageGroupListParams)=>{
    return <div className = "group-list">
        {stages.map(stage=>{
            return <StageGroup editColor={stage.editColor} name={stage.name} id = {stage.id} />
        })}
    </div>
}

export default StageGroupList;