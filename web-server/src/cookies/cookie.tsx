import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import "../css/cookie.css";
import CookieIcon from '@mui/icons-material/Cookie';
import { v4 as uuid } from 'uuid';

const Cookies = ()=>{

    const [isCookiesAccepted, setIsCookiesAccepted] = useState<boolean>(false);
    const [cookies, setCookie, removeCookie] = useCookies(['use-cookies', 'token']);
    const [question, setQuestion] = useState(true);

    const acceptCookies = ()=>{
        setCookie("use-cookies", true);
        setIsCookiesAccepted(true);
        setQuestion(false);
    }

    const declineCookies = ()=>{
        setCookie("use-cookies", false);
        setIsCookiesAccepted(false);
        setQuestion(false);
    }

    useEffect(()=>{
        setIsCookiesAccepted(!!cookies["use-cookies"]);
        setQuestion(cookies["use-cookies"]=== false || cookies["use-cookies"] === true ? false : true)
        if (isCookiesAccepted){
            if (!cookies["token"]) setCookie("token", uuid());
        }
    }, [isCookiesAccepted]);

    return (question ? <div className = "CookiePopUpWindow">
        <div>
            <CookieIcon fontSize="large" />
        </div>
        <div>
            <h2>Sütik engedélyzése</h2>
            <p>Ez az oldal sütiket használ a működéséhez</p>
            <button className = "cookieButton" onClick={()=>acceptCookies()}>Engedélyezés</button>
            <button className = "cookieButton" onClick={()=>declineCookies()}>Letiltás</button>
        </div>
    </div> : <></>)
}

export default Cookies;