import { useRef } from "react"
import "../../../../../css/uploadImage.css"
import UploadImage from "../../../../image-upload/imageUpload.component"
type ImageUploadParamsType = {
    onChangeEvent : Function,
    deleteImageFunction:Function,
    imageName : {isImage : boolean, name : string}
}
const ImageUpload = ( { onChangeEvent , deleteImageFunction,imageName }:ImageUploadParamsType )=>{
    const imageRef:any = useRef(null);
    return (
        <div>
            <UploadImage file={{fileName : imageName.isImage ? imageName.name : ""}} onChangeFunction={onChangeEvent} deleteFunction={deleteImageFunction} />
        </div>
    )
}

export default ImageUpload;