import { Button, Input, Select } from "antd";
import Window from "../window/window.component";
import typeOfEditSectorParams from "./type/editSectorWindowParams";
import SeatSectorExampleVisualization from "./exampleVisualisation.component";

const EditSectorWindow = ({name, changeStairs, rowName, seatName, seatType, rowType, direction, setWatchingGroup, open, type, setDirectionOfSeats, id, rotated, editSector}:typeOfEditSectorParams)=>{
    return  open ? <Window closeFunction={()=>setWatchingGroup(false)} title = {`${type == "seat" ? "Szektor" : "Színpad"} szerkesztése`}>
    <div>
        <h3>Átnevezés</h3>
        <Input value={name} onChange={e=>editSector({name : e.target.value}, id)} />
        <h3>Lépcsőzetes</h3>
        <Button onClick={e=>changeStairs(false)}>+</Button><Button onClick={e=>changeStairs(true)}>-</Button>
        <h3>Sor neve</h3>
        <Input value = {rowName} onChange={e=>editSector({rowName : e.target.value}, id)} />
        <h3>Sor számának típusa</h3>
        <Select onChange={e=>editSector({rowType : e}, id)} options = {[{label : "Római szám", value : true}, {label : "Arab szám", value : false}]} defaultValue={rowType} />
        <h3>Szék neve</h3>
        <Input value = {seatName} onChange={e=>editSector({seatName : e.target.value}, id)} />
        <h3>Szék számának típusa</h3>
        <Select onChange={e=>editSector({seatType : e}, id)} options = {[{label : "Római szám", value : true}, {label : "Arab szám", value : false}]} defaultValue={seatType} />
        <div className = "seats-directions">
            <img onClick={e=>setDirectionOfSeats(id, "left")} className = {["seat-direction-button", direction === "left" ? "active-seat-direction-button" : ""].join(" ")} src="/images/left-seat-direction.svg" alt="left"/>
            <img onClick={e=>setDirectionOfSeats(id, "right")} className = {["seat-direction-button", direction === "right" ? "active-seat-direction-button" : ""].join(" ")} src="/images/right-seat-direction.svg" alt="right"/>
        </div>
        <div className = "sector-direction-example">
        <Button className = "sector-rotation-button" onClick={e=>setDirectionOfSeats(id, "bottom")}><i className="fas fa-undo"></i></Button>
        <SeatSectorExampleVisualization rotated={rotated} direction={direction} />
        <Button className = "sector-rotation-button" onClick={e=>setDirectionOfSeats(id, "top")}><i className="fas fa-undo fa-flip-horizontal"></i></Button>
        </div>
    </div>
</Window> : <></>
}

export default EditSectorWindow;