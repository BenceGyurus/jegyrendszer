import AccessList from "./accessList.component";
import postData from "../connection/request";
import ParseLocalStorage from "../../cookies/ParseLocalStorage";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../../css/admin.css";
import AdminUserComponent from "./user.component";
import AccessSkeletons from "./accessSkeletons.component";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { link } from "fs";

const { Header, Content, Footer, Sider } = Layout;
const Admin = (params:any)=>{
    const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
    const [access, setAccess]:[any, Function] = useState(false);
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


    const findInAccess = ()=>{

        return Object.keys(access).map((key:string)=>{
            console.log(access[key], window.location.pathname);
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

      const accessList:any = (params:any)=>{

        let items:any = [
            Object.keys(params.access).map((i, index)=>{
                console.log(params.access[i]);
                return getItem(params.access[i][0], (index+1).toString(), <i className={`${params.access[i][2]} admin-accesses-icons`}></i>)
            })
          ];
        return items;
        /*if (params.access){
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
        }*/
    }



    const getAccess:any = ()=>{
        return Object.keys(access).map(
            (e, index)=> {return {label : <a href={`/${access[e][1]}`}>{access[e][0]}</a>, key : (index+100).toString(), icon : (<i className={`${access[e][2]}`}></i>)}}
        );
    }

    if (access) console.log(getAccess());

    return (

        <div className = "admin">
        <Layout>
        <Content style={{ padding: '0 40px'}}>
            <AdminUserComponent />
        <Breadcrumb style={{ margin: '20px 0' }}>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            {access ? <Breadcrumb.Item>{findInAccess()}</Breadcrumb.Item> : ""}
        </Breadcrumb>
        <Layout style={{ background: colorBgContainer, borderRadius : 10 }}>
          <Sider style={{ background: colorBgContainer }} width={200}>
            <Menu
            theme="dark"
              mode="inline"
              style={{ height: '75vh', overflow : "auto", paddingTop: 10, borderTopLeftRadius : 10, borderBottomLeftRadius : 10 }}
              items={getAccess()}
              disabledOverflow = {false}
            />
          </Sider>
          <Content style={{ padding: '10px 30px', minHeight: "75vh", maxHeight : "75vh", overflow : "auto", position: "relative" }}>
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