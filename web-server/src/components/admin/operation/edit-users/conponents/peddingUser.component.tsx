import "../../../../../css/user.css";
import { v4 as uuid } from 'uuid';
type typeOfUser = {
    id : string,
    addedBy : string,
    validTo : number,
    created : number,
    status: false,
    access : any,
    token : string,
    url : string
}

type typeOfUserParams = {
    user : typeOfUser
}


const PeddingUser = ({ user }:typeOfUserParams)=>{
    return (
        <li key = {user.id}>
        <div className="user-info">
            <span className="username">Hozzáadta: {user.addedBy}</span>
            <span className = "status pedding">Pedding</span>
            <span className = "vaild">{`Érvényes: ${new Date(user.validTo)}`}</span>
            <br />
            <span className = "url">Regisztrációs link: <span className = "link">{window.location.origin}{user.url}{user.token}</span></span>
            <ul className="access-list">
            {user.access ? Object.keys(user.access).map(
                    (element, index)=>{
                        return <li key = {uuid()} className = "access">{user.access[element][0]}</li>
                    }
                ) : ""}
            </ul>
            <div className="user-actions">
            <button className="edit-button">Edit</button>
            <button className="delete-button">Delete</button>
            </div>
            <span className="user-id">{user.id}</span>
        </div>
        </li>
    );
}

export default PeddingUser;