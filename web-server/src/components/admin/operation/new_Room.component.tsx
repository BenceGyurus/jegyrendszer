import Main from "./seats/main";
import { useState, useEffect } from "react";
import postData from "../../connection/request";
import ParseCookies from "../../../cookies/parseCookies";
import Loader from "../../loader/loader.component";
import ErrorPage from "../../error-page/error-page";


const AddNewRoom = ()=>{
    const [datas, setDatas]:any = useState();
    const [error, setError]:any = useState(false);
    useEffect(()=>{
        if (window.location.href.split("/").length > 4 && window.location.href.split("/")[window.location.href.split("/").length-2] === "terem-szerkesztes"){
            postData(`/venue/${window.location.href.split("/")[window.location.href.split("/").length-1]}`, {token : ParseCookies("long_token")})
            .then((data)=>{
                if (data.error){
                    setError(true);
                }
                else{
                    setDatas(data);
                }
            }).catch(()=>{
                setError(true);
            });
        }
    }, []);

    console.log(error);
    return (
        <div>
            { ParseCookies("long_token") ? window.location.href.split("/").length > 4 && window.location.href.split("/")[window.location.href.split("/").length-2] === "terem-szerkesztes" && datas ? <Main id = {datas ? datas.id : ""} seatsDatas = {datas ? datas.seatsDatas : []} groupsDatas = {datas ? datas.groups : []} bg = {datas ? datas.background : ""}  cbg = {datas ? datas.colorOfBackGround : ""} places = {datas ? datas.places : 0} area = {datas ? datas.sizeOfArea : {width: -1, height: -1}} sGroups = {datas ? datas.selecttedGroup : ""} sOfSeat = {datas ? datas.sizeOfSeat : -1} cOfSeat = {datas ? datas.colorOfSeat : ""} seatMode = {datas ? datas.seatMode : false} suGroups = {datas ? datas.suggestedGroups : []} name = {datas ? datas.name : ""}/> : window.location.href.split("/")[window.location.href.split("/").length-2] !== "terem-szerkesztes" && window.location.href.split("/").length <= 4 ? <Main/> : !error ?  <Loader /> : <ErrorPage /> : window.location.href = "/admin-login"}
        </div>
    );
}

export default AddNewRoom;