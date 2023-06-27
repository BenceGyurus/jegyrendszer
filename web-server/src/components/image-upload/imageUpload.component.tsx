import "../../css/imageUpload.css";
import axios from 'axios';
import ParseCookies from "../../cookies/parseCookies";
import { useState } from "react";
import Loader from "../loader/loader.component";

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

    const uploadFile = (event:any)=>{
        if (event.target.files[event.target.files.length-1]){
        setUploading(true);
        const data = new FormData() ;
        data.append('file', event.target.files[event.target.files.length-1]);
        axios.post(`/upload-image/${ParseCookies("long_token")}`, data)
        .then(res => { // then print response status
            if (res.data.path){
                onChangeFunction(res.data.path);
                setImage({path : res.data.path});
                setUploading(false);
            }
        });
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
                </label> : <Loader />}
                {image.path ? <button className="delete-button" type="button" onClick={e=>deleteFile(e)}><i className="close-icon fas fa-times"></i></button> : ""}
            </div>
        </div>


    );
}

export default ImageUpload;