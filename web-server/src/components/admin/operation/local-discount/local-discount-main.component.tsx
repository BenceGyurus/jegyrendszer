import AddNewButton from "../../../buttons/add_New.component";
import AddNewLocalDiscountWindow from "./add-new-local-discount-window.component";
import { useState, useEffect } from "react";
import LocalDiscountList from "./local-discount-list.component";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";

type typeOfLocalDiscount = {
    name : string,
    amount : number,
    money : boolean,
    _id : string
}

const LocalDiscountMain = ()=>{

    const [addNewWindow, setAddNewWindow] = useState(false);
    const [localDiscountList, setLocalDiscountList]:[Array<typeOfLocalDiscount>, Function] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState({name : "", amount : 0, money : false, _id : ""})

    const getLocalDiscountList = ()=>{
        postData("/get-local-discounts", {token : ParseLocalStorage("long_token")})
        .then(response=>{
            if (response.datas){
                setLocalDiscountList(response.datas);
            }
        })
    }

    const editFunction = (id : string)=>{
        let d = localDiscountList.find(element=>element._id === id)
        if (d) setSelectedDiscount(d);
    }

    const deleteFunction = (id:string)=>{
        postData(`/delete-local-discount/${id}`, {token : ParseLocalStorage("long_token")})
        .then(response=>{
            getLocalDiscountList();
            
        })
    }

    useEffect(()=>{
        getLocalDiscountList();
    }, []);

    return <div>
        <h1>Helyi kedvezmények</h1>
        {addNewWindow || selectedDiscount._id ? <AddNewLocalDiscountWindow nameOfDiscount={selectedDiscount.name} amountOfDiscount={selectedDiscount.amount} _id = {selectedDiscount._id} money = {selectedDiscount.money} closeWindowFunction={()=>{setAddNewWindow(false); setSelectedDiscount({name : "", amount : 0, money : false, _id : ""})}} updateFunction={getLocalDiscountList} /> : ""}
        <div>
            <LocalDiscountList discounts={localDiscountList} editFunction={editFunction} deleteFunction={deleteFunction} />
        </div>
        <AddNewButton onClick={()=>{setAddNewWindow(true)}} />
    </div>
}

export default LocalDiscountMain;