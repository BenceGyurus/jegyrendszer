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
    deleteEvent : Function
}

const Users = ({users,deleteEvent}:typeOfUsersParams)=>{
    return (
        <ul className = "user-list">
            {
                users.map((element)=>{
                    return element.status ? <User key={uuid()} deleteEvent={deleteEvent} user = {element} /> : <PeddingUser key = {uuid()} user = {element} />
                })
            }
        </ul>
    );
}

export default Users;