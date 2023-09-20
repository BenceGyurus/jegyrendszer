import EventList from "./components/eventList.component";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import postData from "../../../connection/request";
import { useEffect, useState } from "react";
import AddNewButton from "../../../buttons/add_New.component";
import Error from "../../../notification/error.component";
import Loader from "../../../loader/loader.component";
import LoadingSkeleton from "../events/components/loading_Skeleton.component";
import { Button, Empty } from 'antd';
import Search from "antd/es/input/Search";
import SearchField from "../../../searchField/Search.component";
import "../../../../css/admin-event-list.css";

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
    id : string,
    contributor : Array<string>
}

const Show_Events_Main = ()=>{

    const [events, setEvets] = useState(Array<typeOfEventDatas>);
    const [error, setError] = useState("");
    const [response, setResponse] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const [end, setEnd] = useState(false);
    const [numberOfPages, setNumberOfPages] = useState(1);

    const getEvets = ()=>{
        setIsLoading(true);
        postData(`/events?page=${page}&limit=${limit}`, {token : ParseLocalStorage("long_token")}).then(
            async (datas)=>{
                setResponse(true);
                if (datas && !datas.datas && !datas.error){
                    if (!datas.events.length) return setEnd(true);
                    setEvets(datas.events);
                    setNumberOfPages(datas.numberOfPages)
                }else{
                    let d = await datas.datas;
                    if (d.error && d.message){
                        setError(d.message);
                    }
                }
                setIsLoading(false);
            }
        );
    }

    const deleteEvent = (id:string)=>{
        if (id){
            postData(`/delete-event/${id}`, {token : ParseLocalStorage("long_token")})
            .then(
                (data)=>{
                    if (!data.error){
                        setPage(1);
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
  
  
    function loadMoreContent() {
        if (end || isLoading) return;
            setIsLoading(true);
            getEvets();
    }

  
    useEffect(() => {
    loadMoreContent()
    }, [page]);

    const edit_Event = (id:string)=>{
        window.location.pathname = `/admin/rendezveny/${id}`;
    }

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    console.log(response, !events.length);

    return <div className = "admin-event-container" >
        <div className = "event-list-header"><h1>Rendezvények</h1><SearchField /></div>
        <Error message = {error} setOpen = {()=>{setError("")}} open = {error != ""} />
        {(events.length || response) && !isLoading ? <EventList events={events} editFunction={edit_Event} deleteFunction={deleteEvent} numberOfPages={numberOfPages} page={page} handleChange={handleChange} /> : !events.length && response ? <div><Empty /></div> :  <LoadingSkeleton limit={limit} /> }
        <AddNewButton onClick={()=>{window.location.pathname = "/admin/rendezveny"}}/>
    </div>
}

export default Show_Events_Main;