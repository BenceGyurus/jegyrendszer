import AddNewButton from "../../../buttons/add_New.component";
import AddCompany from "./addCompany.component";
import { useState, useEffect } from "react";
import Error from "../../../notification/error.component";
import Notification from "../../../notification/notification.component";
import postData from "../../../connection/request";
import ParseLocalStorage from "../../../../cookies/ParseLocalStorage";
import CompaniesList from "./companiesList.component";
import Loader from "../../../loader/loader.component";

type typeOfCompany = {
    name : string,
    tax : string,
    _id : string
}

const CompaniesMain = ()=>{

    const [addNew, setAddNew] = useState(false);
    const [error, setError] = useState("");
    const [companies, setCompanies]:[Array<typeOfCompany>, Function] = useState([]);
    const [editCompany, setEditCompany]:[typeOfCompany, Function] = useState({name : "", tax : "", _id : ""});


    const getCompanies = ()=>{
        postData("/get-companies", {token : ParseLocalStorage("long_token")})
        .then((response)=>{
            setCompanies(response.datas);
        })
    }

    useEffect(()=>{
        getCompanies();
    },[]);


    const deleteCompanyFunction = (id:string)=>{
        postData(`/delete-company/${id}`, {token : ParseLocalStorage("long_token")})
        .then((response)=>{
            console.log(response);
            getCompanies();
        });
    }

    const editFunction = (id:string)=>{
        for (let i = 0; i < companies.length; i++){
            if (companies[i]._id == id){
                setEditCompany({name : companies[i].name, tax : companies[i].tax, _id : companies[i]._id});
            }
        }
    }

    return (
        <div>
            {error ? <Notification element={<Error closeFunction={()=>{setError("")}}  message={error}/>} /> : ""}
            <h1>Vállalatok</h1>
            {addNew || editCompany._id ? <AddCompany nameOfCompany={editCompany.name} tax={editCompany.tax} id={editCompany._id} closeWindowFunction={()=>{setAddNew(false); setEditCompany({name : "", tax : "", _id : ""})}} errorFunction = {setError} updateFunction={getCompanies} /> : ""}
            {companies.length ? <CompaniesList companies={companies} editFunction={editFunction} deleteFunction={deleteCompanyFunction} /> : <Loader />}
            <AddNewButton onClick={()=>{setAddNew(true)}} />
        </div>
    );
}

export default CompaniesMain;