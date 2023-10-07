import { Button, View, useColorScheme } from "react-native"
import InputText from "../inputs/text-input/text-input.component"
import { useState } from "react"
import { Colors } from "react-native/Libraries/NewAppScreen";
import store from 'react-native-simple-store';

const LoginPage = ()=>{

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const login = ()=>{
        console.log("login");
    }

    return <View style = {{ backgroundColor :  useColorScheme()=== "dark" ? Colors.darker : Colors.lighter, width : "100%", height : "100%"}}>
        <View style = {{ width : "90%", position : "absolute", right : "5%", top : "15%" }}>
        <InputText onChange={setUserName} value = {userName} size="M" title = "Felhasználónév" />
        <InputText onChange={setPassword} value = {password} size="M" title = "Jelszó" password = {true} />
        <Button title = "Bejelentkezés" onPress={e=>login()} />
        </View>
    </View>
}

export default LoginPage