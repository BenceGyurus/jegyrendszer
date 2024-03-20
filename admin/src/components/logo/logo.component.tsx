const logo = (params:any)=>{
    return (
        <div className = {`logoDiv${params.name ? params.name : ""}`} >
        <img className = {`logoImage${params.name ? params.name : ""} logoA${params.name ? params.name : ""}`} src="/images/agoraLogoA.png" alt="agora-logo-A" />
        <img className = {`logoImage${params.name ? params.name : ""} logoG${params.name ? params.name : ""}`} src="/images/agoraLogoG.png" alt="agora-logo-G" />
        <img className = {`logoImage${params.name ? params.name : ""} logoO${params.name ? params.name : ""}`} src="/images/agoraLogoO.png" alt="agora-logo-O" />
        <img className = {`logoImage${params.name ? params.name : ""} logoR${params.name ? params.name : ""}`} src="/images/agoraLogoR.png" alt="agora-logo-R" />
        <img className = {`logoImage${params.name ? params.name : ""} logoA2${params.name ? params.name : ""}`} src="/images/agoraLogoA2.png" alt="agora-logo-A" />
        </div>
    );
}

export default logo;