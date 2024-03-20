import { useState } from "react";
import Window from "../window/window.component";
import typeOfSeatDetails from "./type/seatDetails";
import { Input, Modal } from "antd";


const SeatDetails = ({seat, setSeat, editSeat}:typeOfSeatDetails)=>{

    const [nameOfSeat, setNameOfSeat] = useState(!!seat ? seat.name : "");

    return (!!seat ? <Modal
        open={!!seat}
        title={seat.name}
        onOk={()=>editSeat({name : nameOfSeat})}
        onCancel={()=>setSeat(false)}>
        <label htmlFor="">Név</label>
        <Input title = "Név" defaultValue={seat.name} onChange={e=>setNameOfSeat(e.target.value)} type = "text" />
      </Modal> : <></>
      )
}


/*
seat ? <Window closeFunction={()=>setSeat(false)} title = {seat.name}>
        <div>
            <label>id</label>
            <Input title = "id" defaultValue={seat.id} disabled = {true} type = "text"  />
            <label>x</label>
            <Input title="X" defaultValue={seat.x} disabled = {true} type = "text" />
            <label>y</label>
            <Input title = "Y" defaultValue={seat.y} disabled={true} type = "text" />
            <Input title = "Név" defaultValue={seat.name} type = "text" />
        </div>
    </Window> : <></>*/

export default SeatDetails;