import "../../css/accessList.css";
const AccessList = (params:any):any=>{
    if (params.access){
        return (
        Object.keys(params.access).map((key:string)=>{
            return (
                <li key={Math.ceil(Math.random()*1000)} className = {`${window.location.pathname == `/${params.access[key][1]}` ? "admin-menu-active" : "menu-item"}`}><a className="accessListLink" href={`/${params.access[key][1]}`}>{params.access[key][0]}</a></li>
            )
        })
        );
    }
}

export default AccessList;