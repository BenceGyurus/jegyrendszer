import { useEffect, useState } from "react";
import postData from "../connection/request";
import ParseLocalStorage from "../../cookies/ParseLocalStorage";
import Media from "../media/media.component";

const Ads = ()=>{

    const [ads, setAds]:[any, Function] = useState();
    const [index, setIndex] = useState(0);

    useEffect(()=>{
        postData("/ads", {token : ParseLocalStorage("long_token")})
        .then(response=>{
            if (response && response.ads){
                setAds(response.ads);
            }
        })
        setInterval(()=>{
            if (ads && ads.length){ setIndex(index < ads.length ?  index+1 : 0)}
        }, 10000);
    }, []);

    return <div>
        { ads && ads.length ? <Media file = {ads[index].src} autoPlay = {true}  /> : ""}
    </div>;
}

export default Ads;