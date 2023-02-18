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
    changeValue:any
}
const GroupList = (params:groupListType):any=>{
    if (params.groups.length == 0){
        return <h2>Nincs csoport létrehozva</h2>
    }
    return (
        params.groups.map((group:any, index)=>{
            if (group.status){
                return (<div key={group.id}>
                    <input type="text" defaultValue={group.name} onBlur = {event =>{params.handleEvent(index, event.target.value)}}/>
                </div>)
            }
            return (
                <div key={group.id} style= {{background: params.selected === group.id ? "blue" : "white"}}>
                    <label onDoubleClick={event =>params.editFunction(index, true)} onClick = {event => params.setSelected(index)}>{group.name}</label>
                    <input type="button" value="X" onClick={event =>{params.deleteEvent(index)}} />
                    <div>
                        {params.seats.map((seat:any, seatIndex:number)=>{
                            if (seat.group === group.id){
                                return (<div>
                                <label htmlFor="nameOfSeat">Ülőhely elnevezése:</label>
                                <input type="text" id = "nameOfSeat" defaultValue={seat.name} onChange = {event => params.changeValue(seatIndex, event.target.value)}/>
                                <label htmlFor="titleOfSeat">Ülőhely felirata</label>
                                <input type="text" id = "titleOfSeat" defaultValue={seat.title}/>
                                </div>)
                            }
                        })}
                    </div>
                </div>
                )
        }));
}
export default GroupList;