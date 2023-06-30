import EventList from "./components/eventList.component";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import postData from "../../../connection/request";
import { useEffect, useState } from "react";
import AddNewButton from "../../../buttons/add_New.component";
import Error from "../../../notification/error.component";
import Loader from "../../../loader/loader.component";

type typeOfTickets = {
    name : string,
    price : number,
    minPrice : number,
    maxPrice : number,
    seats : Array<string>,
    numberOfTickets : number,
    id : string
}

type typeOfEvent = {
    name : string,
    description : string,
    background : string,
    dateOfEvent : string,
    dateOfRelease : string,
    tickets : Array<typeOfTickets>,
    venue : string,
    readable_event_name : string
};

type typeOfEventDatas = {
    eventData : typeOfEvent,
    addedBy : {username : string, userId : string, readableid : string},
    id : string
}

const Show_Events_Main = ()=>{

    const [events, setEvets] = useState(Array<typeOfEventDatas>);
    const [error, setError] = useState("");
    const [response, setResponse] = useState(false);

    const getEvets = ()=>{
        postData("/events", {token : ParseLocalStorage("long_token")}).then(
            async (datas)=>{
                setResponse(true);
                if (datas && !datas.datas && !datas.error){
                    setEvets(datas);
                }else{
                    let d = await datas.datas;
                    if (d.error && d.message){
                        setError(d.message);
                    }
                }            
            }
        );
    }

    useEffect(()=>{
        getEvets();
    }, []);

    const deleteEvent = (id:string)=>{
        if (id){
            postData(`/delete-event/${id}`, {token : ParseLocalStorage("long_token")})
            .then(
                (data)=>{
                    if (!data.error){
                        getEvets();
                    }
                    else{
                        setError(data.message);
                    }
                }
            );
        }
        else{
            
        }
    }

    const edit_Event = (id:string)=>{
        window.location.pathname = `/admin/rendezveny/${id}`;
    }

    return <div>
        <h1>Rendezvények</h1>
        {error ? <Error message = {error} closeFunction = {()=>{setError("")}} /> : ""}
        {events.length || response ? <EventList events={events} editFunction={edit_Event} deleteFunction={deleteEvent} /> : <Loader /> }
        <AddNewButton onClick={()=>{window.location.pathname = "/admin/rendezveny"}}/>
    </div>
}

export default Show_Events_Main;