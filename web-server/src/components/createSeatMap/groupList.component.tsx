import { Switch, Tooltip } from "antd";
import Group from "./group.component";
import typeOfGroupListParams from "./type/groupListParams";
import "../../css/groupListStyle.css";
import { InfoCircleOutlined } from "@ant-design/icons";

const GroupList = ({seats, watchingGroup, setWatchingGroup, changeStairs, originalColor, setOriginalColor,  setDirectionOfSeats}:typeOfGroupListParams)=>{

    const sumGroupSeats = (id:string)=>{
        let value = 0;
        seats.find(groupSeats=>groupSeats.sector.id === id)?.seats?.forEach(groupSeats => {
                value += groupSeats.length;
        });
        return value;
    }


    return (<div className = "group-list">
            <div className = "original-color-switch">
                <label htmlFor="original-color">Segítő színek kikapcsolása <Tooltip title = "A színek vásárláskor nem jelennek meg, a szerkesztő felületen van csak a szektorok egyerűbb megkülönböztetése miatt"><InfoCircleOutlined /></Tooltip></label>
                <Switch id = "original-color" defaultChecked = {originalColor} onChange={e=>setOriginalColor(e)} />
            </div>
        {
            seats.length ? seats.map((seatGroups, index)=>{
                return (<Group key = {`${index}-${seatGroups.sector.id}`} rotated={seatGroups.sector.rotated} setDirectionOfSeats = {setDirectionOfSeats}  originalColor = {originalColor} color={seatGroups.sector.color} type = {seatGroups.sector.type} numberOfSeats={sumGroupSeats(seatGroups.sector.id)} changeStairs={changeStairs} setWatchingGroup={setWatchingGroup} watchingGroup={watchingGroup} name = {seatGroups.sector.name} id = {seatGroups.sector.id} seatName={seatGroups.sector.seatName} rowName = {seatGroups.sector.rowName} seatType = {seatGroups.sector.seatType} rowType = {seatGroups.sector.rowType} direction={seatGroups.sector.direction} />)
            }) : <></>
        }
    </div>);
}

export default GroupList;