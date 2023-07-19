import { useState } from "react";
import Company from "./company.component";
type typeOfCompany = {
    name : string,
    tax : string,
    _id : string
}

type typeOfCompaniesListParams = {
    companies : Array<typeOfCompany>,
    editFunction : Function,
    deleteFunction : Function
}

const CompaniesList = ({companies, editFunction, deleteFunction}:typeOfCompaniesListParams)=>{


    return (
        <div>
        {
        companies.map((company)=>{
            return (<Company company={company} deleteFunction={deleteFunction} editFunction={editFunction} />)
        })
        }
        </div>
    );

}

export default CompaniesList;