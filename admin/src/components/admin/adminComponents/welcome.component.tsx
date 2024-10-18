import { useEffect, useState } from "react";
import postData from "../../connection/request";
import ParseLocalStorage from "../../../cookies/ParseLocalStorage";
import { Card, Statistic } from "antd";
import "../../../css/dashboard.css";

const Welcome:any = ()=>{

    const [soldTickets, setSoldTickets] = useState(0);
    const [numberOfAtiveEvents, setNumberOfActiveEvents] = useState(0);
    const [response, setResponse] = useState(false);

    useEffect(()=>{
        postData("/sold-stats", {token : ParseLocalStorage("long_token")}).then(response=>{
            if (response && response.numberOfSoldTicket) setSoldTickets(response.numberOfSoldTicket)
            setResponse(true);
        }
        );
        postData("/active-events", {token : ParseLocalStorage("long_token")}).then(response=>{
            if (response && response.numberOfActiveEvents) setNumberOfActiveEvents(response.numberOfActiveEvents)
            setResponse(true);
        }
        );
    })

    return (
        <div>
            <h1>
                Üdvözöllek az Agora Savaria jegyrendszer admin felületén!
            </h1>
            <div className = "dashboard-card-holder">
                <Card className = "dashboard-statistics-card">
                <Statistic title="Eladott jegyek száma az utóbbi egy hétben" value={`${soldTickets}db`} loading={!response} />
                </Card>
                <Card className = "dashboard-statistics-card">
                <Statistic title="Aktív események száma" value={`${numberOfAtiveEvents}db`} loading={!response} />
                </Card>
            </div>
        </div>
    );
}

export default Welcome;