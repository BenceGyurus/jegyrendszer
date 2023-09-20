
import { io } from 'socket.io-client';

const SocketIo = ()=>{
    const URL:string = window.location.host;
    return io(URL)
}
export default SocketIo;