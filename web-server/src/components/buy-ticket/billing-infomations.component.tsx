import "../../css/billing-informations.css";


type typeOfBillngInformationsParams = {
    firstname : String,
    lastname : String,
    zip : string,
    city : string,
    address : string,
    address2? : string,
    tax? : string,
    mail : string,
    phone : string
}

const BillingInformations = ({firstname, lastname, zip, city, address, address2, tax, mail, phone}:typeOfBillngInformationsParams)=>{
    return (
        <div className="billing-container">
                <div className="billing-header">Számlázási adatok</div>
                    <div className="billing-field">
                    <span className="billing-label">Név:</span>
                    <span className="billing-value">{firstname} {lastname}</span>
                </div>
                <div className="billing-field">
                    <span className="billing-label">Cím</span>
                    <span className="billing-value">{zip}, {city}, {address}{address2 ? `, ${address2}` : ""}</span>
                </div>
                {tax ?
                <div className="billing-field">
                    <span className="billing-label">Adószám</span>
                    <span className="billing-value">{tax}</span>
                </div> :
                    ""
                }
                <div className="billing-field">
                    <span className="billing-label">Telefonszám</span>
                    <span className="billing-value">{phone}</span>
                </div>
                <div className="billing-field">
                    <span className="billing-label">Email cím:</span>
                    <span className="billing-value">{mail}</span>
                </div>
  </div>
    );
}

export default BillingInformations;