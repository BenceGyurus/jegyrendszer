import { Skeleton } from "@mui/material";
import "../../css/buy-ticket-details.css";
import TicketList from "./buy-ticket-ticketList.component";
import Discount from "./used-discount.component";

type typeOfDeitalsParams = {
  tickets?: Array<typeOfTickets>;
  fullPrice?: number;
  nameOfEvent?: string;
  coupon?: typeOfCoupon;
};

type typeOfCoupon = {
  name: string;
  amount: number;
  money: boolean;
};

type typeOfTicketType = {
  name : string,
  price : number,
  id : string,
  amount : number
}

type typeOfTickets = {
  name: string;
  places: Array<string> | boolean;
  amount: number;
  price: number;
  types : Array<typeOfTicketType>
};

const Details = ({
  tickets,
  fullPrice,
  nameOfEvent,
  coupon,
}: typeOfDeitalsParams) => {
  return (
    <div className="overview">
      <h3 className="name-of-event">
        {nameOfEvent ? (
          nameOfEvent
        ) : (
          <Skeleton animation="wave" width={"80%"} height={30} />
        )}
      </h3>
      {<TicketList tickets={tickets} />}
      {coupon && coupon.name ? (
        <Discount
          name={coupon.name}
          amount={coupon.amount}
          cash={coupon.money}
        />
      ) : (
        ""
      )}
      <hr />
      <h4 className="full-price">
        Összesen:{" "}
        <span className="buy-ticket-overview-price">
          {coupon && coupon.amount && fullPrice ? (
            coupon.money ? (
              fullPrice >= coupon.amount ? (
                fullPrice - coupon.amount
              ) : (
                0
              )
            ) : (
              fullPrice - fullPrice * (coupon.amount / 100)
            )
          ) : fullPrice ? (
            fullPrice
          ) : (
            <Skeleton animation="wave" width={100} height={20} />
          )}
          {fullPrice ? "Ft" : ""}
        </span>
      </h4>
    </div>
  );
};

export default Details;
