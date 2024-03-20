import "../../../../../css/userListEvent.css";

type typeOfUserParams = {
    username : string,
    _id : string,
    onChangeFunction : Function,
    check? : boolean
}

const User = ({username, _id, onChangeFunction, check}:typeOfUserParams)=>{
    return (
        <div className={`user-event${check ? ` selected-user` : ""}`} onClick={e=>onChangeFunction(_id, !check)}>
            {username}
        </div>
    )
}

export default User;