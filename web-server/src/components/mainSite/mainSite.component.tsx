import React, {useState, useEffect} from "react";
import EventList from "../../components/event-list/eventList.component";
import NoEvent from "../../components/event/NoEvent.component";
import LoadingAnimation from "../load-animation/loadAnimation.component";
import Notification from "../notification/notification.component";
import Error from "../notification/error.component";

const App = ()=>{
    const [events, setEvents] = useState([]);
   const [isItLoad, setIsItLoad] = useState(false); 
   const [error, setError] = useState("");

    useEffect(
        ()=>{
            fetch("/api/v1/events")
            .then(async (response:any)=>{try{response =  await response.json()}catch{setError("Hiba történet az események betöltése közben"); response = {error : true, responseData : response}};response.status === 404 ? setTimeout(()=>{setIsItLoad(true)}, 2500) : response.error ? setIsItLoad(true) : setTimeout(()=>{setEvents(response.events); setIsItLoad(true)}, 2500);});
        },[]
    );


    if (!events.length && !isItLoad){
        return <LoadingAnimation />;
    }
    return events.length && isItLoad ? (<EventList events = {events} />) : (<div>{error ? <Notification element={<Error message={error} closeFunction={()=>{setError("")}} />} /> : ""}<NoEvent /></div>);
}

export default App;