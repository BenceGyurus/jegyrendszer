import "../../../../../css/user.css";
import { v4 as uuid } from 'uuid';
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
            <div className = "admin-user-icon"><i className="fas fa-user"></i></div>
            <div className = "user-info-datas">
            <span className="username">{user.username}</span>
            <span className = "status registered">Registered</span>
            </div>
            </div>
            <ul className="access-list">
            {Object.keys(user.access).map(
                    (element, index)=>{
                        return <li key = {uuid()} className = "access">{user.access[element][0]}</li>
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