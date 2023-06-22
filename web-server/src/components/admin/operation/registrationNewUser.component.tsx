import WindowHeader from "../../window-header/windowHeader.component";
import InputText from "../../input/inputText.component";
import Password from "../../input/password.component";
import Button from "../../buttons/button.component";
import "../../../css/registration.css"
import Error from "../../natification/error.component";
import { useState, useRef } from "react";
import Success from "../../natification/success.component";
import postData from "../../connection/request";
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
                postData(`/create-profile/${window.location.pathname.split("/")[2]}`, {username : username, password : password})
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
        console.log(errors);
    }

    return (

        <div className = "reg-conteiner">
            <WindowHeader title = "Regisztráció" />
            <div>
                <InputText title = "Felhasználónév" onChangeFunction={setUsername}/>
                <Password value = {password} title = "Jelszó" onChangeFunction={setPassword} />
                <Password value = {rePassword} title = "Jelszó újra" onChangeFunction={setRepassword} />
                <Button title = "Regisztráció" onClickFunction={Control} />
                {errors ? <Error message={errors}/> : successRegistration ? <Success message="Sikeres regisztráció!" /> : ""}
            </div>
        </div>

    )

}

export default Registration;