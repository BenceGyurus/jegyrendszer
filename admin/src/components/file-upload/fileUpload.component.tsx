import React, { useState } from "react";
import axios from "axios";
import "../../css/fileUpload.css";
import { Progress } from "antd";
import ParseLocalStorage from "../../cookies/ParseLocalStorage";

type typeOfFileUploadParams = {
    fileName : string,
    onChangeFunction : Function,
    deleteFileFunction : Function
}

function FileUpload( { fileName, onChangeFunction, deleteFileFunction }:typeOfFileUploadParams ) {
  
  const [selectedFile, setSelectedFile]:[any, Function] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);



  const handleFileUpload = async (event:any) => {
    setFileUploading(true);
    let file = event.target.files[event.target.files.length-1];
    console.log(file);
    if (file) {
        setSelectedFile(file);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post(`/api/v1/upload-image/${ParseLocalStorage("long_token")}`, formData, {
          onUploadProgress: (progressEvent:any) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setUploadProgress(progress);
          },
        });
        if (response.data && response.data.path){
            onChangeFunction(response.data.path);
            setFileUploading(false);
        }
        setUploadError(false);
      } catch (error) {
        // Handle errors
        console.error("Error during upload:", error);
        setUploadError(true)
      }
    }
  };


  return (
    <div className = "file-upload-div">
        <div className = "file-uploading-actions-buttons">
          <label htmlFor="upload-file" className = "upload-file-label">{selectedFile ? "Új fájl feltöltése" : "Fájl feltöltése"}</label>
          <span className = "file-uploading-delete-button" onClick = {()=>{setSelectedFile(""); deleteFileFunction()}}><i className="fas fa-trash"></i></span>
        </div>
        <input type="file" id = "upload-file" className = "file-uploader" onChange={e=>handleFileUpload(e)} />
        {
            fileName && (fileName.split(".")[fileName.split(".").length-1].toUpperCase() == "MOV" || fileName.split(".")[fileName.split(".").length-1].toUpperCase() == "MP4") ? <video className = "file-upload-image" controls autoPlay = {false}><source src={fileName} type={`video/${fileName.split(".")[fileName.split(".").length-1]}`} /></video> : fileName ? <img className = "file-upload-image" src = {fileName} /> : <label htmlFor="upload-file" className = "file-upload-backgound"><i className="fas fa-file-upload"></i></label>
        }
        <div className = "process-holder">{ fileUploading ? <Progress percent={uploadProgress} status={uploadError ? "exception" : "active" } /> : ""}</div>
        
    </div>
  );
}

export default FileUpload;
