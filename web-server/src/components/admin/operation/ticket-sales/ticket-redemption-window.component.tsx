import QR from "../../../qrCode/qrCode.component";
import Window from "../../../window/window.component";
import typeOfTicketRedemptionWindowParams from "./types/ticketRedemptionWindowParams";
import "../../../../css/ticketRedemption.css";
import { useEffect, useState } from "react";
import postDataJson from "../../../connection/postDataJson";
import { Skeleton } from "@mui/material";
import SocketCommunication from "../local-sale/socketCommunication";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";


const TicketRedemptionWindow = ({opened, closeFunction, socket}:typeOfTicketRedemptionWindowParams)=>{

    const [code, setCode] = useState<string>("");
    const [socketIO, setSocketIO] = useState<any>(socket);

    useEffect(()=>{
        let id = window.location.pathname.split("/")[3]
        setSocketIO(SocketCommunication(socketIO));
    }, []);

    useEffect(()=>{
        if (socketIO){
            socketIO.on("qr-code-connection-status", (payload:any)=>{
                console.log(payload);
            })
        }
    }, [])

    const getCode = ()=>{
        if (socketIO){
            socketIO.emit("get-qr-code", {token : ParseLocalStorage("long_token")})
            socketIO.on("code", (payload:any)=>{
                console.log(payload);
                if (payload.code && !payload.error){
                    setCode(payload.code);
                }
            });
        }
    };

    useEffect(()=>{
        if (opened){
            getCode();
        }
    });

    return opened ? (
        <Window title = "Jegy visszaváltás" closeFunction={()=>closeFunction()}>
            <div className = "qr-code-div">
                { code ? <QR color = "black" url = "asdasdasdasda" size={250} /> : <Skeleton width={200} height={250} animation = "wave" />}
            </div>
        </Window>
    ) : <></>
}

export default TicketRedemptionWindow;