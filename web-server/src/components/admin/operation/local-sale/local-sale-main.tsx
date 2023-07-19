import { useEffect, useState } from "react";
import postData from "../../../connection/request";
import LocalSaleEventList from "./local-sale-event-list.component";
import Loader from "../../../loader/loader.component";
import "../../../../css/local-sale-main.css";

type typeOfEvent = {
    date : string,
    description : string,
    id : string,
    imageName : string,
    title : string
};

const LocalSaleMain = ()=>{

    const [events, setEvents]:[Array<typeOfEvent>, Function] = useState([]);

    useState(()=>{
        fetch("/api/v1/events")
        .then(async (response)=>{setEvents((await response.json()).events)});
    });

    return (
        <div>
            <h1>Helyi eladás</h1>
            {events.length ? <LocalSaleEventList events={events} /> : <Loader />}
        </div>
    );
}

export default LocalSaleMain;