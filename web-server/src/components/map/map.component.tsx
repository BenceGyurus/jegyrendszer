import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useRef, useEffect } from 'react';
import "../../css/map.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type typeOfMapParams = {
    center : typeOfCenter,
    zoomLevel : number,
    title : string,
    className? : string
}

const markerIcon = new L.Icon({
    iconUrl : "/images/marker.png",
    iconSize : [30,30]
})

type typeOfCenter = {
    lat : number,
    lng : number
}

const Map = ({center, zoomLevel, title, className}:typeOfMapParams)=>{


    const mapRef:any = useRef(null);

     return (
        <MapContainer ref = {mapRef} center={center} zoom={zoomLevel} className = {`map ${className}`} zoomAnimation = {true} zoomControl = {false}>
                <TileLayer
                    className='map-title-layer'
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            <Marker position={center} icon={markerIcon}>
            <Popup>
            {title}
            </Popup>
            </Marker>
        </MapContainer>
        
     )
}

export default Map;