import InputText from "../input/textinput.component";
import Header from "../header/header.component";
import { Text, View } from "react-native";
import LoginPageStyle from "./loginPageStyle";
import BasicStyle from "../../defaultStyles/style";
import ButtonComponent from "../button/button.component";
import { useEffect, useState } from "react";
import postData from "../../requests/post";
import addLocalStorage from "../../storage/setStorage";
import getLocalStorage from "../../storage/getStorage";

type typeOfLoginPageParams = {
    isDark? : boolean,
    defaultUrl : string,
    reloadEvent : Function,
    loaderFunction : Function
}

const LoginPage = ({isDark, defaultUrl, reloadEvent, loaderFunction}:typeOfLoginPageParams)=>{

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(()=>{
        getUserNameFromLocalStorage();
    },[]);

    const getUserNameFromLocalStorage = async ()=>{
        let username = await getLocalStorage("username");
        setUsername(username ? username : "");
    }

    const login = ()=>{
        if (username && password){
            postData(`${defaultUrl}/login`, {username : username, password : password})
            .then(res =>{
                if (res.token && !res.error){
                    postData(`${defaultUrl}/get-long-token`, {token : res.token})
                    .then(async (res)=>{
                        if (res.token){
                            await addLocalStorage("long_token", res.token);
                            await addLocalStorage("username", username);
                            loaderFunction(true);
                            setTimeout(()=>{
                                reloadEvent();
                                loaderFunction(false);
                            },1000);
                        }
                    })
                }
            })
        }
    }


    return (
        <View style = {{backgroundColor : isDark ? "#1f1f1f" : BasicStyle.light.backgroundColor, ...LoginPageStyle.mainContainer}}>
        <View>
            <Header />
        </View>
        <View style = {{...LoginPageStyle.loginContainer}}>
            <Text style = {{color : isDark ? BasicStyle.dark.color : BasicStyle.light.color  , ...LoginPageStyle.pageTitle}}>Bejelentkezés</Text>
            <InputText defaultValue={username} onChangeFunction={setUsername} isDark = {isDark} placeHolder="Felhasználónév" />
            <InputText defaultValue={password} onChangeFunction={setPassword} isDark = {isDark} placeHolder="Jelszó" password = {true} />
            <ButtonComponent onPressFunction={login} title = "Bejelentkezés" />
            <Text>{}</Text>
        </View>
        </View>
    )
}

export default LoginPage