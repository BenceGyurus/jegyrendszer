import { useState, useEffect } from "react";
import Loader from "../loader/loader.component";
import Details from "./buy-ticket-details.component";
import DatasOfCustomer from "./datas-of-customer.component";
import BuyButton from "../event-page/buy-button.component";
import "../../css/buy-ticket-main.css";
import Coupon from "./buy-ticket-coupon.component";
import postData from "../connection/request";
import Error from "../natification/error.component";
import Notification from "../natification/notification.component";

type typeOfTicketDatas = {
    eventId : string, 
    tickets : Array<typeOfTickets>, 
    fullAmount : number, 
    fullPrice : number, 
    eventName : string, 
    dateOfEvent : number
}

type typeOfTickets = {
    name : string,
    places : Array<string> | boolean,
    amount : number,
    price : number
}

type typeOfCoupon = {
    name : string,
    money : boolean,
    amount : number
}

const BuyTicketMainPage = ()=>{

    const [referalCode, setReferalCode]:[string, Function] = useState("");
    const [usedCoupon, setUsedCoupon]:[typeOfCoupon, Function] = useState({name : "", money : false, amount : 0});
    const [error, setError]:[string, Function] = useState("");
    const [ticketDatas, setTicketDatas]:[typeOfTicketDatas, Function] = useState({
        eventId : "", 
        tickets : [], 
        fullAmount : 0, 
        fullPrice : 0, 
        eventName : "", 
        dateOfEvent : 0
    });


    const useRefCode = ()=>{
        if (referalCode){
            postData("/control-coupon-code", {code : referalCode, eventId : ticketDatas.eventId})
            .then(response=>{
                if (response.used){
                    setUsedCoupon({name : referalCode, money : response.money, amount : response.amount})
                }
                else if (response.message){
                    setError(response.message)
                }
                else{
                    setError("Nem sikerült felhasználni a beírt kódot");
                }
            })
        }
    }

    useEffect(()=>{
        let token = window.location.pathname.split("/")[2];
        fetch(`/buy-ticket-details/${token}`)
        .then(response=>response.json())
        .then(data=>setTicketDatas(data));
    }, []);

    return <div>
        {error ? <Notification element={<Error message={error} closeFunction={()=>{setError("")}} />} /> : ""}
        <h1>Jegyvásárlás</h1>
        <DatasOfCustomer />
        <div className = "deitals">
        {ticketDatas.eventId ? <Details tickets = {ticketDatas.tickets} fullPrice={ticketDatas.fullPrice} nameOfEvent={ticketDatas.eventName} coupon={usedCoupon} /> : <Loader />}
        <Coupon onClickFunction={useRefCode} changeReferalCode={setReferalCode} value = {referalCode} />
        <button className = "payingButton">Fizetés</button>
        </div>
    </div>
}

export default BuyTicketMainPage;