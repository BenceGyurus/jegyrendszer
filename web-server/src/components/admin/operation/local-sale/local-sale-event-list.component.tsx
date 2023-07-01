import "../../../../css/local-sale-event-list.css";

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
        <div>
            {events.map(event=>{
                return <div key = {event.id} className = "local-sale-event-div" onClick = {()=>{window.location.href = `/admin/eladas/${event.id}`}}>
                    <img src={event.imageName} alt="Az esemény képe" className = "local-sale-image" />
                    <h3 className = "local-sale-event-title">{event.title}</h3>
                </div>
            })}
        </div>
    );
}

export default LocalSaleEventList;