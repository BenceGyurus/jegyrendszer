import Event from "../event/event.component";

const EventList = (events:any)=>{
    let delay = 0;
    return (
        events.events.map((event:any)=>{
            delay++;
            return (
                <Event
                    animationDelay = {delay}
                    id = {event._id}
                    imageName = {event.image}
                    date = {event.date}
                    description = {event.description}
                    title = {event.title}
                    key = {event._id}
                    />
                )
    })
    );
}

export default EventList;