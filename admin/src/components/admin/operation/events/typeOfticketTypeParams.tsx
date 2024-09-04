import TypeOfTicket from "../report/types/typeOfTicket";
import TicketType from "./ticketType";

export default interface TypeOfTicketTypeParams{
    type? : TicketType | null,
    closeFunction : Function,
    saveFunction : Function
};