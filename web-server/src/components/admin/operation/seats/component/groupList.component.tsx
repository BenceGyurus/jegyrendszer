import "../../../../../css/groupSettings.css";
import { v4 as uuid } from 'uuid';
type groupType = {
    name : string,
    id : string,
    posX : number,
    posY : number,
    status : boolean
}
type groupListType = {
    groups : Array<groupType>,
    handleEvent : any,
    editFunction : any,
    deleteEvent : any,
    setSelected :any,
    selected: string,
    seats: any,
    changeValue:any,
    deleteSeatFunction:Function,
    changeOpened : any,
    changeTitle:Function
}
const GroupList = (params:groupListType):any=>{
    if (params.groups.length == 0){
        return <h2>Nincs csoport létrehozva</h2>
    }
    return (
        <div className = "Group-Div">
        <ul className = "tab">
        {params.groups.map((group:any, index)=>{
            if (group.status){
                return (<input key = {uuid()} type="text" className = "tablinks" defaultValue={group.name} onBlur = {event =>{params.handleEvent(index, event.target.value)}}/>)}
            else{
                return <button key = {uuid()} className = {group.id != params.selected ? "tablinks" : "tablinks active"} onDoubleClick={event =>params.editFunction(index, true)} onClick = {event => params.setSelected(index)}>{group.name} <span className = "close-tab" onClick={event =>{params.deleteEvent(index)}}>&times;</span></button>
            }
        })}
        </ul>
        <div>
        {params.groups.map((group:any, index:number)=>{
            if (params.selected == group.id){
            return (
                <div className = "tab-content" key = {index}>
                {params.seats.map((seat:any, seatIndex:number)=>{
                    if ((seat.group === group.id && group.id == params.selected)){
                        let ids = [uuid(), uuid()];
                        return (<div className = "form-container" key = {(seatIndex+1)*13} id = {seat.id}>
                        <h3 className = "numberOfSeat">{seatIndex+1}</h3>
                        <div className = "form-group">
                        <label htmlFor={ids[0]} className = "labelOfGroupList">Ülőhely elnevezése:</label>
                        <input type="text" id = {ids[0]} className = "inputOfGroupList" defaultValue={seat.name} onChange = {event => params.changeValue(event.target.value,seatIndex)}/>
                        </div>
                        <div className = "form-group">
                        <label htmlFor={ids[1]} className = "labelOfGroupList">Ülőhely felirata:</label>
                        <input type="text" id = {ids[1]} className = "inputOfGroupList" defaultValue={seat.title} onChange={e => params.changeTitle(seatIndex, e.target.value) }/>
                        </div>
                        <input type="button" value="Törlés" onClick={event => params.deleteSeatFunction(seatIndex)} className = "deleteDataButton" />
                        </div>)
                    }
                })}
            </div>
            );}
        })}
        </div>
        </div>
        )
}
export default GroupList;
