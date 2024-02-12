import { useRef } from "react";
import "../../css/user-side-coupon-activate.css";
import { Input, Button } from "antd";

type typeOfCoupnParams = {
  changeReferalCode: Function;
  onClickFunction: Function;
  value: string;
  checkCoupon: boolean;
};

const Coupon = ({
  changeReferalCode,
  onClickFunction,
  value,
  checkCoupon,
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
      <Input
        className="coupon-input"
        id="coupon"
        onChange={(e) => changeReferalCode(e.target.value.toUpperCase())}
        value={value}
      />
      <Button
        size="large"
        className="coupon-button"
        onClick={() => onClickFunction()}
        type="primary"
        loading={checkCoupon}
      >
        Beváltás
      </Button>
    </div>
  );
};

export default Coupon;
