import { Button, Checkbox, Input, Select, Tag } from "antd";
import typeOfGroupParams from "./type/groupParams"
import Window from "../window/window.component";
import EditSectorWindow from "./editSectorWindow.component";


const Group = ({name, id, watchingGroup, setWatchingGroup, seatName, seatType, rowName, rowType, changeStairs, direction, numberOfSeats, type, color,  setDirectionOfSeats, rotated,editSector}:typeOfGroupParams)=>{
    return (<div className = "group-div" key = {id}>
        <div className = "group-div-header" style={{borderLeft : `10px solid rgb(${color.red}, ${color.blue}, ${color.green})`}}>
            <div>
                <h2 onClick = {()=>setWatchingGroup(id === watchingGroup ? "" : id)}>{name}</h2>
                <span>{numberOfSeats} ülőhely</span>
            </div>
            <Tag className="group-tag" color={type == "seat" ? "magenta" : "cyan"} >{type == "seat" ? "Szektor" : "Színpad"}</Tag>
        </div>
        <EditSectorWindow rotated={rotated} name={name} id={id} seatName={seatName} rowName={rowName} seatType = {seatType} rowType={rowType} changeStairs={changeStairs} direction={direction} setWatchingGroup={setWatchingGroup} open = {watchingGroup===id} type={type} setDirectionOfSeats={setDirectionOfSeats} editSector = {editSector} />
    </div>)
}

export default Group;