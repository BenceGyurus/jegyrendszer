import "../../../../../css/user.css";
type typeOfUser = {
    username : string,
    access : any,
    cantEdit : Boolean,
    id : string
}

type typeOfUserParams = {
    user : typeOfUser,
    deleteEvent : Function,
}


const User = ({ user,deleteEvent }:typeOfUserParams)=>{
    return (
        <li key = {user.id}>
        <div className="user-info">
            <span className="username">{user.username}</span><i className="fas fa-user"></i>
            <span className = "status registered">Registered</span>
            <ul className="access-list">
            {Object.keys(user.access).map(
                    (element, index)=>{
                        return <li className = "access">{user.access[element][0]}</li>
                    }
                )}
            </ul>
            {!user.cantEdit ? 
            <div className="user-actions">
            <button className="edit-button">Edit</button>
            <button className="delete-button" onClick={()=>deleteEvent(user.id)} >Delete</button>
            </div> : ""
            }
            <span className="user-id">{user.id}</span>
        </div>
        </li>
    );
}

export default User;