import "../../../../../css/show-admin-event.css";
import AvatarGroup from '@mui/material/AvatarGroup';
import StringAvatar from "../../../../avatar/avatar.component";
import { Tooltip } from 'react-tooltip'

type typeOfEventParams = {
    name : string,
    description : string,
    background : string,
    editFunction : Function,
    deleteFunction : Function,
    id : string,
    contributors : Array<string>
}

const Event = ( { name, description, background, editFunction, deleteFunction,id, contributors }:typeOfEventParams )=>{

  const getUsersInList = (users:Array<string>)=>{
    return users.map((user, index)=>{
        return  (<span style={{color:"white"}}>{user}</span>);
    });
}

console.log(id)

    return (<div className="admin-event">
      <div style={{position: "absolute", margin:5}}>
          <AvatarGroup total={contributors.length} max={3} className="avatar-group" id = {id}>
                {
                    contributors.map((contributor)=>{
                        return <StringAvatar width={40} height={40} username={contributor} />
                    })
                }
            </AvatarGroup>
            <Tooltip place="bottom" anchorSelect = {`#${id}`} id="my-tooltip-children-multiline" style={{color:"white"}} >
                {getUsersInList(contributors)}
            </Tooltip>
      </div>
    <img src={background} alt="Event 1" />
    <h2>{name}</h2>
    <div className="buttons">
      <button className="edit-button" onClick = {e=>editFunction(id)} >Szerkesztés</button>
      <button className="event-delete-button" onClick = {e=>deleteFunction(id)} >Törlés</button>
    </div>
  </div>);
}

export default Event;