import { useState } from "react";
import "../../css/eventPage.css";
import Brand from "../brand/embed-brand.component";
import Map from "../map/map.component";
import OpenMapLink from "../openMap/openMap.component";
import Share from "../share/share.component";

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
    location : string,
    address : string
}




const TicketPageItems = ({title, description, date, image, media, location, position, address}:typeOfPageElemens)=>{

    const [months, setMonths] = useState(["JANUÁR", "FEBRUÁR", "MÁRCIUS", "ÁPRILIS", "MÁJUS", "JÚNUIS", "JÚLIUS", "AUGUSZTUS", "SZEPTEMBER", "OKTÓBER", "NOVEMBER", "DECEMBER"]);

    const scroll = ()=>{
        const element:any = document?.getElementById('tickets');
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
    }
    }

    return (
        <div className = "event-page-items-div">
            <div className = "event-page-title-div">
            <h1 className = "event-page-title">{title}</h1>
            <span className = "date-of-event">
                {new Date(date).getFullYear()}. { months[new Date(date).getMonth()]} {new Date(date).getDate() < 10 ? `0${new Date(date).getDate()}` : new Date(date).getDate()}. {new Date(date).getHours() < 10 ? `0${new Date(date).getHours()}` : new Date(date).getHours()}:{new Date(date).getMinutes() < 10 ? `0${new Date(date).getMinutes()}` : new Date(date).getMinutes()}
            </span>
            </div>
            <div style = {{backgroundImage : `url(${image})`}} className = "event-page-image-div">
            {window.innerWidth >= 700 ? <div className = "image-gradient-top"></div> : ""}
            <div className = "image-gradient-bottom"></div>
            </div>
            <Share />
            <button className="buy-ticket-button" onClick={e=>scroll()}>
            Jegyvásárlás
            </button>
            <p className = "event-page-description" id = "event-page-description">{description.split("\n").length ? description.split("\n").map((paragraph:string)=>{return <p>{paragraph}</p>}) : description}</p>
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
            <div className = "event-map-div">
                <div className = "event-location-and-date">
                <div className="event-location-name">
                    <p>
                    <span className = "location-icon"><i style={{fontSize : 25}} className="fas fa-map-marker-alt"></i></span>
                        <OpenMapLink address={address} text={location} className = "location-name-map-link" />
                    </p>
                </div>
                </div>
                <div className = "event-map-border-radius"><Map center={position} title = {location} zoomLevel={15} className = "event-map" /></div>
            </div>
        </div>
    )
}

export default TicketPageItems;