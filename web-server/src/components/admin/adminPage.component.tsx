import AccessList from "./accessList.component";
import postData from "../connection/request";
import ParseLocalStorage from "../../cookies/ParseLocalStorage";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../../css/admin.css";
import AdminUserComponent from "./user.component";
import AccessSkeletons from "./accessSkeletons.component";
const Admin = (params:any)=>{
    const [access, setAccess] = useState(false);
    const navigate = useNavigate();
    useEffect(()=>{
        let token = ParseLocalStorage("long_token");
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
            <div className="admin-menu">
            <ul className = "accessListUl">
                <AdminUserComponent />
                {access ? <AccessList access = {access}/> : <AccessSkeletons />}
            </ul>
            </div>
            <div className = "container">
                {params.component}
            </div>
        </div>
    );
}


/*

  <ul>
    <li><a href="#" class="active">Dashboard</a></li>
    <li><a href="#">Users</a></li>
    <li><a href="#">Posts</a></li>
    <li><a href="#">Settings</a></li>
  </ul>
</nav>*/

export default Admin;