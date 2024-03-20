import AddNewButton from "../../../buttons/add_New.component";
import { useEffect,useState } from "react";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import Loader from "../../../loader/loader.component";
import Users from "./conponents/users.component";
import NewUserWindow from "./conponents/newUserWindow.component";
import ShowToken from "./conponents/showtoken.component";
import Notification from "../../../notification/notification.component";
import Error from "../../../notification/error.component";
import Success from "../../../notification/success.component";
import PeddingUser from "./conponents/peddingUser.component";

type typeOfRegisteredUser = {
    username : string,
    access : Object,
    cantEdit : Boolean,
    id : string,
    status: true,
    pedding? : boolean,
    external : boolean
}

type typeOfPeddingUser = {
    id : string,
    addedBy : string,
    validTo : number,
    created : number,
    status: false,
    access : Object,
    url : string,
    token : string,
    external : boolean
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
    const [selectedUserToEdit, setSelectedUserToEdit]:[typeOfRegisteredUser, Function] = useState({username : "", access : {}, cantEdit : false, id : "", status : true, external : false});

    useEffect(()=>{
        updateUsers();
    }, []);

    const updateUsers = ()=>{
        postData("/users", {token : ParseLocalStorage("long_token")})
        .then((data)=>{
            if (!data.error){
                setUsers(data.users);
            }
            else{
                setError(data.message ? data.message : "Hiba történt a felhasználó lekérdezése közben.");
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
                setError(d.message ? d.message : "Hiba történt a törlés közben");
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

    const deletePeddingUser = (id:string)=>{
        if (id){
            postData(`/delete-pedding-user/${id}`, {token : ParseLocalStorage("long_token")})
            .then(response=>{
                response.error ? response.message ? setError(response.message) : setError("A törlés sikertelen") : setSuc("A törlés sikeres");
            })
        }else{
            setError("Hiba történt a törlés közben")
        }
        updateUsers();
    }

    const selectPeddingUser = (user:typeOfPeddingUser)=>{
        if (user.id){
            setSelectedUserToEdit({username : "Pedding felhasználó", access : user.access, cantEdit : false, id : user.id, status : false, pedding : true})
        }else{
            setError("Hiba történt a felhasználó kijelölése közben");
        }
    }

    const getAccesses = ()=>{
        let e:any = {};
        if (selectedUserToEdit.id){
            Object.keys(selectedUserToEdit.access).forEach(item=>{
                e[item] = true;
            }); 
        }
        return e;
    }



    return (<div>
        <h1>Felhasználók szerkesztése</h1>
        <Error message={error} setOpen={()=>{setError("")}} open = {error != ""} />
        {suc ? <Notification element={<Success message={suc} closeFunction={()=>{setSuc("")}} />} /> : ""}
        {!users.length ? <Loader /> : <Users addNewFunction={()=>{setOpenNewUser(true)}} deleteEvent={delete_User} users = {users} editEvent={selectUser} peddingDelete = {deletePeddingUser} peddingEdit = {selectPeddingUser}/>}
        {openNewUser || selectedUserToEdit.id ? <NewUserWindow closeFunction = { ()=>{setOpenNewUser(false); setSelectedUserToEdit({username : "", access : {}, cantEdit : false, id : "", status : true})}} accesses = {getAccesses()} external = {selectedUserToEdit.external} readyState = {showAddedUser} pending = {selectedUserToEdit.pedding} userId={selectedUserToEdit.id} updateFunction={updateUsers} setError={setError} /> : ""}
        {(showUser.token && showUser.url)   ? <ShowToken token = {showUser.token} url = {showUser.url} closeFunction = {()=>{setShowUser({token : "", url : ""})}} /> : ""}
    </div>);
}

export default Main;