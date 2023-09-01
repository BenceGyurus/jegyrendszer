import { useEffect, useState } from "react"
import getEvents from "./getEvents"
import Event from "../event/event.component"
import { Carousel } from '@ant-design/react-native'
import View from 'react-native-ui-lib/view';

const EventList = ()=>{

    const [events, setEvents]:any = useState([]);

    useEffect(()=>{
        getEvents().then(
            (response:any)=>{
                if (!response.error){
                    setEvents(response)
                }
            }
        ).catch((err)=>{
            console.log(err)
        })
    }, []);

    

    return (<View>
        {
            events.length ? events.map((event:any)=>{
                console.log("event:", event.eventData.name);
                return <Event title = {event.eventData.name} image = {event.eventData.background} id = {event.eventData.readable_event_name} />
            }) : ""
        }
    </View>)
}


export default EventList;