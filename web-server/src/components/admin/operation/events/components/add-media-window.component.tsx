import WindowHeader from "../../../../window-header/windowHeader.component";
import React, { useState } from 'react';
import LogoInput from "../../../adminComponents/logoinput.component";
import Brand from "../../../../brand/embed-brand.component";
import "../../../../../css/add-media-window.css";

type typeOfMedia = {
    apple_music? : string,
    spotify? : string,
    youtube? : string,
    facebook? : string,
    instagram? : string
}

type typeOfAddMediaParams = {
    closeFunction : Function;
    onChangeFunction : Function,
    media : typeOfMedia
}

function MediaShareWindow({closeFunction, onChangeFunction, media}:typeOfAddMediaParams) {
    return (
        <div className = "add-media-window">
            <WindowHeader title = "Média hozzáadása" closeWindowFunction={closeFunction} />
            <div className = "window-elements">
            <div>
                <LogoInput value={media.spotify ? media.spotify : ""} onChangeFunction={onChangeFunction} params={["spotify"]} logo="/images/logos/spotify.png" placeholder="Spotify link..." />
                <LogoInput value = {media.apple_music ? media.apple_music : ""} onChangeFunction={onChangeFunction} params={["apple_music"]}  logo = "/images/logos/Apple_Music_Small.svg" placeholder="Apple Music link..." />
                <LogoInput value = {media.youtube ? media.youtube : ""} onChangeFunction={onChangeFunction} params={["youtube"]}  logo = "/images/logos/youtube-icon.png" placeholder="Youtube link..." />
                <LogoInput value = {media.instagram ? media.instagram : ""} onChangeFunction={onChangeFunction} params={["instagram"]}  logo = "/images/logos/instagram-logo.png" placeholder = "Instagram link..." />
                <LogoInput value={media.facebook ? media.facebook : ""} onChangeFunction={onChangeFunction} params={["facebook"]}  logo = "/images/logos/facebook-logo.png" placeholder="Facbook link..." />
            </div>
            <p>A kitöltött mezők a brand logójával kerülnek megjelenítésre. Amelyik mező nincs kitöltve az nem fog megjelenítésere kerülni. <a href="">Segítség a kitöltéshez</a>.</p>
            <p>Megjelenés az oldalon:</p>
            <Brand image = "/images/embed-link-logos/apple_music.svg" link = "https://music.apple.com/hu/album/delirium/1682294053?i=1682294555&l=hu" brandName="Apple Music link" />
            <Brand image = "/images/embed-link-logos/spotify.png" link = "https://open.spotify.com/album/2mtBBnbkj7HMywF5FAtERT?si=0-wcNE4TR--34V69KecHmA" brandName="Spotify link" />
            <Brand image = "/images/embed-link-logos/facebook.png" link = "https://www.facebook.com/agora.savaria" brandName="Facebook link" />
            <Brand image = "/images/embed-link-logos/instagram.png" link = "https://www.instagram.com/agorasavaria/" brandName="Instagram link" />
            </div>
        </div>
    )

}

export default MediaShareWindow;
