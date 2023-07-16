import MainEventList from "../event/mainSiteEventList.component";
import { useState, useEffect } from "react";
import { BackHandler, Text, View } from "react-native";
import FullHeightScroll from "../scrollView/scroll-view.component";
import Header from "../header/header.component";
import BasicStyle from "../../defaultStyles/style";
import Event from "../eventDatas/event.component";
type typeOfEvents = {
    id : string,
    date : Date,
    title : string,
    description : string,
    imageName : string
  }
type typeOfLoadEventsParams = {
    isDark? : boolean,
    basicUrl : string,
    controlTokenFunction : Function
};

const LoadEvents = ({isDark, basicUrl, controlTokenFunction}:typeOfLoadEventsParams)=>{

    const [events, setEvents]:[Array<typeOfEvents>, Function] = useState([]);
    const [selectedEvent, setSelectedEvent]:[string, Function] = useState("");


    const loadEvents = ()=>{
        controlTokenFunction();
        fetch(`${basicUrl}/events`)
        .then(async (response:any)=>{
            response = await response.json();
            if (!response.error){
                setEvents(response.events);
            }
        })
    }

    useEffect(()=>{
        loadEvents();
    }, []);


    console.log(events);

    return (
        <View style = {{backgroundColor : isDark ? BasicStyle.dark.backgroundColor : BasicStyle.light.backgroundColor}} >
        <Header/>
        {events.length ? selectedEvent ? <Event id = {selectedEvent} basicUrl={basicUrl} closeFunction={()=>{setSelectedEvent("")}} /> : <FullHeightScroll isDark = {isDark} onRefreshFunction={loadEvents} children={<MainEventList onPressFunction={setSelectedEvent} basicUrl={basicUrl} isDark = {isDark} eventDatas={events} />}/> : <Text>Jelenleg nincs egy rendezvény sem</Text>}
        </View>
    )

}

export default LoadEvents