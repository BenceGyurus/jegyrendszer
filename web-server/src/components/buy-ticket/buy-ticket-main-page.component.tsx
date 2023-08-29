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
import BuyingStepper from "./stepper.component";
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContactlessIcon from '@mui/icons-material/Contactless';
import BillingInformations from "./billing-infomations.component";
import PaymentMethods from "./payment-methods.component";


type typeOfBillAddress = {
    firstname : string,
    lastname : string,
    postalCode : number,
    city : string,
    taxNumber : string,
    phone : string,
    mail : string
}


type typeOfTicketDatas = {
    eventId : string, 
    tickets : Array<typeOfTickets>, 
    fullAmount : number, 
    fullPrice : number, 
    eventName : string, 
    dateOfEvent : number,
    customerDatas : typeOfBillAddress
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

    const [sameInvoiceData, setSameInvoiceData]:[boolean, Function] = useState(true);
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
    const [fetching, setfetching] = useState(false);
    const [step, setStep] = useState(1);
    const [link, setLink] = useState("");
    const [ticketDatas, setTicketDatas]:[typeOfTicketDatas, Function] = useState({
        eventId : "", 
        tickets : [], 
        fullAmount : 0, 
        fullPrice : 0, 
        eventName : "", 
        dateOfEvent : 0,
        customerDatas : {
            firstname : "",
            lastname : "",
            postalCode : 0,
            city : "",
            taxNumber : "",
            phone : "",
            mail : ""
        }
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
            setfetching(true);
            let datas = {
                customerData : {
                    firstname : firstname,
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
            .then(response=>{if (response.link){setStep(2); getDatas(); setLink(response.link)} setfetching(false)});
        }
    }

    const pay = ()=>{
        if (link){
            window.location.href = link;
        }
        else{
            setError("Hiba történt a fizetés során");
        }
    }

    const getDatas = ()=>{
        let token = window.location.pathname.split("/")[2];
        fetch(`/api/v1/buy-ticket-details/${token}`)
        .then(response=>response.json())
        .then(data=>{
            if (!data.error){
                if (data.customerDatas){
                    setFirstname(data.customerDatas.firstname);setLastname(data.customerDatas.lastname); setPostCode(data.customerDatas.postalCode); setCity(data.customerDatas.city); setAddress(data.customerDatas.address); if (data.customerDatas.address2 != "null") setAddress2(data.customerDatas.address2); if (data.customerDatas.taxNumber != "null") setTaxNumber(data.customerDatas.taxNumber); setPhone(data.customerDatas.phone); setMail(data.customerDatas.mail)
                }
                setTicketDatas(data)
            }
        });
    }

    useEffect(()=>{
        getDatas();
    }, []);

    return <div>
        {error ? <Notification element={<Error message={error} closeFunction={()=>{setError("")}} />} /> : ""}
        <div style={{margin : 10}}><BuyingStepper active = {step} /></div>
        { step == 1 ? <div><h1>Adatok megadása</h1>
        <DatasOfCustomer setFirstName={setFirstname} setLastName={setLastname} setPostalCode={setPostCode} setCity={setCity} setAddress={setAddress} setAddress2={setAddress2} setMail={setMail} setPhone={setPhone} setTaxNumber={setTaxNumber} city = {city} firstName={firstname} lastName={lastname} zip = {postCode} tax={taxNumber} mail={mail} phone = {phone} address={address} address2={address2} setInvoiceName={()=>{}} sameInvoiceData={sameInvoiceData} setSameInvoiceData = {setSameInvoiceData} />
        <div className = "deitals">
        {ticketDatas.eventId ? <Details tickets = {ticketDatas.tickets} fullPrice={ticketDatas.fullPrice} nameOfEvent={ticketDatas.eventName} coupon={usedCoupon} /> : <Details />}
        <Coupon onClickFunction={useRefCode} changeReferalCode={setReferalCode} value = {referalCode} />
        <PaymentMethods methods={[{id : "simple-pay", image : "/images/logos/simple_pay.png"}]} onChangeFunction={()=>{}} />
        <div className = "button-grid"><LoadingButton
          size="small"
          onClick={sendDatas}
          endIcon={<ArrowForwardIcon />}
          loading={fetching}
          loadingPosition="end"
          variant="contained"
          className = "payingButton"
          style = {{background : "white", color : "#595959"}}
        >Tovább a fizetéshez</LoadingButton></div></div></div> : "" }
        {step == 2 ? <div>
            <h1>Adatok ellenőrzése</h1>
            <h2>Jegy adatai</h2>
            <div className="deitals">{ticketDatas.eventId ? <Details tickets = {ticketDatas.tickets} fullPrice={ticketDatas.fullPrice} nameOfEvent={ticketDatas.eventName} coupon={usedCoupon} /> : <Loader />}</div>
            <div className="deitals"><BillingInformations firstname={firstname} lastname={lastname} zip={postCode} city={city} address={address} address2 = {address2 == "null" ? undefined : address2} tax={taxNumber == "null" ? undefined : taxNumber} phone={phone} mail={mail} /></div>
            <LoadingButton
          size="small"
          onClick={pay}
          endIcon={<ContactlessIcon style={{color : "white"}} />}
          loading={fetching}
          loadingPosition="end"
          variant="contained"
          className = "payingButton"
        >Fizetés</LoadingButton>
        <LoadingButton
          size="small"
          onClick={()=>{setStep(1)}}
          endIcon={<ArrowBackIcon />}
          loading={fetching}
          loadingPosition="end"
          variant="contained"
          className = "payingButton"
        >Vissza</LoadingButton>
        </div> : ""}
    </div>
}

export default BuyTicketMainPage;