import typeOfEventList from "./type/eventListParams";
import Event from "./event.component";
import { View, Text, useColorScheme, Touchable, Pressable } from "react-native";
import React, { useState } from 'react';
import Theme from "../../theme/defaultSettings";
import EventListStyle from "./styles/eventList.style";
import SuggestedEventList from "./suggestedEvents.component";
import typeOfEvent from "./type/event";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faReceipt } from '@fortawesome/free-solid-svg-icons/faReceipt'
import Refund from "../refund/refund.component";

const EventList = ({ events, openEvent, setRefund }:typeOfEventList)=>{

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
        {suggestedEvents && suggestedEvents.length ? <SuggestedEventList events={suggestedEvents} /> : <></>}
        <View style = {{...EventListStyle.titleView}}><Text style = {{ color : useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color, ...EventListStyle.titles, fontFamily : Theme.default.weightFontFamily}}>Események</Text><Pressable onPress={()=>setRefund(true)} style={{...EventListStyle.refundIcon}}><FontAwesomeIcon icon={faReceipt} size={EventListStyle.refundIcon.width} color = {useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color} /></Pressable></View>
        {events?.map(event=>{
            return suggestedEvents.find(e=>e.id==event.id) ? <></> : <Event onSelectFunction={openEvent} event={event} /> 
        })}
        </View>)
}

export default EventList;