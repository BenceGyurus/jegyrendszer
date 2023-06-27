import "../../css/textarea.css";


type typesOfTextAreaParams = {
    cols? : number,
    rows? : number,
    id? : string,
    onChangeFunction?: Function,
    value? : string,
    className? : String,
    title? : string
}


const TextArea = ({cols, rows, id, onChangeFunction, value, className, title}:typesOfTextAreaParams)=>{
    return (
        <div className = "textarea-div">
        {title ? <h3 className = "textarea-title">{title}</h3> : ""}
        <textarea className = {className ? `textarea ${className}` : "textarea"} id={id ? id : ""} cols={cols ? cols : 30} rows={rows ? rows : 10} onChange={e => onChangeFunction ? onChangeFunction(e.target.value) : ""} value={value}></textarea>
        </div>
    );
}

export default TextArea;