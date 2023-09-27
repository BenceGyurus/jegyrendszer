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
    size={90}
    iconSize={15}
    style={{zIndex : 101, border : "none", margin: 5}}
    color="white"
  />)

}

export default QR;