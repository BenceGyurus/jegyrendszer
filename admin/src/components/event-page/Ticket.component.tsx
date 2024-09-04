type typeOfTicketParams = {
    name : string,
    amount: number,
    price: number,
    id : string,
    incrementFunction : Function,
    decrementFunction : Function,
    free : number,
    typeId : string
}

const Ticket = ({name, amount, price, id, incrementFunction, decrementFunction, free, typeId}:typeOfTicketParams)=>{
  return (
    <div className="ticket-item" key = {id}>
      <div className="ticket-info">
        <span className="ticket-name">{name}</span>
        <span className="ticket-price">{price}Ft</span>
      </div>
      {free > 0 ? 
       (<div className="quantity-selector">
        <button className="quantity-btn" onClick={(e)=>{decrementFunction(id, typeId)}}>-</button>
        <div className="ticket-quantity">{amount}</div> 
        <button className="quantity-btn" onClick={(e)=>{incrementFunction(id, typeId)}}>+</button>
        </div>) :
        <div className="quantity-selector">
        <div className="ticket-sold-out">Elfogyott</div>
        </div>
      }
      </div>);
}


/*

<div className = "ticket-box" key = {id}>
        <div className="ticket-header">
        <h2 className="ticket-title">{name}</h2>
        <span className="ticket-price">{price}Ft</span>
        </div>
      {free > 0 ? <div className="ticket-quantity">
        <button className="quantity-button" onClick={(e)=>{decrementFunction(id)}}>-</button>
        <span id="quantity_1">{amount}</span>
        <button className="quantity-button" onClick={(e)=>{incrementFunction(id)}}>+</button>
      </div> : <div className = "outOfTickets">Elfogyott</div>}
      </div>
    */
export default Ticket;