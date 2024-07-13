import { useState, useEffect } from "react";
import postData from "../../connection/request";
import ParseLocalStorage from "../../../cookies/ParseLocalStorage";
import { useNavigate } from 'react-router-dom';
import "../../../css/venues.css";
import VenueList from "./venuesList.component";
import { v4 as uuid } from 'uuid';
import AddNewButton from "../../buttons/add_New.component";

const Venues = ()=>{

    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState<Boolean>(false);

    const load = ()=>{
        let token = ParseLocalStorage("long_token");
        if (token){
            postData("/venues", {token : token})
            .then((datas)=>{
                setLoaded(true);
                if (datas.venues){
                    setRooms(datas.venues);
                }
            });
        }
        else{
            navigate('/admin/login');
        }
    }

    useEffect(()=>{
        load();
        
    }, []);


    return (
        <div key = {uuid()}>
            <h1 className = "venues-title">Helyszínek</h1>
            <AddNewButton onClick={()=>{navigate("/admin/uj-terem")}} />
            <VenueList loaded = {loaded} venues={rooms} newRequest = {load}/>
        </div>
    )
}

export default Venues;