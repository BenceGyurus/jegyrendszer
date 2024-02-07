import { useRef } from "react";
import "../../css/user-side-coupon-activate.css";

type typeOfCoupnParams = {
  changeReferalCode: Function;
  onClickFunction: Function;
  value: string;
};

const Coupon = ({
  changeReferalCode,
  onClickFunction,
  value,
}: typeOfCoupnParams) => {
  const codeRef: any = useRef(null);

  /*useEffect(()=>{
        if (codeRef && codeRef.current){
            codeRef.current.value = value;
        }
    })*/

  return (
    <div className="buy-ticket-coupon-div">
      <h2>Kupon beváltása</h2>
      <input
        className="coupon-input"
        id="coupon"
        onChange={(e) => changeReferalCode(e.target.value.toUpperCase())}
        value={value}
      />
      <input
        className="coupon-button"
        type="button"
        value="Beváltás"
        onClick={(e) => onClickFunction()}
      />
    </div>
  );
};

export default Coupon;
