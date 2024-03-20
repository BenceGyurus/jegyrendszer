import React from 'react';
import "../../../../../css/ticketCounter.css";

type typeOfTicketCounterParams  = {
    ticketCount : number
}

const TicketCounter = ({ ticketCount }:typeOfTicketCounterParams ) => {
  return (
    <div className="ticket-counter">
    <div className="ticket-count">{ticketCount}</div>
    <div className="ticket-label">Tickets</div>
  </div>
  );
};

export default TicketCounter;
