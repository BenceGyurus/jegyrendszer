import { QrcodeOutlined } from "@ant-design/icons"
import Ad from "./ad.component"

type typeOfAds = {
    name : string,
    src : string,
    type : string,
    website : string,
    _id : string
}

type typeOfAdsListParams = {
    ads : Array<typeOfAds>,
    editFunction : Function,
    deleteFunction : Function

}


const AdsList = ( {ads, editFunction, deleteFunction}:typeOfAdsListParams )=>{
    return <div className = "ads-holder">
        {
            ads.map(element=>{
               return <Ad src={element.src} type={element.type} website={element.website} name = {element.name} _id = {element._id} deleteFunction={deleteFunction} editFunction={editFunction} />
            })
        }
    </div>
} 

export default AdsList;