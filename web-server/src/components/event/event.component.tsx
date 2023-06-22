import Calendar from "./calendar.component";
import "../../css/userpageevent.css";
const Event = (params:any)=>{
    console.log(params.title);

    const openEvent = (id:string)=>{
        window.location.pathname = `/rendezveny/${id}`;
    }

    return (
      <div className="event" onClick = {e => openEvent(params.id)}>
        <div className = "calendar"><Calendar date = {params.date} /></div>
        <div className="event-image"><img src={params.imageName} alt={params.id} />
        <div className = "text-overlay">
            <h2 className="event-title">{params.title}</h2>
        </div>
        </div>
    </div>

      
    );
}

//event-button

/*

*/

export default Event;