import "../../../../../css/admin-stage.css";

type typeOfStageParams = {
    size : {width : number, height : number},
    backgroundColor : string,
    selectedStage : number,
    setSelectedStage : Function
}
const Stage = ({size, backgroundColor, selectedStage, setSelectedStage}:typeOfStageParams)=>{
    return <div className = "stage-div" style={{height : Math.floor(100/size.width*size.height) + 23*2}}>

        <div className = {`stage stage-top horizontal-stage${selectedStage == 1 ? ` selected-stage` : ""}`} onClick = {(e) => {selectedStage == 1 ? setSelectedStage(0) : setSelectedStage(1)}}></div>
        <div className = {`stage stage-left vertical-stage${selectedStage == 2 ? ` selected-stage` : ""}`} style = {{height : Math.floor(100/size.width*size.height*0.8), width : 20}} onClick = {(e) => {selectedStage == 2 ? setSelectedStage(0) : setSelectedStage(2)}}></div>
        <div className = "arena" style = {{width : 100, height : Math.floor(100/size.width*size.height), background : backgroundColor}}></div>
        <div className = {`stage stage-right vertical-stage${selectedStage == 3 ? ` selected-stage` : ""}`} style = {{height : Math.floor(100/size.width*size.height*0.8), width : 20}} onClick = {(e) => {selectedStage == 3 ? setSelectedStage(0) : setSelectedStage(3)}}></div>
        <div className = {`stage stage-bottom horizontal-stage${selectedStage == 4 ? ` selected-stage` : ""}`} onClick = {(e) => {selectedStage == 4 ? setSelectedStage(0) : setSelectedStage(4)}}></div>
    </div>
}

export default Stage;