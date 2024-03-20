import { QRCode } from "antd"

type typeOfQRParams = {
    url : string,
    icon? : string,
    color? : string,
    size? : number
}

const QR = ({url, icon, color, size}:typeOfQRParams)=>{
    return (<QRCode
    errorLevel="H"
    value={url}
    icon={icon}
    size={size ? size : 90}
    iconSize={size ? size*0.3 : 15}
    style={{zIndex : 101, border : "none", margin: 5}}
    color={color ? color : "white"}
  />)

}

export default QR;