
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import "../../../../css/monitorComponent.css";

type typeOfMonitorComponent = {
    id : string,
    time : number,
    deleteFunction : Function,
    connected : Array<unknown>,
    browser : string,
    os : string
}

const getBrowserImage = (browser:string)=>{
    switch(browser) {
        case "Safari":
            return "/images/safari.svg";
        case "Chrome":
            return "/images/chrome.svg";
        case "Firefox":
            return "/images/firefox.svg"
        default:
            return "";
      }   
}

const getOsImage = (os:string)=>{
    if (os.toUpperCase().includes("MAC")) return "/images/apple.svg";
    else if (os.toUpperCase().includes("WINDOWS")) return "/images/windows.svg";
    else if (os.toUpperCase().includes("IPHONE") || os.toUpperCase().includes("IPAD") || os.toUpperCase().includes("IPOD")) return "/images/apple.svg";
    else if (os.toUpperCase().includes("LINUX")) return "/images/linux.svg";
    else if (os.toUpperCase().includes("ANDROID")) return "/images/android.svg"
    else return "";
}

const convertDate = (d:Date)=>{
  //const d = new Date(date);
  return `${d.getFullYear()} ${d.getMonth() >= 10 ? d.getMonth() : `0${d.getMonth()}`}. ${d.getDate()+1 >= 10 ? d.getDate()+1 : `0${d.getDate()+1}`}. ${d.getHours() >= 10 ? d.getHours() : `0${d.getMinutes()}`}:${d.getMinutes() >= 10 ? d.getMinutes() : `0${d.getMinutes()}`}`
}

const MonitorComponent = ( { id, time, deleteFunction, connected, browser, os }:typeOfMonitorComponent )=>{
    return (<div className = "monitor-container">
        <h3>{id}</h3>
        <h4>Csatlakozás ideje: {convertDate(new Date(time))}</h4>
        <h4>Böngésző: {browser}</h4>
        <h4>Operációs rendszer: {os}</h4>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <img style = {{width : 25}} alt="browser" src={getBrowserImage(browser)} />
        }
      >
        <img alt="os" style = {{height : 75}} src={getOsImage(os)} />
      </Badge>
    </div>)
}

export default MonitorComponent;