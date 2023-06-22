import Event from "./event.component";

type typeOfTickets = {
    name : string,
    price : number,
    minPrice : number,
    maxPrice : number,
    seats : Array<string>,
    numberOfTickets : number,
    id : string
}

type typeOfEvent = {
    name : string,
    description : string,
    background : string,
    dateOfEvent : string,
    dateOfRelease : string,
    tickets : Array<typeOfTickets>,
    venue : string,
    readable_event_name : string
};

type typeOfEventDatas = {
    eventData : typeOfEvent,
    addedBy : {username : string, userId : string, readableid : string},
    id : string
}

type typeOfEventListParams = {
    events : Array<typeOfEventDatas>,
    editFunction : Function,
    deleteFunction : Function
}


const EventList = ( { events, editFunction,deleteFunction }:typeOfEventListParams )=>{
    return <div>
        {
            events.map((element)=>{
                return <Event name = {element.eventData.name} description={element.eventData.description} background={element.eventData.background} deleteFunction={deleteFunction} editFunction={editFunction} id = {element.id} />
            })
        }
    </div>
}

export default EventList;