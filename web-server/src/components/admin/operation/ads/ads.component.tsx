

import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AddNewButton from "../../../buttons/add_New.component";
import { useEffect, useState } from "react";
import { Button, Empty, Spin } from "antd";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import AdsWindow from "./adWindow.component";
import Error from "../../../notification/error.component";
import Media from '../../../media/media.component';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import "../../../../css/ads-table.css";

interface DataType {
  key: React.Key;
  name: string;
  type: number;
  url: string;
  file: string;
  action : string
}


const Ads = ()=>{

    const [addNewWindow, setAddNewWindow] = useState(false);
    const [ads, setAds]:[any, Function] = useState();
    const [res, setRes] = useState(false);
    const [error, setError] = useState("");
    const [editDatas, setEditDatas]:[any, Function] = useState();

    const columns: ColumnsType<DataType> = [
        { title: 'ID', dataIndex: 'name', key: 'name' },
        { title: 'Típus', dataIndex: 'type', key: 'type' },
        { title: 'URL', dataIndex: 'url', key: 'url'},
        {
          title: 'Műveletek',
          dataIndex: 'action',
          key: 'x',
        },
      ];

    const getAds = ()=>{
        setRes(false);
        postData("/ads", {token : ParseLocalStorage("long_token")})
        .then(response=>{
            if (response && response.ads){
                setAds(response.ads);
            }
            setRes(true);
        })
    }

    useEffect(()=>{
        getAds();
    }, []);

    const editAdsFunction = (id:string)=>{
        setEditDatas(ads.find((item:any)=>item._id === id));
    }

    const deleteAdsFunction = (id:string)=>{
        console.log(id);
        postData(`/delete-ads/${id}`, { token : ParseLocalStorage("long_token") })
        .then(response=>{
            if (response.error){
                setError(response.message ? response.message : "Hiba történt a törlés során.");
            }
            getAds();
        }); 
    }

    const getColumns = ()=>{
        if (ads && ads.length){
            return ads.map((item:any, index:number) =>{
                return { name : item.name, type : item.type, file : item.src, url : <a href = {item.website}>{item.website}</a>, key : index.toString(), action : <span className = "action-button"><EditFilled onClick={e=>editAdsFunction(item._id)} /><DeleteFilled onClick={e=>deleteAdsFunction(item._id)} /> </span> }
            })
        }
    }


    const header = ()=>{
        return <div className = "ads-table-header">
            <div>
                <h2>Létrehozott hirdetések</h2>
                <span>{ads ? `${ads.length}db hirdetés` : ""}</span>
            </div>
            <Button onClick={e=>setAddNewWindow(true)}>+ Hozzáadás</Button>
        </div>
    }

    return ( <Spin spinning = {!res}> <div>
        { error ? <Error message={error} open = {error !== ""} setOpen={setError} title = "Hiba történt" /> : ""}
        <h1>Hirdetések</h1>
        { addNewWindow || (editDatas && editDatas._id) ? <AdsWindow closeFunction={()=>{setAddNewWindow(false); setEditDatas(false)}} nameE = {editDatas ? editDatas.name : ""} websiteE={editDatas ? editDatas.website : ""} _id = {editDatas ? editDatas._id : ""} fileE={editDatas ? editDatas.src : ""}  updateFunction={getAds} setError={setError} /> : ""}
        <Table
        className = "ads-table"
        bordered = {true}
        title={()=>header()}
        columns={columns}
        expandable={{
            expandedRowRender: (record) => <Media file = {record.file} autoPlay = {true} alt = "file" />,
            rowExpandable: (record) => record.name !== 'Not Expandable',
        }}
        dataSource={getColumns()}
        />
    </div></Spin>);
}

export default Ads;