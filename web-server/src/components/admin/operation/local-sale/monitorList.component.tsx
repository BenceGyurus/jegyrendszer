import Monitor from "./monitor.component"

type typeOfMonitor = {
    name : string,
    socketId : string
}

type typeOfMonitorListParams = {
    monitors : Array<typeOfMonitor>,
    onClickFunction : Function,
    loading : boolean,
    connectedMonitor : string,
    disabledButtons: boolean
}

const MonitorList = ({monitors, onClickFunction, loading, connectedMonitor, disabledButtons}:typeOfMonitorListParams)=>{
    return <div>
        {
            monitors.map(monitor=>{
                return <Monitor disabled = {disabledButtons} connected = {connectedMonitor === monitor.socketId} loading = {loading} name = {monitor.socketId} id = {monitor.socketId} onClickFunction={onClickFunction} />
            })
        }
    </div>
}

export default MonitorList;