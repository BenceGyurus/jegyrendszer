import defaultSettings from "./defaultSettings";
import postData from "./requests/post";
import getLocalStorage from "./storage/getStorage";

const controlToken = ():any=>{
    return new Promise((resolve, reject)=>{
        getLocalStorage("long_token").then(long_token=>{
            if (long_token){
              postData(`${defaultSettings.url}/get-access`, {token : long_token})
              .then((response:any)=>{
                if (response.access && !response.error){
                  return resolve(long_token);
                }
                else{
                  return reject(false);
                }
              })
            }
          })
    })
  }

export default controlToken