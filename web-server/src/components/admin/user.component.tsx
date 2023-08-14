import postData from "../connection/request";
import ParseLocalStorage from "../../cookies/ParseLocalStorage";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faRightFromBracket, faUserAlt, faUserPen} from "@fortawesome/free-solid-svg-icons";
import "../../css/admin-user.css";
import StringAvatar from "../avatar/avatar.component";

const AdminUserComponent = ()=>{

    const [userName, setUserName] = useState("");

    useEffect(()=>{
        postData("/get-user-data", {token : ParseLocalStorage("long_token")})
    .then(response=>{
        if (response.username){
            setUserName(response.username);
        }
    });
    }, []);

    return <div className = "admin-user-element-main"><div className = "admin-user-element">
        <StringAvatar username = {userName} width = {50} height = {50} />
        <span className = "admin-username">{userName}</span>
        <div className = "admin-operation-buttons-div">
        <span className = "admin-operation-button" id = "logout-button" onClick={(e)=>{localStorage.removeItem("long_token");window.location.reload()}}><FontAwesomeIcon icon={faRightFromBracket} /></span>
        <span className = "admin-operation-button" onClick={(e)=>{window.location.pathname = "/admin/profil"}}><FontAwesomeIcon icon = {faUserPen} /></span>
        </div>
    </div>
</div>;

}

export default AdminUserComponent;