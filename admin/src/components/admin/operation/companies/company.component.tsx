import { Card } from "antd";
import "../../../../css/company.css";
import typeOfCompany from "./type/company";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

type typeOfCompanyParams = {
    company : typeOfCompany,
    editFunction : Function,
    deleteFunction : Function
}

const Company = ({ company, editFunction, deleteFunction }:typeOfCompanyParams)=>{
    return (
        <Card title={company.name} className = "company-box" bordered={false} style={{ width: 300 }} actions={
            [
                <DeleteOutlined key="setting" onClick={e=>{deleteFunction(company._id)}} />,
                <EditOutlined key="edit" onClick={e=>{editFunction(company._id)}} />,
              ]
        }>
            <p className = "tax-number">Adószám: {company.tax}</p>
            <p className = "company-address">Székhely : {company.address}</p>
            <p className = "web-site">Weboldal: <a target="_blank" href = {company.website}>{company.website}</a></p>
        </Card>
    );
}

export default Company;