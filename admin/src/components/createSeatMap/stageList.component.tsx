import Stage from "./stage.component";
import typeOfStageListParams from "./type/stageListParams";

const StageList = ({stages, selectedSeats}:typeOfStageListParams)=>{
    return <>
        {stages.map((stage)=>{
            return <Stage isSelected={selectedSeats.includes(stage.id)} name={stage.name} id = {stage.id} x = {stage.x} y = {stage.y} width={stage.width} height={stage.height} borderRadius={stage.borderRadius} title = {stage.title} color = {stage.color} />
        })}
    </>
}

export default StageList;