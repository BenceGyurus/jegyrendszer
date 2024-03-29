import { Input, Radio } from "antd";
import "../../css/datasOfCustomers.css";

type typeOfDatasOfCustormerParams = {
  setFirstName: Function;
  setLastName: Function;
  setPostalCode: Function;
  setCity: Function;
  setAddress: Function;
  setAddress2: Function;
  setTaxNumber: Function;
  setMail: Function;
  setPhone: Function;
  city: string;
  firstName: string;
  lastName: string;
  zip: string;
  address: string;
  address2: string;
  tax: string;
  mail: string;
  phone: string;
  setInvoiceName: Function;
  sameInvoiceData: boolean;
  setSameInvoiceData: Function;
  isCompany: boolean;
  setIsCompany: Function;
  acceptTermsFunction : Function,
  isTermsAccespted : boolean
};

const DatasOfCustomer = ({
  setFirstName,
  setLastName,
  setPostalCode,
  setCity,
  setAddress,
  setAddress2,
  setTaxNumber,
  setMail,
  setPhone,
  city,
  firstName,
  lastName,
  zip,
  address,
  address2,
  tax,
  mail,
  phone,
  setInvoiceName,
  sameInvoiceData,
  setSameInvoiceData,
  isCompany,
  setIsCompany,
  acceptTermsFunction,
  isTermsAccespted
}: typeOfDatasOfCustormerParams) => {
  console.log("isCompany", isCompany);
  const getCity = (zipcode: string) => {
    if (zipcode) {
      fetch(`https://hur.webmania.cc/zips/${zipcode}.json`).then(
        async (response: any) => {
          response = await response.json();
          if (response.zips && response.zips.length) {
            setCity(response.zips[0].name);
          }
        },
      );
    }
  };

  const getValueOfCompany = ()=>{
    if (isCompany !== undefined){
      return isCompany;
    }
    else{
      setIsCompany(false);
      return false
    }
  }

  return (
    <div className="datas-of-customer">
      <div className="is-company-option">
        <Radio.Group
          size="middle"
          optionType="button"
          options={[
            { label: "Magánszemély", value: false },
            { label: "Cég", value: true },
          ]}
          onChange={(e) => setIsCompany(e.target.value)}
          value = {getValueOfCompany()}
        />
      </div>
      <h2>Számlázási adatok:</h2>
      {!isCompany ? (
        <div className="user-datas-name">
          <label htmlFor="lastName">Vezetéknév</label>
          <br />
          <Input
            className="input"
            size="middle"
            type="text"
            id="lastName"
            defaultValue={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            autoComplete="family-name"
          />
          <br />
          <label htmlFor="firstname">Keresznév</label>
          <br />
          <Input
            size="middle"
            type="text"
            id="firstname"
            defaultValue={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="given-name"
          />
        </div>
      ) : (
        <div>
          <label htmlFor="lastName">Név</label>
          <br />
          <Input
            className="input"
            size="middle"
            type="text"
            id="lastName"
            defaultValue={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            autoComplete="family-name"
          />
          <br />
        </div>
      )}
      <div className="customer-data-component">
        <h3>Számlázási cím</h3>
        <div className="post-code-and-city-div">
          <div id="postal-code-div">
            <label htmlFor="postCode">Irányítószám</label>
            <Input
              size="middle"
              type="text"
              id="postCode"
              defaultValue={zip}
              onBlur={(e) => {
                getCity(e.target.value);
              }}
              onChange={(e) => {
                setPostalCode(e.target.value);
              }}
              autoComplete="postal-code"
            />
          </div>
          <div id="city-div">
            <label htmlFor="city">Település név</label>
            <Input
              size="middle"
              type="text"
              id="city"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
              }}
              autoComplete="country-name"
            />
          </div>
        </div>
        <label htmlFor="address">Cím</label>
        <br />
        <Input
          size="middle"
          type="text"
          id="address"
          defaultValue={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
          autoComplete="street-address"
        />
        <br />
        <label htmlFor="address2">Emelet, lépcsőház stb. (nem kötelező)</label>
        <br />
        <Input
          size="middle"
          type="text"
          id="address2"
          defaultValue={address2}
          onChange={(e) => {
            setAddress2(e.target.value);
          }}
        />
      </div>
      {isCompany ? (
        <div>
          <label htmlFor="tax-number">
            Adószám (magánszemélynek nem kötelező)
          </label>
          <br />
          <Input
            size="middle"
            type="text"
            id="tax-number"
            defaultValue={tax}
            onChange={(e) => {
              setTaxNumber(e.target.value);
            }}
          />
        </div>
      ) : (
        <></>
      )}
      <div className="contact customer-data-component">
        <h3>Kapcsolattartás</h3>
        <label htmlFor="email">E-mail cím</label>
        <br />
        <Input
          size="middle"
          type="email"
          id="email"
          defaultValue={mail}
          onChange={(e) => {
            setMail(e.target.value);
          }}
          autoComplete="email"
        />
        <br />
        <label htmlFor="phone">Telefonszám</label>
        <br />
        <Input
          size="middle"
          type="phone"
          id="phone"
          defaultValue={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="phone"
        />
      </div>
      <br />
      <div className = "accept-term-and-conditions">
      <input type="checkbox" id="accept" checked = {isTermsAccespted} onChange={e=>acceptTermsFunction(e.target.checked)} />
      <label htmlFor="accept">
        Elfogadom az{" "}
        <a href="/aszf" target="_blank">
          Általános szerződési feltételeket
        </a>
      </label>
      </div>
    </div>
  );
};

export default DatasOfCustomer;
