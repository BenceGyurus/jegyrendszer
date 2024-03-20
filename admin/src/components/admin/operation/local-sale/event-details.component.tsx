type typeOfEventDetailsParams = {
    title : string,
    description : string,
    image : string
}

const EventDetails = ({title, description, image}:typeOfEventDetailsParams)=>{
    return (
        <div className = "local-sale-event-details-div">
            <div className = "local-sale-event-details-datas">
                <h1 className = "local-sale-event-title">{title}</h1>
                <p className = "local-sale-event-description">{description}</p>
            </div>
            <img src={image} alt={title} className = "local-sale-event-image" />
        </div>
    )
}

export default EventDetails;