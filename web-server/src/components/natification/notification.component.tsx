import "../../css/notification.css";
type typeOfNotificationParams = {
    element : any
}

const Notification = ({element}:typeOfNotificationParams)=>{
    return (
        <div className = "notification">
            <div className = "notification-core-div">
                {element}
            </div>
        </div>
    )
}

export default Notification