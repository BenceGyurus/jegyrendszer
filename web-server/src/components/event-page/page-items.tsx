import "../../css/eventPage.css";
type typeOfPageElemens = {
    title : string,
    description : string,
    date : string,
    image : string
}


const TicketPageItems = ({title, description, date, image}:typeOfPageElemens)=>{
    return (
        <div>
            <div className = "event-page-title-div">
            <h1 className = "event-page-title">{title}</h1>
            </div>
            <div style = {{backgroundImage : `url(${image})`}} className = "event-page-image-div">
            {window.innerWidth >= 700 ? <div className = "image-gradient-top"></div> : ""}
            <div className = "image-gradient-bottom"></div>
            </div>
            <a className = "buy-ticket-button" href = "#tickets">Jegyvásárlás</a>
            <p className = "event-page-description">{description}</p>
        </div>
    )
}

export default TicketPageItems;