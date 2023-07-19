import "../../../../css/company.css";

type typeOfCompany = {
    name : string,
    tax : string,
    _id : string
}

type typeOfCompanyParams = {
    company : typeOfCompany,
    editFunction : Function,
    deleteFunction : Function
}

const Company = ({ company, editFunction, deleteFunction }:typeOfCompanyParams)=>{
    return (
        <div className = "company-box">
            <h2 className = "company-name">{company.name}</h2>
            <p className = "tax-number">Adószám: {company.tax}</p>
            <div className = "company-buttons">
                <button className = "edit-button" onClick={e=>{editFunction(company._id)}}>Szerkesztés</button>
                <button className = "delete-button" onClick={e=>{deleteFunction(company._id)}}>Törlés</button>
            </div>
        </div>
    );
}

export default Company;