import AddNewButton from "../../../buttons/add_New.component";
import { useEffect,useState } from "react";
import postData from "../../../connection/request";
import ParseCookies from "../../../../cookies/parseCookies";
import Loader from "../../../loader/loader.component";
import Users from "./conponents/users.component";
import NewUserWindow from "./conponents/newUserWindow.component";
import ShowToken from "./conponents/showtoken.component";

type typeOfUser = {
    username : string,
    access : Object,
    cantEdit : Boolean,
    id : string,
    status: true
}| {
    id : string,
    addedBy : string,
    validTo : number,
    created : number,
    status: false,
    access : Object,
    url : string,
    token : string
}

const Main = ()=>{

    const [users, setUsers] = useState(Array<typeOfUser>);
    const [openNewUser, setOpenNewUser] = useState(false);
    const [showUser, setShowUser] = useState({token : "", url : ""})

    useEffect(()=>{
        updateUsers();
    }, []);

    const updateUsers = ()=>{
        postData("/users", {token : ParseCookies("long_token")})
        .then((data)=>{
            if (!data.error){
                setUsers(data.users);
            }
        })
    }

    const showAddedUser = (token:string, url:string)=>{
        setOpenNewUser(false);
        setShowUser({token : token, url : url});
        updateUsers();
    }

    const delete_User = (token:string)=>{
        postData("/delete-user", {token : ParseCookies("long_token"), userId : token})
        .then( async (data)=>{
            let d = data;
            if (data.responseData){
                d = await data.responseData;
            }
            if (d && d.error){
                
            }
            else if (d && !d.error){
                updateUsers();
            }
        });
    }

    return (<div>
        <h1>Felhasználók szerkesztése</h1>
        <AddNewButton onClick={()=>{setOpenNewUser(true)}}/>
        {!users.length ? <Loader /> : <Users deleteEvent={delete_User} users = {users}/>}
        {openNewUser ? <NewUserWindow closeFunction = { ()=>{setOpenNewUser(false)}} readyState = {showAddedUser}/> : ""}
        {showUser.token && showUser.url ? <ShowToken token = {showUser.token} url = {showUser.url} closeFunction = {()=>{setShowUser({token : "", url : ""})}} /> : ""}
    </div>);
}

export default Main;