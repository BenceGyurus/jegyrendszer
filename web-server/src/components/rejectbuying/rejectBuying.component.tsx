import "../../css/rejectBuying.css";


const BuyingError = ()=>{

    return (
        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
        <path className="checkmark__check" fill="none" d="M16 16 36 36" id="line-1" />
        <path className="checkmark__check" fill="none" d="M36 16 16 36" id = "line-2" />
        </svg>
        )

}

//

export default BuyingError;