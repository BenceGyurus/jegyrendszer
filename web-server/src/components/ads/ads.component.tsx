import { useEffect, useState } from "react";
import postData from "../connection/request";
import ParseLocalStorage from "../../cookies/ParseLocalStorage";
import Media from "../media/media.component";
import "../../css/monitor-ads.css";
import QR from "../qrCode/qrCode.component";

const Ads = ()=>{

    const [ads, setAds]:[any, Function] = useState();
    const [index, setIndex] = useState(0);
    const [intervalVar, setIntervalVar]:[any, Function] = useState();

    useEffect(()=>{
        postData("/ads", {token : ParseLocalStorage("long_token")})
        .then(response=>{
            if (response && response.ads){
                setAds(response.ads);
            }
        })
    }, []);

    useEffect(()=>{
        if (intervalVar) clearInterval(intervalVar);
        setIntervalVar(setInterval(()=>{
            if (ads && ads.length){if (index < ads.length-1){setIndex(index+1)}else{setIndex(0)}}
        }, 15000));
    }, [ads, index]);

    console.log(index);

    return <div>
        <div className = "qr-codes-left">
            <QR url="https://www.facebook.com/agora.savaria" color = "black" icon = "/images/logos/facebook-logo.png" size = {150} />
        </div>
        { ads && ads.length ? <Media file = {ads[index].src} autoPlay = {true} loop = {true} controls = {false}  /> : ""}
    </div>;
}

export default Ads;