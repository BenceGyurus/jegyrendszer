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
    id : string,
    contributor : Array<string>
}

const Show_Events_Main = ()=>{

    const [events, setEvets] = useState(Array<typeOfEventDatas>);
    const [error, setError] = useState("");
    const [response, setResponse] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(3);
    const [isLoading, setIsLoading] = useState(false);
    const [end, setEnd] = useState(false);
    const [numberOfPages, setNumberOfPages] = useState(1);

    const getEvets = ()=>{
        postData(`/events?page=${page}&limit=${limit}`, {token : ParseLocalStorage("long_token")}).then(
            async (datas)=>{
                setResponse(true);
                if (datas && !datas.datas && !datas.error){
                    if (!datas.length) return setEnd(true);
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
        console.log(end, isLoading);
        if (end || isLoading) return;
            setIsLoading(true);
            getEvets();
    }

  
    function handleScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadMoreContent();
      }
    }
  
    useEffect(() => {
    loadMoreContent();
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const edit_Event = (id:string)=>{
        window.location.pathname = `/admin/rendezveny/${id}`;
    }

    console.log(isLoading);

    return <div className = "admin-event-container" >
        <h1>Rendezvények</h1>
        {error ? <Error message = {error} closeFunction = {()=>{setError("")}} /> : ""}
        {events.length || response ? <EventList events={events} editFunction={edit_Event} deleteFunction={deleteEvent} /> : <Loader /> }
        <AddNewButton onClick={()=>{window.location.pathname = "/admin/rendezveny"}}/>
    </div>
}

export default Show_Events_Main;