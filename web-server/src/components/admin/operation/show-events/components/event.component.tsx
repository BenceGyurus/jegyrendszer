import "../../../../../css/show-admin-event.css";
import AvatarGroup from '@mui/material/AvatarGroup';
import StringAvatar from "../../../../avatar/avatar.component";
import { Tooltip } from 'react-tooltip'
import { v4 as uuid } from 'uuid';
import { Badge } from "antd";

type typeOfEventParams = {
    name : string,
    description : string,
    background : string,
    editFunction : Function,
    deleteFunction : Function,
    id : string,
    contributors : Array<string>,
    eventKey? : string,
    isActive? : boolean
}

const Event = ( { name, description, background, editFunction, deleteFunction,id, contributors,eventKey, isActive }:typeOfEventParams )=>{

  const getUsersInList = (users:Array<string>)=>{
    return users.map((user, index)=>{
        return  (<span key = {uuid()} style={{color:"white"}}>{user}</span>);
    });
}


    return (<div className="admin-event" key={eventKey}>
      <div style={{position: "absolute", margin:5}} key = {uuid()}>
          <AvatarGroup total={contributors.length} max={3} className="avatar-group" id = {id}>
                {
                    contributors.map((contributor, index)=>{
                        return <StringAvatar key={uuid()} width={40} height={40} username={contributor} />
                    })
                }
            </AvatarGroup>
      </div>
    <img src={background} alt="Event 1" key = {uuid()} />
    <h2>{name}</h2>
    <div className="buttons" key = {uuid()}>
      <button className="edit-button" onClick = {e=>editFunction(id)} >Szerkesztés</button>
      <button className="event-delete-button" onClick = {e=>deleteFunction(id)} >Törlés</button>
    </div>
    <div className = "event-active">
        <Badge status={isActive ? `success` : "error"} text = {isActive ? "Aktív" : "Inaktív"} style={{color : isActive ? "#8dc572" : "#be6464"}}/>
      </div>
  </div>);
}

export default Event;