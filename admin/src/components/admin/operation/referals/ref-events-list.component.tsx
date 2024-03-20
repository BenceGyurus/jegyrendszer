import "../../../../css/ref-event-list.css";
import Button from "../../../buttons/button.component";

type typeOfEvents = {
    name : string,
    id : string,
    eventDate : string,
    selected : boolean
}

type typeOfEventListParams = {
    events : Array<typeOfEvents>,
    onClick : Function,
    selectAllFunction : Function
}

const generateDate = (date:string)=>{
    let d = new Date(date);
    return `${d.getFullYear()}.${d.getMonth()+1 > 9 ? d.getMonth()+1 : `0${d.getMonth()+1}`}.${d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`}. ${d.getHours() > 9 ? d.getHours() : `0${d.getHours()}`}:${d.getMinutes() > 9 ? d.getMinutes() : `0${d.getMinutes()}`}`
}

const EventList = ({events, onClick, selectAllFunction}:typeOfEventListParams)=>{


    return <div><ul className = "admin-ref-events">
        {events.map((event)=>{
            return <li key = {event.id} className = {`admin-ref-event${event.selected ? " selected" : ""}`} onClick={e=>{onClick(event.id)}}>{event.name} - {generateDate(event.eventDate)}</li>
        })}
    </ul>
    <Button onClickFunction={selectAllFunction} title = "Összes" />
    </div>
}

export default EventList;