import "../../css/cookie.css";

const cookiePopUp = ()=>{
    return (
        <div className = "CookiePopUpWindow">
            <h3 className = "cookieTitle">Elfogadja a sütik használatát?</h3>
            <input className = "cookieButton" type="button" value="Igen" onClick={()=>{console.log("igen")}}/>
            <input className = "cookieButton" type="button" value="További információk" onClick={()=>{console.log("nem")}}/>
        </div>
    );
}

export default cookiePopUp;