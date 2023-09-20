import SocketIo from "../../../socket.io/socketio";

const SocketCommunication = (s:any)=>{
    if (s) s.on("disconnect", ()=>{});
    console.log("connect")
    const socket = SocketIo();
    socket.on("connection", ()=>{});
    return socket;
}

export default SocketCommunication;