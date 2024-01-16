import SuccessfullyBuying from "../successfullyBuying/successfullyBuing.component";
import BuyingError from "../rejectbuying/rejectBuying.component";
import { useEffect, useState } from "react";
import Loader from "../loader/loader.component";
import Attention from "../attentionByBuying/attention.component";
const AfterBuy = ()=>{

    const [status, setStatus] = useState<"bought" | "loading" | "progress" | "failed">("loading");

    useEffect(()=>{
        const queryParameters = new URLSearchParams(window.location.search)
        fetch(`/api/v1/status?id=${queryParameters.get("id")}`)
        .then(async (response:any)=>{
            response = await response.json();
            if (!response.error && response.bought && response.status) setStatus("bought");
            else if ((!response.error && response.pending) || response.status) setStatus("progress");
            else setStatus("failed");
        })
    }, []);

    return status === "bought" ?  <SuccessfullyBuying /> : status === "progress" ? <Attention /> : status === "failed" ? <BuyingError /> : <Loader />;
}

export default AfterBuy;