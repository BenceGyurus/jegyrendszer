import { useEffect, useState } from "react";
import CreateSeatMapTable from "./table.component";
import CreateSeats from "./createSeats.component";
import postData from "../connection/request";
import ParseLocalStorage from "../../cookies/ParseLocalStorage";
import Loader from "../loader/loader.component";

const LoadSeatMap = ()=>{

    const [id, setId] = useState("");
    const [datasOfArea, setDatasOfArea]:any = useState({});
    const [loaded, setLoaded] = useState(false);


    const getIdFromUrl = ()=>{
        return window.location.pathname.split("/")[3] ? window.location.pathname.split("/")[3] : "";
    }

    useEffect(()=>{
        setLoaded(false);
        setId(getIdFromUrl());
        let id = getIdFromUrl();
        if (id){
            postData(`/venue/${id}`, {token : ParseLocalStorage("long_token")})
            .then(response=>{
                if (response && !response.error){
                    setDatasOfArea(response);
                }
                setLoaded(true);
            })
        }
        else{
            setLoaded(true);
        }
    }, []);


    return loaded ? <CreateSeats id = {datasOfArea.id} inName={datasOfArea.name} inBackground={datasOfArea.background} inSeats={datasOfArea.seats} inStages={datasOfArea.stages} inIsSector = {datasOfArea.isSector} inOriginalColor = {datasOfArea.originalColor} inStatus={datasOfArea.status} /> : <Loader />;

};


export default LoadSeatMap;