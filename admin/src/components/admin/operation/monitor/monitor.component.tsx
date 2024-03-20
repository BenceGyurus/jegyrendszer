import { useEffect, useState } from "react";
import MonitorList from "./monitorList.component";
import { Empty } from "antd";
import AddNewButton from "../../../buttons/add_New.component";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import Loader from "../../../loader/loader.component";


const Monitor = ()=>{

    const [monitors, setMonitors] = useState([]);
    const [newMonitorWindow, setNewMonitorWindow] = useState(false);
    const [delay, setDelay]:[number, Function] = useState(0);
    const [loaded, setLoaded]:[boolean, Function] = useState(false);


    const getMonitors = ()=>{
        postData("/monitors", { token : ParseLocalStorage("long_token") })
        .then((response)=>{
            if (!response.error && response.monitors){
                setMonitors(response.monitors);
                setDelay(response.delay);
            }
            setLoaded(true);
        })
    }

    const newMonitor = ()=>{
        postData("/new-monitor", {token : ParseLocalStorage("long_token")})
        .then((response)=>{
            console.log(response);
        });
    }

    useEffect(()=>{
        getMonitors();
    }, []);

    return (<div>

        {monitors && monitors.length ? <MonitorList monitors={monitors} delay={delay} deleteFunction={()=>{}} /> : !loaded ? <Loader /> : <Empty />}

    </div>);

}

export default Monitor;