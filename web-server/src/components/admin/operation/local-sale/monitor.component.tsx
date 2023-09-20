import { CheckOutlined, DesktopOutlined, LinkOutlined } from "@ant-design/icons";
import "../../../../css/connectToMonitor.css";
import { Button } from "antd";

type typeOfMonitor = {
    name : string,
    id : string,
    onClickFunction : Function,
    loading : boolean,
    connected : boolean,
    disabled : boolean
}

const Monitor = ({name, id, onClickFunction, loading, connected, disabled}:typeOfMonitor)=>{
    return <div className = "monitor-connection-holder"><div className = "name-of-monitor-holder"><span className = "monitor-icon"><DesktopOutlined /></span><span>{id}</span></div><Button icon = { connected ? <CheckOutlined /> : <LinkOutlined />} loading = {loading} onClick={e=>onClickFunction(id)} disabled = {connected || disabled}>{connected ? "Csatlakozva" : "Csatlakozás"}</Button></div>;
}

export default Monitor;