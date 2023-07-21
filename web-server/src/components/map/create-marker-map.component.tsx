import { MapContainer, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet'
import { useRef, useState,useMemo } from 'react';
import "../../css/create-marker.css";
import "leaflet/dist/leaflet.css";
import L, { Icon, circle } from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";
import { EditControl } from "react-leaflet-draw";

type typeOfMapParams = {
    center : typeOfCenter,
    zoomLevel : number,
    title : string,
    className? : string,
    setPosition : Function
}

const markerIcon = new L.Icon({
    iconUrl : "/images/marker.png",
    iconSize : [35,35],
    iconRetinaUrl : "/images/marker.png"
})


type typeOfCenter = {
    lat : number,
    lng : number
}

const MarkerMap = ({center, zoomLevel, title, className, setPosition}:typeOfMapParams)=>{

    const markerRef = useRef(null);

    const eventHandlers = useMemo(
        () => ({
          dragend() {
            const marker:any = markerRef.current
            if (marker != null) {
              setPosition(marker.getLatLng())
            }
          },
        }),
        [],
      )
      /*const toggleDraggable = useCallback(() => {
        setDraggable((d) => !d)
      }, [])*/

     return (
        <MapContainer center={center} zoom={zoomLevel} className = {`marker-map ${className}`} zoomAnimation = {true}>

                <Marker position={center} draggable={true} icon={markerIcon} eventHandlers={eventHandlers} ref = {markerRef}>
                    <Popup>
                        {title}
                    </Popup>
                </Marker>

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
        </MapContainer>
        
     )
}

export default MarkerMap;