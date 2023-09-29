import AddNewButton from "../../../buttons/add_New.component";
import { useEffect, useState } from "react";
import { Button, Empty, Spin } from "antd";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import AdsWindow from "./adWindow.component";
import AdsList from "./adsList.component";
import Error from "../../../notification/error.component";

const Ads = ()=>{

    const [addNewWindow, setAddNewWindow] = useState(false);
    const [ads, setAds]:[any, Function] = useState();
    const [res, setRes] = useState(false);
    const [error, setError] = useState("");
    const [editDatas, setEditDatas]:[any, Function] = useState();

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
        postData(`/delete-ads/${id}`, { token : ParseLocalStorage("long_token") })
        .then(response=>{
            if (response.error){
                setError(response.message ? response.message : "Hiba történt a törlés során.");
            }
            getAds();
        }); 
    }


    return ( <Spin spinning = {!res}> <div>
        { error ? <Error message={error} open = {error !== ""} setOpen={setError} title = "Hiba történt" /> : ""}
        <h1>Hirdetések</h1>
        { addNewWindow || (editDatas && editDatas._id) ? <AdsWindow closeFunction={()=>{setAddNewWindow(false); setEditDatas(false)}} nameE = {editDatas ? editDatas.name : ""} websiteE={editDatas ? editDatas.website : ""} _id = {editDatas ? editDatas._id : ""} fileE={editDatas ? editDatas.src : ""}  updateFunction={getAds} setError={setError} /> : ""}
        {ads && ads.length ? <AdsList editFunction = {editAdsFunction} deleteFunction={deleteAdsFunction} ads={ads} />  : ads && res ? <Empty /> : <></>}
        <div>
            <AddNewButton onClick={()=>setAddNewWindow(true)} />
        </div>
    </div></Spin>);
}

export default Ads;