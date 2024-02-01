import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import postData from "../../request/post";
import typeOfEvent from "../events/type/event";
import EventList from "../events/eventList.component";
import { ScrollView, RefreshControl, View } from "react-native";
import React from "react";
import EventNavigationStyle from "./style/eventsNavigation.style";
import Error from "../error/error.component";
import Camera from "../camera/camera.component";
import ReadQrCode from "../qr-code-reading/readQrCode.component";
import Refund from "../refund/refund.component";

const EventsNavigation = ()=>{

    const [events, setEvents]:[Array<typeOfEvent>, Function] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [error, setError] = useState("");
    const [selectedEvent, setSelectedEvent] = useState("");
    const [refund, setRefund] = useState<boolean>(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getEvents();
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
      }, []);

    const getEvents = ()=>{
        AsyncStorage.getItem("token")
        .then(token=>{
            if (token){
                postData(`events-to-sale`, {token : token})
                .then(response=>{
                    if (response && response.events){
                        setEvents(response.events);
                        console.log(response.events);
                    }
                    else{
                        setError(response.message ? response.message : "Hiba történt az események betöltése közben.")
                    }
                })
            }
        });
    }

    useEffect(()=>{
        getEvents();
    }, []);

    console.log(selectedEvent);

    return (<View>
        <Error show = {!!error} message = {error} />
        {selectedEvent && events && events.length ? <ReadQrCode backFunction={()=>setSelectedEvent("")} id = {selectedEvent} /> : events && events.length ? <ScrollView style = {{...EventNavigationStyle.eventNavigationScrollView}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>onRefresh()} />}>
            {refund ? <Refund onClose={()=>setRefund(false)} /> : <EventList setRefund={setRefund} openEvent={setSelectedEvent} refreshFunction={getEvents} events = {events} />}
        </ScrollView> : <></>}</View>)
}

//

/*
 */

export default EventsNavigation;