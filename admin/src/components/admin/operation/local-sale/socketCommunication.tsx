import SocketIo from "../../../socket.io/socketio";

const SocketCommunication = (s:any)=>{
    if (s) s.on("disconnect", ()=>{});
    const socket = SocketIo();
    socket.on("connection", ()=>{});
    return socket;
}

export default SocketCommunication;