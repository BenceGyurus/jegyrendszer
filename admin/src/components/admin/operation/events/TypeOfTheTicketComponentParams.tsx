import TicketType from "./ticketType";

export default interface TypeOfTheTicketComponentParams{
    ticketType : TicketType,
    editFunction : Function,
    deleteFunction : Function,
}