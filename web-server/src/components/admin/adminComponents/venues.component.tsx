import { useState, useEffect } from "react";
import postData from "../../connection/request";
import ParseCookies from "../../../cookies/parseCookies";
import { useNavigate } from 'react-router-dom';
import "../../../css/venues.css";
import VenueList from "./venuesList.component";

const Venues = ()=>{

    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    const load = ()=>{
        let token = ParseCookies().long_token;
        if (token){
            postData("/venues", {token : token})
            .then((datas)=>{
                if (datas.venues){
                    setRooms(datas.venues);
                }
            });
        }
        else{
            navigate('/admin-login');
        }
    }

    useEffect(()=>{
        load();
        
    }, []);

    console.log("rooms", rooms);

    return (
        <div>
            <input type="button" value="+" className="add-venue-button" onClick = {()=>{navigate("/uj-terem")}}/>
            <VenueList venues={rooms} newRequest = {load}/>
        </div>
    )
}

export default Venues;