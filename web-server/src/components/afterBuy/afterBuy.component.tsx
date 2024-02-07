import SuccessfullyBuying from "../successfullyBuying/successfullyBuing.component";
import BuyingError from "../rejectbuying/rejectBuying.component";
import { useEffect, useState } from "react";
import Loader from "../loader/loader.component";
import Attention from "../attentionByBuying/attention.component";
import PaymentProcessing from "../payment-processing-status/payment-processing-status.component";
const AfterBuy = () => {
  const [status, setStatus] = useState<
    "bought" | "loading" | "progress" | "failed"
  >("loading");

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    fetch(`/api/v1/status?id=${queryParameters.get("id")}`).then(
      async (response: any) => {
        response = await response.json();
        if (!response.error && response.bought && response.status) {
          setStatus("bought");
        } else if (
          (!response.error && response.pending) ||
          (response.status && !response.expired)
        ) {
          setStatus("progress");
        } else setStatus("failed");
      },
    );
  }, []);

  console.log(status);

  return status === "bought" ? (
    <SuccessfullyBuying />
  ) : status === "progress" ? (
    <PaymentProcessing />
  ) : status === "failed" ? (
    <BuyingError />
  ) : (
    <Loader />
  );
};

export default AfterBuy;
