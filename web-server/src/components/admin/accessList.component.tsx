import "../../css/accessList.css";
const AccessList = (params:any)=>{
    if (params.access){
        return [
        Object.keys(params.access).map((key:string)=>{
            return (
               {label : params.access[key][0], key : Math.ceil(Math.random()*1000), icon : (<i className={`${params.access[key][2]} admin-accesses-icons`}></i>)} 
            )
        })
        ];
    }
    else{
        return [];
    }
}

//<li key={Math.ceil(Math.random()*1000)} className = {`${window.location.pathname == `/${params.access[key][1]}` ? "admin-menu-active" : "menu-item"}`}>{params.access[key][2] ? <i className={`${params.access[key][2]} admin-accesses-icons`}></i> : ""}<a className="accessListLink" href={`/${params.access[key][1]}`}>{params.access[key][0]}</a></li>

export default AccessList;

//params.access[key][2] ? params.access[key][2] : ""