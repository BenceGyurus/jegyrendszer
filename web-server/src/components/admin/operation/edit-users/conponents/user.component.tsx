import "../../../../../css/user.css";
import { v4 as uuid } from 'uuid';
import Avatar from '@mui/material/Avatar';
import StringAvatar from "../../../../avatar/avatar.component";
import { Badge, Tag } from "antd";
type typeOfUser = {
    username : string,
    access : any,
    cantEdit : Boolean,
    id : string
}

type typeOfUserParams = {
    user : typeOfUser,
    deleteEvent : Function,
    editEvent : Function
}


const User = ({ user,deleteEvent, editEvent }:typeOfUserParams)=>{

    return (
        <li className = "user-list-element" key = {user.id}>
        <div className="user-info">
        <div className = "userid">
            <StringAvatar username = {user.username} />
            <div className = "user-info-datas">
            <span className="username">{user.username}</span>
            <Badge status="success" text="Registered" style={{marginLeft : 10, color : "#7d7d7d"}}/>
            </div>
            </div>
            <ul className="access-list">
            {Object.keys(user.access).map(
                    (element, index)=>{
                        return <li key = {uuid()} className = "access"><Tag color="blue">{user.access[element][0]}</Tag></li>
                    }
                )}
            </ul>
            <div className="user-actions">
                <span onClick={e=>{if (!user.cantEdit) editEvent(user)}}><i className="fas fa-pen"></i></span>
                <span onClick={e=>{if (!user.cantEdit) deleteEvent(user.id)}}><i className="fas fa-trash"></i></span>
            </div>
        </div>
        </li>
    );
}

export default User;