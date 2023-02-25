import { useRef } from "react"
import "../../../../../css/uploadImage.css"
type ImageUploadParamsType = {
    onChangeEvent : Function,
    deleteImageFunction:Function,
    imageName : {isImage : boolean, name : string}
}
const ImageUpload = ( { onChangeEvent , deleteImageFunction,imageName }:ImageUploadParamsType )=>{
    const imageRef:any = useRef(null);
    return (
        <form action="/upload" method="POST" encType="multipart/form-data">
            <label htmlFor="fileUploader" className = "uploadFileLabel" >Kép feltölése</label>
            <input type="file" name="image" className = "uploadFileInput" id = "fileUploader" onChange={event => onChangeEvent(event)} ref = {imageRef} />
            {imageName.isImage ? <img src={imageName.name}  alt="Feltöltött kép" className = "uploadedImage"/> : <label>Nincs feltöltve kép</label>}
            <input type="button" value="Kép törlése" className = "button" onClick = {event => {deleteImageFunction(); imageRef.current.value = ""}} />
        </form>
    )
}

export default ImageUpload;