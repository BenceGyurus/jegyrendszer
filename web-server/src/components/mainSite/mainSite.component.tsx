import React, {useState, useEffect} from "react";
import EventList from "../../components/event-list/eventList.component";
import NoEvent from "../../components/event/NoEvent.component";
import LoadingAnimation from "../load-animation/loadAnimation.component";

const App = ()=>{
    const [events, setEvents] = useState([]);
   const [isItLoad, setIsItLoad] = useState(false); 

    useEffect(
        ()=>{
            fetch("/events")
            .then((response:any)=>{response.status === 404 ? setIsItLoad(true) : JSON.parse(response.body).error ? setIsItLoad(true) : setEvents(JSON.parse(response.body));});
        },[]
    );

    if (!events.length && !isItLoad){
        return <LoadingAnimation />;
    }

    return events.length && isItLoad ? (<div className = "event-list-div"><EventList events = {events} /></div>) : (<NoEvent />);
}

export default App;