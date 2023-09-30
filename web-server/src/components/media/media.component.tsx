import "../../css/file-media.css";


type typeOfMediaParams = {
    file : string,
    alt? : string,
    autoPlay? : boolean,
    loop? : boolean,
    controls? : boolean
}

const Media = ( { file, alt, autoPlay, loop, controls }:typeOfMediaParams )=>{

    console.log(file);

    return (<div className = "file-media-holder">

        {
            file.split(".")[file.split(".").length-1] === "mov" || file.split(".")[file.split(".").length-1] === "mp4" ? <video controls = {controls} autoPlay = {autoPlay} muted={true} loop = {loop} ><source src={file} type={`video/${file.split(".")[file.split(".").length-1]}`} /></video> : <img src = {file} alt={alt} />
        }        

    </div>);
}


export default Media;