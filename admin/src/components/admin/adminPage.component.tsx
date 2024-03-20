import AccessList from "./accessList.component";
import postData from "../connection/request";
import ParseLocalStorage from "../../cookies/ParseLocalStorage";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../../css/admin.css";
import AdminUserComponent from "./user.component";
import AccessSkeletons from "./accessSkeletons.component";
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const Admin = (params:any)=>{

  const {
    token: { colorBgContainer },
  } = theme.useToken();
    const [access, setAccess]:[any, Function] = useState(false);
    const [collapsed, setCollapsed] = useState(true);
    const navigate = useNavigate();
    useEffect(()=>{
        let token = ParseLocalStorage("long_token");
        if (token){
            postData("/get-access", {token : token})
            .then((data)=>{
                data.access ? setAccess(data.access) : navigate(`/admin-login?callbackUrl=${window.location.pathname}`);
            });
        }
        else{
            navigate(`/admin-login?callbackUrl=${window.location.pathname}`);
        }
    }, []);


    const findInAccess = ()=>{

        return Object.keys(access).map((key:string)=>{
            if (access && access[key] && `/${access[key][1]}` === window.location.pathname){
                return access[key][0];
            }
        })
    }

    type MenuItem = Required<MenuProps>['items'][number];

    function getItem(
        label: React.ReactNode,
        key: React.Key,
        icon?: React.ReactNode,
      ): MenuItem {
        return {
          key,
          icon,
          label,
        };
      }

    const createItems = ():any=>{
      return Object.keys(access).map(
        (e, index)=> {return getItem(<a href={`/${access[e][1]}`}>{access[e][0]}</a>, index.toString(), (<i className={`${access[e][2]}`}></i>))});
    }

    return (

        <div className = "admin">
          <div className = "background-style">
          </div>
        <Layout className = "admin-page">
        <Content>
        <Layout style={{ background: colorBgContainer, borderRadius : 10, zIndex: 2 }}>
          <Sider theme="light" collapsed = {collapsed} onCollapse={e=>setCollapsed(!collapsed)} collapsible={true} style={{ background: colorBgContainer }} width={collapsed ? 50 : 250}>
          {access ? <Menu
          expandIcon = {<i className="fas fa-bars"></i>}
          inlineCollapsed = {true}
          style={{ minHeight : "calc( 100vh - 80px )", maxHeight : "calc( 100vh - 80px )", overflow : "auto" }}
          mode="inline"
          items={createItems()}
          /> : <AccessSkeletons />}
          </Sider>
            <Content style={{minHeight: "calc( 100vh - 80px )", maxHeight : "calc( 100vh - 80px )", position: "relative", overflow : "auto", padding : "10px" }}>
            <AdminUserComponent />
            <Breadcrumb style={{ margin: '20px 0'}} className = "bread-crumb-admin">
            <Breadcrumb.Item className = "bread-crumb-admin">Admin</Breadcrumb.Item>
            {access ? <Breadcrumb.Item className = "bread-crumb-admin">{findInAccess()}</Breadcrumb.Item> : ""}
            </Breadcrumb>
            {params.component}
          </Content>
        </Layout>
      </Content>
    </Layout>
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