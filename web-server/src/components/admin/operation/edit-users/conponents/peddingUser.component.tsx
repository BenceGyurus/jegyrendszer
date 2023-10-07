import { Badge } from "antd";
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
    user : typeOfUser,
    deleteFunction : Function,
    editFunction : Function
}


const PeddingUser = ({ user, deleteFunction, editFunction }:typeOfUserParams)=>{

    const getDate = (date:number)=>{
        let d = new Date(date);
        return `${d.getFullYear()} ${d.getMonth()+1 < 10 ? `0${d.getMonth()+1}` : d.getMonth()+1}. ${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}. ${d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()}`;
    }


    return (
        <li key = {user.id} className = "user-list-element">
        <div className="user-info">
            <span className="username">Hozzáadta: {user.addedBy}</span>
            <Badge status="processing" text="Pedding" style={{marginLeft : 10, color : "#7d7d7d"}}/>
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
                <span onClick={e=>{editFunction(user)}}><i className="fas fa-pen"></i></span>
                <span onClick={e=>{deleteFunction(user.id)}}><i className="fas fa-trash"></i></span>
            </div>
        </div>
        </li>
    );
}

export default PeddingUser;