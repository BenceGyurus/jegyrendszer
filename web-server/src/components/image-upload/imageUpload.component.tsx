import "../../css/imageUpload.css";
import axios from 'axios';
import ParseLocalStorage from "../../cookies/ParseLocalStorage";
import { useState } from "react";
import Loader from "../loader/loader.component";
import { Progress } from "antd";

type typeOfFile = {
    fileName : string
}

type typeOfImageUpload = {
    file : typeOfFile,
    onChangeFunction : Function,
    deleteFunction : Function,
    className? : string,
    title? : string
}

type typeOfFileType = {
    path : string
}

const ImageUpload = ({file, onChangeFunction, deleteFunction, className,title}:typeOfImageUpload)=>{

    const [image, setImage]:[typeOfFileType, Function] = useState({path : file.fileName});
    const [uploading, setUploading]:[boolean, Function] = useState(false);
    const [percent, setPercent]:[number, Function] = useState(0);
    const [errorUploading, setErrorUploading]:[boolean, Function] = useState(false);

    const uploadFile = async (event:any)=>{
        if (event.target.files[event.target.files.length-1]){
        setUploading(true);
        setPercent(0);
        const data = new FormData() ;
        data.append('file', event.target.files[event.target.files.length-1]);
        try {
            const response = await axios.post(`/api/v1/upload-image/${ParseLocalStorage("long_token")}`, data, {
              onUploadProgress: (progressEvent:any) => {
                const progress = (progressEvent.loaded / progressEvent.total) * 100;
                setPercent(progress);
              },
            });
    
            // Successful upload
            if (response.data && response.data.path){
                setTimeout(()=>{setUploading(false)}, 100)
                setImage({path : response.data.path});
                onChangeFunction(response.data.path);
            }
            setErrorUploading(false);
          } catch (error) {
            // Handle errors
            console.error("Error during upload:", error);
            setErrorUploading(true)
          }
        }
    }

    const deleteFile = (event:any)=>{
        setImage({path : ""})
        deleteFunction();
    }


    return (
        <div className={`${className ? className : ""} upload-image-div`}>
            {title ? <h3 className = "upload-image-title">{title}</h3> : ""}
            <div className={`upload-image`}>
                <input type="file" id="image-upload" name="image-upload" accept=".png,.jpeg,.img,.gif,.jifi,.jpg" onChange={e=>uploadFile(e)} />
                {!uploading ? <label htmlFor="image-upload"><i className="fas fa-cloud-upload-alt"></i> Kép feltöltése
                <div className="image-preview">{image.path ? <img src={image.path} alt="Feltöltött kép"/> : ""}</div>
                </label> : <Progress type="circle" percent={percent} status={errorUploading ? "exception" : "active"} />}
                {image.path ? <button className="delete-button" type="button" onClick={e=>deleteFile(e)}><i className="close-icon fas fa-times"></i></button> : ""}
            </div>
        </div>


    );
}

export default ImageUpload;