import MonitorComponent from "./monitorComponent.component"

type typeOfMonitor = {
    socketId : string,
    time : number,
    browser : string,
    connected : Array<unknown>,
    os : string
}

type typeOfMonitorListParams = {
    monitors : Array<typeOfMonitor>,
    delay : number,
    deleteFunction : Function
}

const MonitorList = ( { monitors, delay, deleteFunction }:typeOfMonitorListParams )=>{
    return (<div className = "container-holder">
        {

            monitors.map((monitor)=>{
                return <MonitorComponent connected={monitor.connected} browser = {monitor.browser} id = {monitor.socketId} time={monitor.time} deleteFunction={deleteFunction} os = {monitor.os} />
            })

        }
    </div>)
}

export default MonitorList;