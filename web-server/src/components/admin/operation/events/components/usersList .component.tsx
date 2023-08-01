import User from "./user.component";

type typeOfUser = {
    username : string,
    _id : string
}


type typeOfUsersListParams = {
    userDatas : Array<typeOfUser>,
    onChangeFunction : Function,
    selectedUsers : Array<string>
}

const UsersList = ({userDatas, onChangeFunction, selectedUsers}:typeOfUsersListParams)=>{
    return (
        <div className="user-event-container">
            <h4>Felhasználók engedélyezése:</h4>
           {
            userDatas.map(user=>{
                return <User username={user.username} _id={user._id} onChangeFunction={onChangeFunction} check = {selectedUsers.includes(user._id)} />
            })
            }
        </div>
    )
}

export default UsersList;