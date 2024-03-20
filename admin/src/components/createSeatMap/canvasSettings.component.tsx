import { Button, Input } from "antd"
import ImageUpload from "../image-upload/imageUpload.component"
import typeOfCanvasSettingsParams from "./type/canvasSettingsParams"
import { ExportOutlined } from "@ant-design/icons"
import "../../css/seat-map-settings.css";

const CanvasSettings = ({setBackground, background, setError, nameOfArea, setNameOfArea}:typeOfCanvasSettingsParams)=>{
    return <div>
        <Input value={nameOfArea} onChange={e=>setNameOfArea(e.target.value)} placeholder="Helyszín neve" size="large" className = "name-of-createing-seat-map" />
        <ImageUpload errorFunction={setError} title="Háttér feltöltése" onChangeFunction={setBackground} deleteFunction={()=>setBackground("")} file={{fileName : background}} />
        <Button icon = {<ExportOutlined />}>Exportálás (PDF)</Button>
    </div>
}


export default CanvasSettings