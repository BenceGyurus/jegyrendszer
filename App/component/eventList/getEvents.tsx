import controlToken from "../../control-token";
import defaultSettings from "../../defaultSettings";
import postData from "../../requests/post";

const getEvents = ()=>{

    return new Promise(
        (resolve, reject)=>{
            controlToken().then(
                (response:any)=>{
                    console.log("token: ",response)
                    if (response){
                        console.log("ok");
                        postData(`${defaultSettings.url}/events?page=1&limit=10`, {token : response})
                        .then(
                            response=>{
                                console.log("events:", response);
                                if (!response.error){
                                    return resolve(response.events);
                                }
                                reject(response);
                            }
                        )
                    }
                    else{
                        reject(false);
                    }
                }
            )
        }
    )
}

export default getEvents;