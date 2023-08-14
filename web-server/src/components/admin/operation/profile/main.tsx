import "../../../../css/edit-profile.css";
import InputText from "../../../input/inputText.component";
import Button from "../../../buttons/button.component";
import { useEffect, useState } from "react";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import Success from "../../../notification/success.component";
import Error from "../../../notification/error.component";
import Password from "../../../input/password.component";
const EditProfileMain = ()=>{

    const [userData, setUserData] = useState({username : "", id : ""});
    const [username, setUsername] = useState("");
    const [edit, setEdit] = useState("");
    const [error, setError] = useState("");
    const [oldPass, setOldPass] = useState("");
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");


    useEffect(()=>{
        postData("/get-user-data", {token : ParseLocalStorage("long_token")})
        .then(
            response=>{
                if (response.username && response.id){
                    setUserData({username : response.username, id : response.id});
                    setUsername(response.username);
                }
            }
        )
    }, []);

    const changeUsername = ()=>{
        if (username && username != userData.username){
            postData("/change-username", {token : ParseLocalStorage("long_token"), datas : {username : username}})
            .then(async (response)=>{
                if (!response.error && response.username){
                    setUsername(response.username);
                    setEdit("Felhasználónév megváltoztatása sikeres")
                }
                else{
                    setError((await response.responseData).message);
                }
            });
        }
    }

    const changePassword = ()=>{
        if (pass1 === pass2 && oldPass && pass1.length >= 5){
            postData("/change-password", {token : ParseLocalStorage("long_token"), datas : {oldPassword : oldPass, password : pass1}})
            .then(async (response)=>{
                console.log(response);
                if (response.update){
                    setEdit("A jelszó megváltoztatása sikeres!");
                }
                else if (response.responseData){
                    response = await response.responseData;
                    if (response.error && response.message){
                        setError(response.message)
                    }
                    else if (response.error){
                        setError("Váratlan hiba történt");
                    }
                }
                else{
                    setError("A jelszó megváltoztatása sikertelen!");
                }
            });
        }
    }

    return (
        <div className="edit-profile-container">
            
            {edit ? <div className = "natification-div"><Success message={edit} closeFunction={()=>{setEdit("")}} /></div> : ""}
            {error ? <div className = "natification-div"><Error message={error} closeFunction={()=>{setError("")}} /></div> : ""}
            <h1>
                Profil szerkesztése
            </h1>
                <label htmlFor="username">Új Felhasználónév:</label>
                <input type="text" id="username" name="username" onChange={(e)=>setUsername(e.target.value)} />
                <button onClick={(e)=>changeUsername()}>Mentés</button>
                <label htmlFor="oldPassword">Régi jelszó</label>
                <input type="password" id="oldPassword" name="oldPassword" onChange={e=>setOldPass(e.target.value)}/>
                <label htmlFor="newPassword">Új jelszó</label>
                <input type="password" id="newPassword" name="newPassword" onChange={e=>setPass1(e.target.value)}/>
                <label htmlFor="confirmPassword">Új jelszó mégegyszer</label>
                <input type="password" id="confirmPassword" name="confirmPassword" onChange={e=>setPass2(e.target.value)} />
                <button onClick={e=>changePassword()}>Mentés</button>
        </div>
    )
}

export default EditProfileMain;