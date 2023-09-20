import Chip from '@mui/material/Chip';
import "../../css/monitorConnectionStatus.css";

type typeOfConnectionStatus = {
    connected : boolean,
    connecting : boolean
}

const ConnectionStatus = ( { connected, connecting }:typeOfConnectionStatus )=>{

    return <div className = "monitor-status-div">
        {
           connected ? ""
            :
            connecting ? <Chip label="Csatlakozás..." color="primary" variant="outlined"/> :
            <Chip label="Nincs csatlakozva" color="error" variant="outlined" />
        }
    </div>

}
export default ConnectionStatus;