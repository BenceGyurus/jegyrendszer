import MediaShareWindow from "./add-media-window.component";
import Brand from "../../../../brand/embed-brand.component";
import { useState } from "react";
import { Button } from 'antd';


type typeOfMedia = {
    apple_music? : string,
    spotify? : string,
    youtube? : string,
    facebook? : string,
    instagram? : string
}

type typeOfAddMediaParams = {
    media : typeOfMedia,
    changeValueOfMedia : Function,
    disabled? : boolean
}

const AddMedia = ({media, changeValueOfMedia, disabled}:typeOfAddMediaParams)=>{

    const [mediaWindow, setMediaWindow]:[boolean, Function] = useState(false);

    return (
        <div>
            <Button  type="primary" size="large" onClick={(e)=>{setMediaWindow(true)}} style={{color : "white"}} >Média hozzáadása</Button>
        {mediaWindow ? <MediaShareWindow media={media} closeFunction = {()=>{setMediaWindow(false)}} onChangeFunction = {changeValueOfMedia} /> : ""}
        <div className = "added">
            {
                media.apple_music ? <Brand image="/images/embed-link-logos/apple_music.svg" link = {media.apple_music} brandName="Apple Music link" /> : ""
            }
            {
                media.spotify ? <Brand image="/images/embed-link-logos/spotify.png" link = {media.spotify} brandName="Spotify link" /> : ""
            }
            {
                media.youtube ? <Brand image="/images/embed-link-logos/youtube.png" link = {media.youtube} brandName="Youtube link" /> : ""
            }
            {
                media.facebook ? <Brand image="/images/embed-link-logos/facebook.png" link = {media.facebook} brandName="Facebook link" /> : ""
            }
            {
                media.instagram ? <Brand image="/images/embed-link-logos/instagram.png" link = {media.instagram} brandName="Instagram link" /> : ""
            }
        </div>
        </div>
    )
}

export default AddMedia;