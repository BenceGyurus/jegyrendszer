import User from "./user.component";
import "../../../../../css/users.css";
import PeddingUser from "./peddingUser.component";
import { v4 as uuid } from 'uuid';
type typeOfUser = {
    username : string,
    access : Object,
    cantEdit : Boolean,
    id : string,
    status: true
}| {
    id : string,
    addedBy : string,
    validTo : number,
    created : number,
    status: false,
    access : Object,
    url: string,
    token : string
}
type typeOfUsersParams = {
    users : Array<typeOfUser>,
    deleteEvent : Function,
    editEvent : Function,
    peddingDelete : Function,
    peddingEdit : Function,
    addNewFunction: Function
}

const Users = ({users,deleteEvent, editEvent,peddingDelete, peddingEdit, addNewFunction}:typeOfUsersParams)=>{
    return (
        <div className = "users-grid-div">
        <div className = "users-grid-div-header">
            <div className = "edit-users-header-title"><h3>Regisztrált felhasználók </h3><span className = "number-of-registred-users">{users.filter(user=>user.status).length} felhasználó</span></div>
            <span className = "add-new-user-button" onClick={e=>{addNewFunction()}}><span className = "plus-icon">+</span>Hozzáadás</span>
        </div>
        <ul className = "user-list">
            {
                users.map((element)=>{
                    return element.status ? <User key={uuid()} deleteEvent={deleteEvent} user = {element} editEvent = {editEvent} /> : "";
                })
            }
        </ul>

        {users.filter(user=>!user.status).length ? <div className = "users-grid-div-header top-border">
            <div className = "edit-users-header-title"><h3>Függőben lévő regisztrációk</h3><span className = "number-of-registred-users">{users.filter(user=>!user.status).length} felhasználó</span></div>
        </div> : ""
        }
        <ul>
            {
                users.map((element:any)=>{
                    return !element.status ? <PeddingUser editFunction = {peddingEdit} deleteFunction = {peddingDelete} key = {uuid()} user = {element} /> : "";
                })
            }
        </ul>

        </div>
    );
}

export default Users;