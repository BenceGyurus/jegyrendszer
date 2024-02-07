import { Skeleton } from "@mui/material";
import { v4 as uuid } from "uuid";
import "../../css/buy-ticket-ticket-list.css";

type typeOfTicketListParams = {
  tickets?: Array<typeOfTicket>;
};

type typeOfTicket = {
  name: string;
  places: Array<string> | boolean;
  amount: number;
  price: number;
};

const TicketList = ({ tickets }: typeOfTicketListParams) => {
  return (
    <ul className="tickets-overview">
      {tickets ? (
        tickets.map((ticket) => {
          return (
            <li key={uuid()}>
              <span className="price-and-amount-sum">
                <span className="name-of-ticket">{ticket.name}</span>
                <span className="amount-of-ticket">({ticket.amount})</span>
              </span>
              <span className="price-of-ticket buy-ticket-overview-price">
                {ticket.price}Ft
              </span>
            </li>
          );
        })
      ) : (
        <li>
          <span className="price-and-amount-sum">
            <Skeleton animation="wave" width={100} height={20} />
          </span>
          <span className="price-of-ticket buy-ticket-overview-price">
            <Skeleton animation="wave" width={50} height={20} />
          </span>
        </li>
      )}
    </ul>
  );
};

export default TicketList;
