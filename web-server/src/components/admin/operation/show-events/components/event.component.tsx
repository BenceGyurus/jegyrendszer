import "../../../../../css/show-admin-event.css";
import AvatarGroup from '@mui/material/AvatarGroup';
import StringAvatar from "../../../../avatar/avatar.component";
import { v4 as uuid } from 'uuid';
import { Badge, Avatar, Card, Tooltip  } from "antd";
import { DeleteOutlined, EditOutlined, InfoCircleFilled } from "@ant-design/icons";


type typeOfEventParams = {
    name : string,
    description : string,
    background : string,
    editFunction : Function,
    deleteFunction : Function,
    id : string,
    contributors : Array<string>,
    eventKey? : string,
    isActive? : boolean,
    isAccess? : boolean
}

const Event = ( { name, description, background, editFunction, deleteFunction,id, contributors,eventKey, isActive, isAccess }:typeOfEventParams )=>{

  const getUsersInList = (users:Array<string>)=>{
    return users.map((user, index)=>{
        return  (<span key = {uuid()} style={{color:"white"}}>{user}</span>);
    });
}


    return (
      <Card
      cover={
        <img alt="esemény képe" src={background}/>
    }
    actions={isAccess ? [
      <DeleteOutlined onClick = {e=>deleteFunction(id)} />,
      <EditOutlined onClick = {e=>editFunction(id)} />
    ] : [<Tooltip title = "Nincs  hozzáférésed az esemény szerkesztéséhez"><InfoCircleFilled /></Tooltip>]}
  >
    <div className = "card-spaceing">
    <AvatarGroup total={contributors.length} max={3} className="avatar-group" id = {id}>
          {
            contributors.map((contributor, index)=>{
              return <StringAvatar key={uuid()} width={40} height={40} username={contributor} />
                })
            }
    </AvatarGroup>
    <div className = "event-title-in-card">
    <Badge status={isActive ? `success` : "error"} text = {isActive ? "Aktív" : "Inaktív"} style={{color : isActive ? "#8dc572" : "#be6464", marginLeft: 12}}/>
    <h2>{name}</h2>
    </div>
    </div>
  </Card>
    );
}

export default Event;

/*<div className="admin-event" key={eventKey}>
      <div style={{position: "absolute", margin:5}} key = {uuid()}>
          
      </div>
      <img src={background} alt="Event 1" key = {uuid()} />
    <Badge status={isActive ? `success` : "error"} text = {isActive ? "Aktív" : "Inaktív"} style={{color : isActive ? "#8dc572" : "#be6464", marginLeft: 12}}/>
    <h2>{name}</h2>
    <div className="buttons" key = {uuid()}>
      <button className="edit-button" onClick = {e=>editFunction(id)} >Szerkesztés</button>
      <button className="event-delete-button" onClick = {e=>deleteFunction(id)} >Törlés</button>
    </div>
  </div>*/