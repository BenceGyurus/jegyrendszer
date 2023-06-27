import AccessList from "./accessList.component";
import postData from "../connection/request";
import ParseCookies from "../../cookies/parseCookies";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../../css/admin.css";
const Admin = (params:any)=>{
    const [access, setAccess] = useState(false);
    const navigate = useNavigate();
    useEffect(()=>{
        let token = ParseCookies("long_token");
        if (token){
            postData("/get-access", {token : token})
            .then((data)=>{
                data.access ? setAccess(data.access) : navigate("/admin-login");
            });
        }
        else{
            navigate('/admin-login');
        }
    }, []);

    return (
        <div className = "admin">
            <div className = "admin-menu">
            <ul className="accessListUl">
                <AccessList access = {access}/>
            </ul>
            </div>
            <div className = "container">
                {params.component}
            </div>
        </div>
    );
}

export default Admin;