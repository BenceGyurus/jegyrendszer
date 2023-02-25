import { useState, useEffect } from "react";
import postData from "../../connection/request";
import ParseCookies from "../../../cookies/parseCookies";
import { useNavigate } from 'react-router-dom';
import "../../../css/venues.css";

const Venues = ()=>{

    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
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
        
    }, []);

    return (
        <div>
            <h1>Termek hozzáadása és szerkesztése</h1>
            <input type="button" value="+" className="add-venue-button" onClick = {()=>{navigate("/uj-terem")}}/>
        </div>
    )
}

export default Venues;