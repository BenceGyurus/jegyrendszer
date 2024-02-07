import { useState } from "react";
import "../../css/paymet-methods.css";

type typeOfMethod = {
  id: string;
  image: string;
};

type typeOfPaymentMethodsParams = {
  onChangeFunction: Function;
  defaultCheck?: string;
  methods: Array<typeOfMethod>;
};

const PaymentMethods = ({
  onChangeFunction,
  defaultCheck,
  methods,
}: typeOfPaymentMethodsParams) => {
  const [checked, setChecked] = useState(defaultCheck ? defaultCheck : "");

  const check = (id: string) => {
    setChecked(id);
    onChangeFunction(id);
  };

  return (
    <div className="payment-container">
      <div>
        {methods.map((method) => {
          return (
            <div
              onClick={(e) => check(method.id)}
              className={`${method.id === checked ? "checked-payment-method " : ""} payment-method`}
            >
              <img src={method.image} alt="Payment method image" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default PaymentMethods;
