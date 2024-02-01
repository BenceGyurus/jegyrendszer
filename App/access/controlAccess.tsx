import AsyncStorage from '@react-native-async-storage/async-storage'
import postData from '../request/post'
const ControlAccess = ()=>{
    return new Promise(async (resolve, reject)=>{
        AsyncStorage.getItem("token")
        .then(token=>{
            console.log(token);
            if (token){
                postData("get-access", { token : token })
                .then(response=>{
                    console.log(response);
                    if (Object.keys(response).includes("access")){
                        resolve(!!response.access);
                    }
                    else{
                        reject(response.message);
                    }
                })
            }
            else {
                resolve(false);
            }
        })
    })
}

export default ControlAccess;