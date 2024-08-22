import postData from "../connection/request";
import ParseLocalStorage from "../../cookies/ParseLocalStorage";
import { useState, useEffect } from "react";
import "../../css/admin-user.css";
import StringAvatar from "../avatar/avatar.component";
import SkeletonUser from "./skeletonUser.component";
import { Button} from 'antd';
import { LogoutOutlined } from "@ant-design/icons";

const logOutFunction = ()=>{
    window.localStorage.removeItem("long_token");
    window.location.pathname = "/";
};


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

    return (<div className = "admin-user-element-main">
        {userName ? <div className = "admin-user-element">
        <a href = "/admin/profil"><StringAvatar username = {userName} width = {30} height = {30} /></a>
        <span className = "admin-username">{userName}</span>
        <button className = "logout-button" onClick={logOutFunction}><LogoutOutlined /></button>
    </div> : <SkeletonUser />}
</div>);

}


/*
        <div className = "admin-operation-buttons-div">
        <Button icon = { <i className="fas fa-sign-out-alt"></i> } style={{border : "none", boxShadow : "1px 2px 2px rgba(0,0,0,0.1)", marginTop : 3, fontSize : 13}} onClick={()=>{localStorage.clear(); window.location.pathname = "/"}}>Kijelentkezés</Button>
        </div>*/

export default AdminUserComponent;