import { Button, View, useColorScheme } from "react-native"
import InputText from "../inputs/text-input/text-input.component"
import { useEffect, useState } from "react"
import { Colors } from "react-native/Libraries/NewAppScreen";
import postData from "../../request/post";
import AsyncStorage from '@react-native-async-storage/async-storage'
import Error from "../error/error.component";
import typeOfLoginPageParams from "./types/loginPageParams";


const LoginPage = ({ setToken }:typeOfLoginPageParams)=>{

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const login = ()=>{
        postData("login", {password : password, username : userName})
        .then(async (response)=>{
            if (response.token){
                AsyncStorage.setItem("username", userName);
                postData("get-long-token", {token : response.token})
                .then(
                    (response)=>{
                        console.log(response);
                        if (response.token) {
                            AsyncStorage.setItem("token", response.token);
                            if (setToken) setToken(response.token);
                        }
                    }
                )
            }
            else if (response.error){
                setError(response.message ? response.message : "Hiba történt a bejelentkezés során");
            }
        });
    }


    useEffect(()=>{
        AsyncStorage.getItem("username")
        .then(username=>{
            if (username) setUserName(username);
        })
    }, []);

    return <View style = {{ backgroundColor :  useColorScheme()=== "dark" ? Colors.darker : Colors.lighter, width : "100%", height : "100%"}}>
        <Error show = {error !== ""} message={error} />
        <View style = {{ width : "90%", position : "absolute", right : "5%", top : "15%" }}>
        <InputText onChange={setUserName} value = {userName} size="M" title = "Felhasználónév" />
        <InputText onChange={setPassword} value = {password} size="M" title = "Jelszó" password = {true} />
        <Button title = "Bejelentkezés" onPress={e=>login()} />
        </View>
    </View>
}

export default LoginPage