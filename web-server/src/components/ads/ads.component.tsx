import { useEffect, useState } from "react";
import postData from "../connection/request";
import ParseLocalStorage from "../../cookies/ParseLocalStorage";
import Media from "../media/media.component";
import "../../css/monitor-ads.css";
import QR from "../qrCode/qrCode.component";
import typeOfAdsParams from "./types/typeOfAdsParams";


const Ads = ({ads}:typeOfAdsParams)=>{

    const [index, setIndex] = useState(0);
    const [intervalVar, setIntervalVar]:[any, Function] = useState();

    useEffect(()=>{
        if (intervalVar) clearInterval(intervalVar);
        setIntervalVar(setInterval(()=>{
            if (ads && ads.length){if (index < ads.length-1){setIndex(index+1)}else{setIndex(0)}}
        }, 15000));
    }, [ads, index]);

    return <div>
        <div className = "qr-codes-left">
            <QR url="https://www.facebook.com/agora.savaria" color = "black" icon = "/images/logos/facebook-logo.png" size = {150} />
            {ads && ads[index] && ads[index]?.website ? <QR url={ads[index].website} color = "black" size = {150} /> : <></>}
        </div>
        { ads && ads.length ? <Media file = {ads[index].src} autoPlay = {true} loop = {true} controls = {false}  /> : ""}
    </div>;
}

export default Ads;