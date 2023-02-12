const EventImage =(params:any)=>{
    return (
        <div>
            <img src={params.imageName} alt={params.id} className = "event-image" />
        </div>
    )
}

export default EventImage;