import {useState} from "react";
import postData from "../../connection/request";
import "../../css/login.css";
import insertCookie from "../../cookies/insertCookie";
import { useNavigate } from 'react-router-dom';
const Admin = ()=>{
    const [username, setUsername] = useState("");
    const [password, setpassword] = useState("");
    const navigate = useNavigate();

    const login = ()=>{
        postData('/login', { username: username, password: password })
        .then((data) => {
            if (data.error || !data.token){
                return Promise.reject(data);
            }
            else{
                return postData("/get-long-token", {token : data.token});
            }
        })
        .then((data)=>{
            if (data.token){
                insertCookie("long_token", String(data.token), new Date(new Date().setTime(new Date().getTime())+(data.expires_in)),"/");
                navigate('/admin');
            }
        })
        .catch((err)=>{console.log(err)});
    }
    const changePassword = (event:any)=>{setpassword(event.target.value);};
    const changeUsername = (event:any)=>{setUsername(event.target.value);};
    return (
        <div className = "loginContainer" >
            <h1 className = "loginTitle" >Bejelentkezés</h1>
            <div className = "loginPanel" >
                <label htmlFor="username" className = "loginLabel">Felhasználó név</label>
                <input type="text" className = "loginInput" id = "username" onChange={event => changeUsername(event)}/>
                <label htmlFor="password" className = "loginLabel">Jelszó</label>
                <input type="password" id="password" className = "loginInput" onChange={event => changePassword(event)}/>
                <input type="button" value="Bejelentkezés" className = "loginInput" onClick={login} />
            </div>
        </div>
    )
}

export default Admin;