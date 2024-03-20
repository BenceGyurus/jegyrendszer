import { useEffect, useState } from "react";
import postData from "../../../connection/request";
import LocalSaleEventList from "./local-sale-event-list.component";
import Loader from "../../../loader/loader.component";
import "../../../../css/local-sale-main.css";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";

type typeOfEvent = {
    date : string,
    description : string,
    id : string,
    imageName : string,
    title : string
};

const LocalSaleMain = ()=>{

    const [events, setEvents]:[Array<typeOfEvent>, Function] = useState([]);

    useEffect(()=>{
        postData("/events-to-sale", {token : ParseLocalStorage("long_token")})
        .then((response)=>{setEvents(response.events)});
    }, []);

    console.log(events);

    return (
        <div>
            <h1>Helyi eladás</h1>
            {events.length ? <LocalSaleEventList events={events} /> : <Loader />}
        </div>
    );
}

export default LocalSaleMain;