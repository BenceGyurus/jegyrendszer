import {useState} from "react";
import ajax from "../../connection/request";
import "../../css/login.css";
const Admin = ()=>{
    const [username, setUsername] = useState("");
    const [password, setpassword] = useState("");

    const login = async ()=>{
        console.log(await ajax("POST", "/login", JSON.stringify({username: username, password: password})));
    };
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