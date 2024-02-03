import AddNewButton from "../../../buttons/add_New.component";
import { useState, useEffect } from "react";
import AddNewRefCode from "./newRefCode.component";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import RefCodeList from "./refCodeList.component";
import { Segmented } from "antd";
import { AppstoreAddOutlined, AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import postDataJson from "../../../connection/postDataJson";
import ListStyleRefCodeList from "./listStyleRefCodeList.component";

type typeOfCoupon = {
    _id : string,
    name : string,
    amount : number,
    money : boolean,
    usedEvent : Array<string>,
    usedTicket : number,
    validity : string,
    events : Array<string>,
    type : number
}


const ReferalMain = ()=>{

    const [opened, setOpened] = useState(false);
    const [coupons, setCoupons] = useState(Array<typeOfCoupon>);
    const [editCoupont, setEditCoupon]:[typeOfCoupon, Function] = useState({_id : "", name : "", amount : 0, money : false, usedEvent : [], usedTicket : 0, validity : "", events : [], type : 0});
    const [ran, setRan]:[boolean, Function] = useState(false);
    const [typeOfLists, setTypeOfLists]:[boolean, Function] = useState(false);


    const editFunction = (id:string)=>{
        for (let i = 0; i < coupons.length; i++){
            if (coupons[i]._id == id){
                setEditCoupon(coupons[i]);
            }
        }
    }

    const deleteFunction = (id:string)=>{
        postDataJson(`/delete-coupon/${id}`, {token : ParseLocalStorage("long_token")})
        .then(response=>{
            if (!response.error){
                getCoupons();
            }
        });
    }


    const getCoupons = ()=>{
        postDataJson("/get-coupons", {token : ParseLocalStorage("long_token")})
        .then(response=>{
            if (response.coupons){
                setCoupons(response.coupons);
            }
        })
    }

    useEffect(()=>{
        getCoupons();
    },[]);


    console.log(typeOfLists);

    return (
        <div className = "referal">
            <h1>Kuponok</h1>
            <div><Segmented defaultValue={typeOfLists ? 'kanban' : "list"} onChange={e=>setTypeOfLists(e !== "list")} options={[{value: 'list',icon: <BarsOutlined />,},{value: 'kanban',icon: <AppstoreOutlined />,}]}
    /></div>
            {opened || editCoupont._id ? <AddNewRefCode gotEvents={editCoupont.events} name = {editCoupont.name} tofDiscound = {editCoupont.money} amount = {editCoupont.amount} tOfCoupon={editCoupont.type} valid={editCoupont.validity} closeFunction={()=>{setOpened(false); setEditCoupon({_id : "", name : "", amount : 0, money : false, usedEvent : [], usedTicket : 0, validity : "", events : [], type : 0})}} refresh = {getCoupons} gotId={editCoupont._id} /> : ""}
            <AddNewButton onClick={()=>{setOpened(true)}} />
            {coupons ? typeOfLists ? <RefCodeList coupons = {coupons} editFunction = {editFunction} deleteFunction = {deleteFunction} /> : <ListStyleRefCodeList coupons={coupons} deleteFunction={deleteFunction} editFunction={editFunction} /> : ""}
        </div>
    );
}

export default ReferalMain;