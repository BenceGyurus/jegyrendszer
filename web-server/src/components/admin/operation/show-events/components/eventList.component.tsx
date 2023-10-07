import Event from "./event.component";
import { v4 as uuid } from 'uuid';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

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
    id : string,
    contributor : Array<string>,
    isActive : boolean
}

type typeOfEventListParams = {
    events : Array<typeOfEventDatas>,
    editFunction : Function,
    deleteFunction : Function,
    numberOfPages : number,
    page : number,
    handleChange : any
}


const EventList = ( { events, editFunction,deleteFunction, numberOfPages, page, handleChange }:typeOfEventListParams )=>{

    return <div className = "admin-event-list" key = {uuid()}>
        <div className = "event-list-grid" key = {uuid()}>
        {
            events.map((element)=>{
                return <Event eventKey={uuid()} name = {element.eventData.name} description={element.eventData.description} background={element.eventData.background} deleteFunction={deleteFunction} editFunction={editFunction} id = {element.id} contributors = {element.contributor} isActive = {element.isActive} />
            })
        }
        </div>
        {numberOfPages > 1 ? <div className = "pagination-holder">
        <Stack spacing={2}>
        <Pagination count={numberOfPages} page={page} onChange={handleChange} siblingCount={0} boundaryCount={2}/>
        </Stack>
        </div> : <></>}
    </div>
}

export default EventList;