import { Card } from "antd";
import "../../../../css/local-sale-event-list.css";
import { ShopFilled, ShoppingCartOutlined } from "@ant-design/icons";

type typeOfEvent = {
    date : string,
    description : string,
    id : string,
    imageName : string,
    title : string
};

type typeOfLocalSaleEventParams = {
    events : Array<typeOfEvent>
}

const LocalSaleEventList = ({events}:typeOfLocalSaleEventParams)=>{
    return (
        <div className = "local-sale-event-list-holder">
            {events.map(event=>{
                return <Card actions={[<ShoppingCartOutlined onClick = {()=>{window.location.href = `/admin/eladas/${event.id}`}} />]} className="local-sale-event-div" cover = {<img src={event.imageName} onClick = {()=>{window.location.href = `/admin/eladas/${event.id}`}} alt="Az esemény képe" className = "local-sale-image" />}>
                        <h3 className = "local-sale-event-title">{event.title}</h3>
                </Card>
            })}
        </div>
    );
}

export default LocalSaleEventList;