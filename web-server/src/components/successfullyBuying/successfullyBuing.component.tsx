import "../../css/successfullyBuying.css";

const SuccessfullyBuying = ()=>{
    return (
        <div className="wrapper"> <svg className="animated-check" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="23" />
            <path d="M14.1 27.2l7.1 7.2 16.7-16.8"/> </svg>
            <h2 className = "successfully-buying-title">Sikeres vásárlás</h2>
        </div>
    )
}

export default SuccessfullyBuying;