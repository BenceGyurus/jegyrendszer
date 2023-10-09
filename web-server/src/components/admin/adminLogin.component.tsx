import {useState} from "react";
import postData from "../connection/request";
import "../../css/login.css";
import insertCookie from "../../cookies/insertCookie";
import { useNavigate } from 'react-router-dom';
import Notification from "../notification/notification.component";
import Error from "../notification/error.component";
import { Input } from "antd";
import Password from "antd/es/input/Password";
const Admin = ()=>{
    const [username, setUsername] = useState("");
    const [password, setpassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const login = ()=>{
        postData('/login', { username: username, password: password })
        .then(async (data) => {
            if (data.error || !data.token){
                data = data.responseData ? await data.responseData : data;
                return data.message ? setError(data.message) : setError("Hiba történt a bejelentkezés során");
            }
            else{
                return postData("/get-long-token", {token : data.token}).then(async (data)=>{
                    if (data.token){
                        insertCookie("long_token", String(data.token), new Date(new Date().setTime(new Date().getTime())+(data.expires_in)),"/");
                        navigate('/admin');
                    }
                    else if (data && data.responseData){
                        data = await data.responseData;
                    }
                })
                .catch(async (err)=>{
                    //setError("Hiba történet a bejelentkezés során");
                });;
            }
        });
    }
    const changePassword = (event:any)=>{setpassword(event.target.value);};
    const changeUsername = (event:any)=>{setUsername(event.target.value);};
    return (
        <div>
        <Error message = {error} title="Sikertelen bejelentkezés" open = {error!=""} setOpen={()=>{setError("")}} />
    <div className="login-container">
    <h2>Admin bejelentkezés</h2>
    <form>
      <div className="login-form-group">
        <label htmlFor="username">Felhasználónév</label>
        <Input autoComplete="username" size="large" type="text" id="username" name="username" required onChange={event => changeUsername(event)} onKeyDown={e=>{if (e.key.toUpperCase() === "ENTER") login()}}  />
      </div>
      <div className="login-form-group">
        <label htmlFor="password">Jelszó</label>
        <Password autoComplete="password" size = "large" type="password" id="password" name="password" required onChange={event => changePassword(event)} onKeyDown={e=>{if (e.key.toUpperCase() === "ENTER") login()}}  />
      </div>
      <div className="login-form-group">
        <input type="button" value="Bejelentkezés" onClick={login}/>
      </div>
    </form>
  </div>
        </div>
    )
}

export default Admin;