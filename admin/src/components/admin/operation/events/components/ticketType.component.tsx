import { Button, Card, Tag } from "antd";
import TypeOfTheTicketComponentParams from "../TypeOfTheTicketComponentParams";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "../../../../../css/ticketType.css";

const TypeOfTheTicketComponent = ({ticketType, editFunction, deleteFunction}:TypeOfTheTicketComponentParams)=>{
    return (

        <Card className = "ticket-type-card" title = {ticketType.name} actions={[<DeleteOutlined onClick={e=>deleteFunction(ticketType.id)}  />, <EditOutlined onClick={e=>editFunction(ticketType.id)}/>]}>
            <div className = "ticket-type-card-body">
            <span className = "ticket-type-price">{ticketType.price}Ft</span>
            <Tag color={ticketType.isPublic ? "green" : "red"}>{ticketType.isPublic ? "Publikus" : "Privát"}</Tag>
            </div>
        </Card>
    )
}

export default TypeOfTheTicketComponent;