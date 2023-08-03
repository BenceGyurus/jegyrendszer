import { useState, useEffect } from "react";
import Loader from "../loader/loader.component";
import Details from "./buy-ticket-details.component";
import DatasOfCustomer from "./datas-of-customer.component";
import BuyButton from "../event-page/buy-button.component";
import "../../css/buy-ticket-main.css";
import Coupon from "./buy-ticket-coupon.component";
import postData from "../connection/request";
import Error from "../notification/error.component";
import Notification from "../notification/notification.component";

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

type typeOfBillAddress = {
    firstname : string,
    lastname : string,
    postalCode : number,
    city : string,
    taxNumber : string,
    phone : string,
    mail : string
}

const BuyTicketMainPage = ()=>{

    const [referalCode, setReferalCode]:[string, Function] = useState("");
    const [usedCoupon, setUsedCoupon]:[typeOfCoupon, Function] = useState({name : "", money : false, amount : 0});
    const [error, setError]:[string, Function] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [postCode, setPostCode] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [address2, setAddress2] = useState("");
    const [taxNumber, setTaxNumber] = useState("");
    const [phone, setPhone] = useState("");
    const [mail, setMail] = useState("");
    const [ticketDatas, setTicketDatas]:[typeOfTicketDatas, Function] = useState({
        eventId : "", 
        tickets : [], 
        fullAmount : 0, 
        fullPrice : 0, 
        eventName : "", 
        dateOfEvent : 0
    });


    const useRefCode = ()=>{
        console.log(referalCode);
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

    const sendDatas = ()=>{
        if (firstname && lastname && String(postCode).length === 4 && city && address && phone  && mail){
            let datas = {
                customerData : {
                    fistname : firstname,
                    lastname : lastname,
                    postalCode : postCode,
                    city : city,
                    address : address,
                    address2 : address2 ? address2 : "null",
                    taxNumber : taxNumber ? taxNumber : "null",
                    phone : phone,
                    mail : mail
                },
                coupon : usedCoupon.name
            }
            let token = window.location.pathname.split("/")[2];
            postData(`/payment/${token}`, {datas : datas})
            .then(response=>{console.log(response)});
        }
    }

    useEffect(()=>{
        let token = window.location.pathname.split("/")[2];
        fetch(`/api/v1/buy-ticket-details/${token}`)
        .then(response=>response.json())
        .then(data=>setTicketDatas(data));
    }, []);

    return <div>
        {error ? <Notification element={<Error message={error} closeFunction={()=>{setError("")}} />} /> : ""}
        <h1>Adatok megadása</h1>
        <DatasOfCustomer setFirstName={setFirstname} setLastName={setLastname} setPostalCode={setPostCode} setCity={setCity} setAddress={setAddress} setAddress2={setAddress2} setMail={setMail} setPhone={setPhone} setTaxNumber={setTaxNumber} city = {city} />
        <div className = "deitals">
        {ticketDatas.eventId ? <Details tickets = {ticketDatas.tickets} fullPrice={ticketDatas.fullPrice} nameOfEvent={ticketDatas.eventName} coupon={usedCoupon} /> : <Loader />}
        <Coupon onClickFunction={useRefCode} changeReferalCode={setReferalCode} value = {referalCode} />
        <button className = "payingButton" onClick={sendDatas}>Tovább a fizetéshez</button>
        </div>
    </div>
}

export default BuyTicketMainPage;