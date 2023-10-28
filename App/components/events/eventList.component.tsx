import typeOfEventList from "./type/eventListParams";
import Event from "./event.component";
import { View, Text, useColorScheme } from "react-native";
import React, { useState } from 'react';
import Theme from "../../theme/defaultSettings";
import EventListStyle from "./styles/eventList.style";
import SuggestedEventList from "./suggestedEvents.component";
import typeOfEvent from "./type/event";

const EventList = ({ events }:typeOfEventList)=>{

    const compareDates = (date1:string, date2:Date)=>{
        let d1 = new Date(date1);
        let d2 = new Date(date2);
        return (d1.getFullYear() === d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() >= d2.getDate() && d1.getDate() - 2 <= d2.getDate());
    }

    const filterEvents = ()=>{
        let l:Array<typeOfEvent> = [];
        events.forEach((event)=>{
            if (compareDates(event.date, new Date())) l.push(event);
        })
        return l;
    }

    const [suggestedEvents, setSuggestedEvents]:[Array<typeOfEvent>, Function] = useState(filterEvents());


    return (<View style = {{paddingBottom: "15%"}}>
        <SuggestedEventList events={suggestedEvents} />
        <Text style = {{ color : useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color, ...EventListStyle.titles, fontFamily : Theme.default.weightFontFamily}}>Események</Text>
        {events?.map(event=>{
            return suggestedEvents.find(e=>e.id==event.id) ? <></> : <Event event={event} /> 
        })}
        </View>)
}

export default EventList;