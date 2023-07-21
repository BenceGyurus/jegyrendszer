import "../../css/eventPage.css";
import Brand from "../brand/embed-brand.component";
import Map from "../map/map.component";

type typeOfMedia = {
    apple_music? : string,
    spotify? : string,
    youtube? : string,
    facebook? : string,
    instagram? : string
}


type typeOfCenter = {
    lat : number,
    lng : number
}

type typeOfPageElemens = {
    title : string,
    description : string,
    date : string,
    image : string,
    media : typeOfMedia,
    position : typeOfCenter,
    location : string
}


const TicketPageItems = ({title, description, date, image, media, location, position}:typeOfPageElemens)=>{
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
            {media.apple_music || media.spotify || media.facebook || media.instagram || media.youtube ?  <div className = "user-side-media">
                <div className = "user-side-media-elements">
                {
                    media.apple_music ? <Brand image = "/images/embed-link-logos/apple_music.svg" link={media.apple_music} brandName="Apple music link" /> : ""
                }
                {
                    media.spotify ? <Brand image = "/images/embed-link-logos/spotify.png" link={media.spotify} brandName="Spotify link" /> : ""
                }
                {
                    media.youtube ? <Brand image = "/images/embed-link-logos/youtube.png" link={media.youtube} brandName="Youtube link" /> : ""
                }
                {
                    media.facebook ? <Brand image = "/images/embed-link-logos/facebook.png" link={media.facebook} brandName="Facebook link" /> : ""
                }
                {
                    media.instagram ? <Brand image = "/images/embed-link-logos/instagram.png" link={media.instagram} brandName="Instagram link" /> : ""
                }
                </div>
            </div> : ""}
            <Map center={position} title = {location} zoomLevel={15} className = "event-map" />
        </div>
    )
}

export default TicketPageItems;