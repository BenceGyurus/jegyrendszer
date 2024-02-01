import { Button } from "antd";
import "../../css/buy-ticket-button.css";
import { useState, useEffect } from "react";
import { Collapse } from "@mui/material";
 
type typeOfTickets = {
    name : string,
    amount : number
};

type typeOfBuyButtonParams = {
    onClickFunction : Function,
    amountOfTickets : number,
    tickets? : Array<typeOfTickets>,
    otherInformationFunction : Function,
    isSeats? : boolean,
    selectTicketsFunction : Function,
    shakeButton : boolean,
    error : boolean
}

const BuyButton = ({onClickFunction, amountOfTickets, tickets, otherInformationFunction, isSeats, selectTicketsFunction, shakeButton, error}:typeOfBuyButtonParams)=>{
    const [minSizeOfWindow, setMinSizeOfWindow] = useState(1000);
    const [visible, setIsVisible] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
          const scrollPosition = window.scrollY;
          const targetPosition = 70;
          if (targetPosition){
            const isTargetVisible = scrollPosition > targetPosition;
            setIsVisible(isTargetVisible);
          }
        };
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);

      useEffect(()=>{
        setIsDisabled(amountOfTickets<=0);
      }, [amountOfTickets]);

    return (<div className = {`buy-ticket-button-div ${visible ? "visible-buy-ticket-button-div" : "invisible-buy-ticket-button-div"}`} id = "buy-ticket-button-div">
        <div>
            {tickets && tickets.length ? tickets.map(ticket=>{
                return <span></span>
            }) : <></>}
        </div>
        <div>
        {amountOfTickets && isSeats ? <Button className = {shakeButton ? `shake-buy-button` : ""} onClick={()=>selectTicketsFunction()} type = "primary" ><span className = "buying-button-other-informations">Jegyek kiválasztása</span></Button> : <Button onClick = {()=>{otherInformationFunction()}} size="middle" type="primary" className = "buying-button"><span className = "buying-button-other-informations">További információk</span></Button>}
        <Button danger = {error} size="middle" className = "buying-button" disabled = {isDisabled} onClick={()=>onClickFunction()}>Vásárlás {amountOfTickets ? <span className = "buy-button-amount-of-tickets">{amountOfTickets}<span className = "buy-button-ticket-icon"><i className="fas fa-ticket-alt"></i></span></span> : <></>}</Button>
        </div>
    </div>)
}

export default BuyButton;