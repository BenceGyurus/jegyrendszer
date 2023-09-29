import { QrcodeOutlined } from "@ant-design/icons"
import "../../../../css/admin-ads.css";

 
type typeOfAdParams = {
    type : string,
    src : string,
    name : string,
    website : string,
    _id : string,
    editFunction : Function,
    deleteFunction : Function
}

const Ad = ( { type, src, name, website, _id, deleteFunction, editFunction }:typeOfAdParams )=>{
    return (<div className = "ads-component">
        <h3>{name} {type == "mov" || type == "mp4" ? <span><i className="fas fa-film"></i></span> : <span><i className="fas fa-image"></i></span>}</h3>
        {website ? <span><QrcodeOutlined /> {website}</span> : ""}
        <div className = "action-btn">
            <input type="button" value="Törlés" className = "delete-button" onClick={e=>deleteFunction(_id)} />
            <input type="button" value="Szerkesztés" className = "edit-button" onClick={e=>editFunction(_id)} />
        </div>
    </div>)
}

export default Ad;