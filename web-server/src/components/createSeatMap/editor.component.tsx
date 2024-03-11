import typeOfEditorTypeParams from "./type/editorType";
import "../../css/createSeatMapEditor.css";
import EditingPage from "./editingPage.component";
import { Empty, Segmented, Button } from "antd";
import { useState } from "react";
import GroupList from "./groupList.component";
import CanvasSettings from "./canvasSettings.component";
import StageGroupList from "./stageGroupList.component";


const CreateSeatsEditor = ({background, setBackground, deleteBackground, setStatus, widthOfSeats, heightOfSeats, setWidthOfSeats, setHeightOfSeats, spaceBetweenTheSeats, spaceUnderTheSeats, setSpaceBetweenTheSeats, setSpaceUnderTheSeats, rowName, seatName, typeOfRowNumber, typeOfSeatNumber, setTypeOfRowNumber, setRowName, setSeatName, setTypeOfSeatNumber, sector, setSector, seats, watchingGroup, setWatchingGroup, changeStairs, isSector, setIsSector, originalColor, setOriginalColor, stages, setDirectionOfSeats, setError, startCounting, setStartCounting, nameOfArea, setNameOfArea, save, saveing, editSector}:typeOfEditorTypeParams)=>{
    
    const [isCreate, setIsCreate] = useState<"settings" | "edit">("edit");
    
    return (<div className="createSeatMapEditDiv">
        <div className = "header-of-create-seat-map-editor">
            <Segmented onChange={(e:any)=>setIsCreate(e)}
                options={[{label : "Szerkesztés", value : "edit"}, {label : "Beállítások", value : "settings"}]}
            />
            <div className = "save-create-seats-div">
                <Button loading = {saveing} onClick={()=>save()} className = "save-create-seats-button" icon = {<i className="fas fa-save"></i>}>Mentés</Button>
            </div>
        </div>
        <div className = "create-seat-map-editor-container">
            { isCreate === "edit" ?  <div>
                <EditingPage startCounting = {startCounting} setStartCounting = {setStartCounting} setError = {setError} setIsSector = {setIsSector} isSector = {isSector} heightOfSeats={heightOfSeats} widthOfSeats={widthOfSeats} setHeightOfSeats={setHeightOfSeats} setWidthOfSeats={setWidthOfSeats} spaceBetweenOfSeats={spaceBetweenTheSeats} spaceUnderOfSeats={spaceUnderTheSeats} setSpaceBetweenOfSeats={setSpaceBetweenTheSeats} setSpaceUnderOfSeats={setSpaceUnderTheSeats} background={background} setBackground={setBackground} rowName={rowName} seatName={seatName} typeOfRowNumber = {typeOfRowNumber} typeOfSeatNumber = {typeOfSeatNumber} setTypeOfRowNumber={setTypeOfRowNumber} setTypeOfSeatNumber={setTypeOfSeatNumber} setRowName={setRowName} setSeatName={setSeatName} sector = {sector} setSector={setSector} />{seats.length || stages.length ? <div><GroupList editSector = {editSector} setDirectionOfSeats = {setDirectionOfSeats}  originalColor = {originalColor} setOriginalColor={setOriginalColor} changeStairs={changeStairs} setWatchingGroup={setWatchingGroup} watchingGroup={watchingGroup} seats={seats} stages={stages}/><StageGroupList stages={stages} /></div> : <Empty />}</div> :  <CanvasSettings nameOfArea = {nameOfArea} setNameOfArea = {setNameOfArea} setError={setError} background={background} setBackground={setBackground} />}
        </div>
    </div>)
}

//

export default CreateSeatsEditor;