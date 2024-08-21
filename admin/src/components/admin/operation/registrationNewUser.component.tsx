import WindowHeader from "../../window-header/windowHeader.component";
import InputText from "../../input/inputText.component";
import Password from "antd/es/input/Password";
import "../../../css/registration.css"
import Error from "../../notification/error.component";
import { useState, useRef } from "react";
import Success from "../../notification/success.component";
import postData from "../../connection/request";
import { Alert, Button, Input } from "antd";
import { WarningFilled } from "@ant-design/icons";
const Registration = ()=>{

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRepassword] = useState("");
    const [errors, setErrors] = useState("");
    const [successRegistration, setSuccessRegistration] = useState(false);
    const passwordRef:any = useRef(null);

    const resetPassword = ()=>{
        if (passwordRef && passwordRef.current){
            passwordRef.current.value = "";
        }
    }

    const Control = ()=>{
        if (username.length > 3 && password.length > 5 && rePassword.length > 5){
            if ( password == rePassword) {
                postData(`/create-profile/${window.location.pathname.split("/")[3]}`, {username : username, password : password})
                .then(
                    async (data)=>{
                        let d;
                        setPassword("");
                        setRepassword("");
                        if (data.responseData){
                            d = await data.responseData;
                        }
                        else{
                            d = data;
                        }
                        if (d.error){
                            setErrors(d.message);
                        }
                        else if (!d.error){
                            setErrors("");
                            setSuccessRegistration(true);
                            setTimeout(()=>{
                                window.location.pathname = "/admin"
                            }, 2000);
                        }
                    }
                    
                )
                return;
            }
            else{
                setErrors("A két jelszó nem egyezik");
                setPassword("");
                setRepassword("");
            }
        }
        else{
            setErrors("A felhasználónévnek minimum 4 a jelszónak minimum 6 karakterből kell állnia");
            setPassword("");
            setRepassword("");
        }
    }

    return (

        <div className = "reg-conteiner">
            <h2 className = "registration-title">Regisztráció</h2>
            <div>
                <div className = "registration-form-holder-div">
                    <label htmlFor="username">Felhasználónév</label>
                    <Input size="large" id = "username" autoComplete="username" title = "Felhasználónév" onChange={e=>setUsername(e.target.value)}/>
                </div>
                <div className = "registration-form-holder-div">
                    <label htmlFor="password">Jelszó</label>
                    <Password size="large" id = "password" autoComplete="new-password" value = {password} title = "Jelszó" onChange={e=>setPassword(e.target.value)} />
                </div>
                <div className = "registration-form-holder-div">
                    <label htmlFor="re-password">Jelszó újra</label>
                    <Password size="large" autoComplete="new-password" id = "re-password" value = {rePassword} title = "Jelszó újra" onChange={e=>setRepassword(e.target.value)} />
                </div>
                <Button danger = {!!errors} size="large" onClick={e=>Control()}>Regisztráció</Button>
                <Error message={errors} setOpen={()=>{setErrors("")}} open = {errors != ""} />
                {successRegistration ? <Success message="Sikeres regisztráció!" /> : <></>}
            </div>
        </div>

    )

}

export default Registration;