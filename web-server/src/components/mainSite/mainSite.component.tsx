import React, {useState, useEffect} from "react";
import EventList from "../../components/event-list/eventList.component";
import NoEvent from "../../components/event/NoEvent.component";
import LoadingAnimation from "../load-animation/loadAnimation.component";

const App = ()=>{
    const [events, setEvents] = useState([]);
   const [isItLoad, setIsItLoad] = useState(false); 

    useEffect(
        ()=>{
            fetch("/api/v1/events")
            .then(async (response:any)=>{response =  await response.json();response.status === 404 ? setTimeout(()=>{setIsItLoad(true)}, 2500) : response.error ? setIsItLoad(true) : setTimeout(()=>{setEvents(response.events); setIsItLoad(true)}, 2500);});
        },[]
    );


    if (!events.length && !isItLoad){
        return <LoadingAnimation />;
    }
    return events.length && isItLoad ? (<EventList events = {events} />) : (<NoEvent />);
}

export default App;