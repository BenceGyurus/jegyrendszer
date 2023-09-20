import { QRCode } from "antd"

type typeOfQRParams = {
    url : string,
    icon : string
}

const QR = ({url, icon}:typeOfQRParams)=>{
    return (<QRCode
    errorLevel="H"
    value={url}
    icon={icon}
    size={150}
    iconSize={25}
    style={{zIndex : 101, border : "none"}}
  />)

}

export default QR;