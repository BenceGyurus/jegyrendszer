import "../../css/phoneError.css";
import typeOfPhoneNotificationParams from "./types/phoneNotificationParams";

const PhoneNotification = ({message, open, type}:typeOfPhoneNotificationParams)=>{
    return open ? (<div className = {`phone-notification-box ${type}-notification`}>
        <p>{message}</p>
    </div>) : <></>
}

export default PhoneNotification;