const Attention = ()=>{
    return (<div className = "attention-body">
        <svg className="exclamation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle className="exclamation__circle" cx="26" cy="26" r="25" fill="none" />
        <line className="exclamation__line" x1="26" y1="16" x2="26" y2="36" id="line-1" />
        <line className="exclamation__line" x1="26" y1="40" x2="26" y2="42" id="line-2" />
        </svg>
    </div>)
}

export default Attention;