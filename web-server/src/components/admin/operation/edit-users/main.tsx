import AddNewButton from "../../../buttons/add_New.component";
import { useEffect,useState } from "react";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import Loader from "../../../loader/loader.component";
import Users from "./conponents/users.component";
import NewUserWindow from "./conponents/newUserWindow.component";
import ShowToken from "./conponents/showtoken.component";
import UserEditWindow from "./conponents/user-edit-window.component";
import Notification from "../../../notification/notification.component";
import Error from "../../../notification/error.component";
import Success from "../../../notification/success.component";

type typeOfRegisteredUser = {
    username : string,
    access : Object,
    cantEdit : Boolean,
    id : string,
    status: true
}

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

    const [error, setError] = useState("");
    const [suc, setSuc] = useState("");
    const [users, setUsers] = useState(Array<typeOfUser>);
    const [openNewUser, setOpenNewUser] = useState(false);
    const [showUser, setShowUser] = useState({token : "", url : ""});
    const [selectedUserToEdit, setSelectedUserToEdit]:[typeOfUser, Function] = useState({username : "", access : {}, cantEdit : false, id : "", status : true});

    useEffect(()=>{
        updateUsers();
    }, []);

    const updateUsers = ()=>{
        postData("/users", {token : ParseLocalStorage("long_token")})
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
        postData("/delete-user", {token : ParseLocalStorage("long_token"), userId : token})
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


    const selectUser = (user:typeOfRegisteredUser)=>{
        if (!user.cantEdit){
            setSelectedUserToEdit(user);
        }
    }


    return (<div>
        <h1>Felhasználók szerkesztése</h1>
        <AddNewButton onClick={()=>{setOpenNewUser(true)}}/>
        {error ? <Notification element={<Error message={error} closeFunction={()=>{setError("")}} />} /> : ""}
        {suc ? <Notification element={<Success message={suc} closeFunction={()=>{setSuc("")}} />} /> : ""}
        {selectedUserToEdit.id ? <UserEditWindow closeFunction={()=>{setSelectedUserToEdit({username : "", access : {}, cantEdit : false, id : "", status : true})}} user={selectedUserToEdit} errorFunction={setError} updateFunction = {updateUsers} succFunction = {setSuc} /> : ""} 
        {!users.length ? <Loader /> : <Users deleteEvent={delete_User} users = {users} editEvent={selectUser}/>}
        {openNewUser ? <NewUserWindow closeFunction = { ()=>{setOpenNewUser(false)}} readyState = {showAddedUser}/> : ""}
        {showUser.token && showUser.url ? <ShowToken token = {showUser.token} url = {showUser.url} closeFunction = {()=>{setShowUser({token : "", url : ""})}} /> : ""}
    </div>);
}

export default Main;