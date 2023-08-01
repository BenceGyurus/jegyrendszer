import "../../../../../css/userListEvent.css";

type typeOfUserParams = {
    username : string,
    _id : string,
    onChangeFunction : Function,
    check? : boolean
}

const User = ({username, _id, onChangeFunction, check}:typeOfUserParams)=>{
    return (
        <div className="user-event">
            <input type="checkbox" id="user1" onChange={e=>{onChangeFunction(_id, e.target.checked)}} defaultChecked = {check} />
            <label htmlFor="user1">{username}</label>
        </div>
    )
}

export default User;