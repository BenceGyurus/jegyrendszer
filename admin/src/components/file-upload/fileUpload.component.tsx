import React, { useState } from "react";
import axios from "axios";
import "../../css/fileUpload.css";
import { Progress } from "antd";
import ParseLocalStorage from "../../cookies/ParseLocalStorage";

type typeOfFileUploadParams = {
    fileName : string,
    onChangeFunction : Function
}

function FileUpload( { fileName, onChangeFunction }:typeOfFileUploadParams ) {
  
  const [selectedFile, setSelectedFile]:[any, Function] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);



  const handleFileUpload = async (event:any) => {
    setFileUploading(true);
    let file = event.target.files[event.target.files.length-1];
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

        // Successful upload
        if (response.data && response.data.path){
            onChangeFunction(response.data.path);
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
    <div>
        <label htmlFor="upload-file" className = "upload-file-label">Fájl feltöltése</label>
        <input type="file" id = "upload-file" className = "file-uploader" onChange={e=>handleFileUpload(e)} />
        {
            fileName && (fileName.split(".")[fileName.split(".").length-1].toUpperCase() == "MOV" || fileName.split(".")[fileName.split(".").length-1].toUpperCase() == "MP4") ? <video controls autoPlay = {false}><source src={fileName} type={`video/${fileName.split(".")[fileName.split(".").length-1]}`} /></video> : <img src = {fileName} />
        }
        <div className = "process-holder">{ fileUploading ? <Progress percent={uploadProgress} status={uploadError ? "exception" : "active" } /> : ""}</div>
        
    </div>
  );
}

export default FileUpload;
