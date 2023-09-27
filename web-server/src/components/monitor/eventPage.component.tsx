import QR from "../qrCode/qrCode.component"
import "../../css/monitor_event.css";

type typeOfMedia = {
    spotify? : string,
    youtube? : string,
    apple_music? : string,
    instagram? : string,
    facebook? : string
}

type typeOfEvent = {
    media : typeOfMedia,
    id : string,
    background : string,
    title : string,
    desctiption : string,
    location : string,
    positions : { lat : number, lng : number },
    venue : string
}

type typeOfEventPageParams = {
    event : typeOfEvent
}

const EventPage = ({ event }:typeOfEventPageParams)=>{
    return (<div className = "monitor-event-main-holder">
        <div>
            <div className ="monitor-event-image-holder" style={{backgroundImage : `url("${event.background}")`, width : (window.innerHeight-80)*.6, height : (window.innerHeight-80)*.6}}>
            </div>
            <div className = "monitor-event-title"><h1>{event.title}</h1></div>
            <div className = "qr-codes">
            {
                    event.media.apple_music ? <QR icon = "/images/logos/Apple_Music_Small.svg" url={event.media.apple_music} /> : ""
                }
                {
                    event.media.spotify ? <QR icon = "/images/logos/spotify.png" url={event.media.spotify}/> : ""
                }
                {
                    event.media.youtube ? <QR icon = "/images/logos/youtube-icon.png" url={event.media.youtube} /> : ""
                }
                {
                    event.media.facebook ? <QR icon = "/images/logos/facebook-logo.png" url={event.media.facebook}/> : ""
                }
                {
                    event.media.instagram ? <QR icon = "/images/logos/instagram-logo.png" url={event.media.instagram} /> : ""
                }
            </div>
        </div>
    </div>)
}

export default EventPage;