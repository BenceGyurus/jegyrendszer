import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ContactlessIcon from "@mui/icons-material/Contactless";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";
import "../../css/buy-ticket-main.css";
import postData from "../connection/request";
import Loader from "../loader/loader.component";
import Error from "../notification/error.component";
import BillingInformations from "./billing-infomations.component";
import Coupon from "./buy-ticket-coupon.component";
import Details from "./buy-ticket-details.component";
import DatasOfCustomer from "./datas-of-customer.component";
import BuyingStepper from "./stepper.component";
import postDataJson from "../connection/postDataJson";

type typeOfBillAddress = {
  firstname: string;
  lastname: string;
  postalCode: number;
  city: string;
  taxNumber: string;
  phone: string;
  mail: string;
};

type typeOfTicketDatas = {
  eventId: string;
  tickets: Array<typeOfTickets>;
  fullAmount: number;
  fullPrice: number;
  eventName: string;
  dateOfEvent: number;
  customerDatas: typeOfBillAddress;
};

type typeOfTickets = {
  name: string;
  places: Array<string> | boolean;
  amount: number;
  price: number;
  types : any
};

type typeOfCoupon = {
  name: string;
  money: boolean;
  amount: number;
};
const BuyTicketMainPage = () => {
  const [sameInvoiceData, setSameInvoiceData]: [boolean, Function] =
    useState(true);
  const [referalCode, setReferalCode]: [string, Function] = useState("");
  const [usedCoupon, setUsedCoupon]: [typeOfCoupon, Function] = useState({
    name: "",
    money: false,
    amount: 0,
  });
  const [error, setError]: [string, Function] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [postCode, setPostCode] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");
  const [fetching, setfetching] = useState(false);
  const [step, setStep] = useState(1);
  const [link, setLink] = useState("");
  const [isCompany, setIsCompany] = useState(false);
  const [checkCoupon, setCheckCoupon] = useState<boolean>(false);
  const [terms, setTerms] = useState<boolean>(false);
  const [ticketDatas, setTicketDatas]: [typeOfTicketDatas, Function] = useState(
    {
      eventId: "",
      tickets: [],
      fullAmount: 0,
      fullPrice: 0,
      eventName: "",
      dateOfEvent: 0,
      customerDatas: {
        firstname: "",
        lastname: "",
        postalCode: 0,
        city: "",
        taxNumber: "",
        phone: "",
        mail: "",
      },
    },
  );

  const useRefCode = () => {
    if (referalCode) {
      setCheckCoupon((prev) => true);
      postData("/control-coupon-code", {
        code: referalCode,
        eventId: ticketDatas.eventId,
      }).then((response) => {
        setCheckCoupon((prev) => false);
        if (response.used) {
          setUsedCoupon({
            name: referalCode,
            money: response.money,
            amount: response.amount,
          });
        } else if (response.message) {
          setError(response.message);
        } else {
          setError("Nem sikerült felhasználni a beírt kódot");
        }
      });
    }
  };

  const sendDatas = () => {
    if (terms){
    if (
      firstname &&
      (lastname || isCompany) &&
      String(postCode).length === 4 &&
      city &&
      address &&
      phone &&
      mail && (!isCompany || taxNumber)
    ) {
      setfetching(true);
      let datas = {
        customerData: {
          firstname: firstname,
          lastname: isCompany ? "" : lastname,
          postalCode: postCode,
          city: city,
          address: address,
          address2: address2 ? address2 : "null",
          taxNumber: taxNumber ? taxNumber : "null",
          phone: phone,
          mail: mail,
          isCompany : isCompany
        },
        coupon: usedCoupon.name,
      };
      let token = window.location.pathname.split("/")[2];
      postDataJson(`/payment/${token}`, { datas: datas }).then((response) => {
        if (response.link) {
          setStep(2);
          getDatas();
          setLink(response.link);
        }
        setfetching(false);
      });
    }
    else{
      setError("Kérem minden kötelező mezőt töltsön ki");
    } 
  }else{
    setError("A továbblépéshez el kell fogadnia a felhasználási feltételeket");
  }
  };

  const pay = () => {
    if (link) {
      window.location.href = link;
    } else{
      setError("Hiba történt a fizetés során");
    }
  };

  const getDatas = () => {
    let token = window.location.pathname.split("/")[2];
    fetch(`/api/v1/buy-ticket-details/${token}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          if (data.customerDatas) {
            setIsCompany(data.customerDatas.isCompany);
            setFirstname(data.customerDatas.firstname);
            setLastname(data.customerDatas.lastname);
            setPostCode(data.customerDatas.postalCode);
            setCity(data.customerDatas.city);
            setAddress(data.customerDatas.address);
            if (data.customerDatas.address2 !== "null")
              setAddress2(data.customerDatas.address2);
            if (data.customerDatas.taxNumber !== "null")
              setTaxNumber(data.customerDatas.taxNumber);
            setPhone(data.customerDatas.phone);
            setMail(data.customerDatas.mail);
          }
          setTicketDatas(data);
        }
      });
  };

  useEffect(() => {
    getDatas();
  }, []);

  return (
    <div>
      <Error
        message={error}
        setOpen={() => {
          setError("");
        }}
        open={error !== ""}
      />
      <div style={{ margin: 10 }}>
        <BuyingStepper active={step} />
      </div>
      {step === 1 ? (
        <div>
          <h1 className = "ticket-buying-main-title">Adatok megadása</h1>
          <div className="first-step-details-holder">
            <DatasOfCustomer
              isTermsAccespted={terms}
              acceptTermsFunction={setTerms}
              isCompany={isCompany}
              setIsCompany={setIsCompany}
              setFirstName={setFirstname}
              setLastName={setLastname}
              setPostalCode={setPostCode}
              setCity={setCity}
              setAddress={setAddress}
              setAddress2={setAddress2}
              setMail={setMail}
              setPhone={setPhone}
              setTaxNumber={setTaxNumber}
              city={city}
              firstName={firstname}
              lastName={lastname}
              zip={postCode}
              tax={taxNumber}
              mail={mail}
              phone={phone}
              address={address}
              address2={address2}
              setInvoiceName={() => {}}
              sameInvoiceData={sameInvoiceData}
              setSameInvoiceData={setSameInvoiceData}
            />
            <div className="details-1st-step">
              {ticketDatas.eventId ? (
                <Details
                  tickets={ticketDatas.tickets}
                  fullPrice={ticketDatas.fullPrice}
                  nameOfEvent={ticketDatas.eventName}
                  coupon={usedCoupon}
                />
              ) : (
                <Details />
              )}
              <Coupon
                checkCoupon={checkCoupon}
                onClickFunction={useRefCode}
                changeReferalCode={setReferalCode}
                value={referalCode}
              />

              <div className="button-grid">
                <LoadingButton
                  size="small"
                  onClick={sendDatas}
                  endIcon={<ArrowForwardIcon />}
                  loading={fetching}
                  loadingPosition="end"
                  variant="contained"
                  className="payingButton"
                  style={{ background: "white", color: "#595959" }}
                >
                  Tovább a fizetéshez
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {step === 2 ? (
        <div>
          <h1>Adatok ellenőrzése</h1>
          <h2>Jegy adatai</h2>
          <div className="details-holder">
            <div className="details">
              {ticketDatas.eventId ? (
                <Details
                  tickets={ticketDatas.tickets}
                  fullPrice={ticketDatas.fullPrice}
                  nameOfEvent={ticketDatas.eventName}
                  coupon={usedCoupon}
                />
              ) : (
                <Loader />
              )}
            </div>
            <div className="details">
              <BillingInformations
                isCompany={isCompany}
                setIsCompany={setIsCompany}
                firstname={firstname}
                lastname={lastname}
                zip={postCode}
                city={city}
                address={address}
                address2={address2 === "null" ? undefined : address2}
                tax={taxNumber === "null" ? undefined : taxNumber}
                phone={phone}
                mail={mail}
              />
            </div>
          </div>
          <div className="paying-action-buttons">
            <LoadingButton
              size="small"
              onClick={() => {
                setStep(1);
              }}
              endIcon={<ArrowBackIcon />}
              loading={fetching}
              loadingPosition="end"
              variant="contained"
              className="payingButton"
              style={{ background: "white", color: "#595959" }}
            >
              Vissza
            </LoadingButton>
            <LoadingButton
              size="small"
              onClick={pay}
              endIcon={<ContactlessIcon style={{ color: "white" }} />}
              loading={fetching}
              loadingPosition="end"
              variant="contained"
              className="payingButton"
              style={{ background: "white", color: "#595959" }}
            >
              Fizetés
            </LoadingButton>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default BuyTicketMainPage;
