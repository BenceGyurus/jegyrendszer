import MainEventList from "../event/mainSiteEventList.component";
import { useState, useEffect } from "react";
import { BackHandler, Text, View } from "react-native";
import FullHeightScroll from "../scrollView/scroll-view.component";
import Header from "../header/header.component";
import BasicStyle from "../../defaultStyles/style";
import Event from "../eventDatas/event.component";
import postData from "../../requests/post";
import getLocalStorage from "../../storage/getStorage";
type typeOfEvents = {
    eventData : {
        date : Date,
        name : string,
        description : string,
        background : string
    },
    id : string
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
        getLocalStorage("long_token")
        .then(
            longToken=>{
                if (longToken){
                    postData(`${basicUrl}/events`, {token : longToken})
                    .then(response=>{
                        console.log(response);
                        if (!response.error){
                            setEvents(response);
                        }
                    });
                }
            }
        );
    }

    useEffect(()=>{
        loadEvents();
    }, []);

    console.log(selectedEvent);


    return (
        <View style = {{backgroundColor : isDark ? BasicStyle.dark.backgroundColor : BasicStyle.light.backgroundColor}} >
        {events.length ? selectedEvent ? <Event id = {selectedEvent} basicUrl={basicUrl} closeFunction={()=>{setSelectedEvent("")}} isDark = {isDark} /> : <FullHeightScroll onRefreshFunction={loadEvents} children={<MainEventList isDark = {isDark} onPressFunction={setSelectedEvent} basicUrl={basicUrl} eventDatas={events} />}/> : <Text>Jelenleg nincs egy rendezvény sem</Text>}
        </View>
    )

}

export default LoadEvents