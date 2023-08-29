type typeOfOpenMapLinkParams = {
    address : string,
    text : string,
    className? : string,
    style? : any
}

const OpenMapLink = ({ address, text, className, style }:typeOfOpenMapLinkParams) => {
    const openMap = () => {
      const isiPhone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);
  
      if (isiPhone) {
        window.location.href = `maps://maps.apple.com/?address=${encodeURIComponent(address)}`;
      } else if (isAndroid) {
        window.location.href = `geo:0,0?q=${encodeURIComponent(address)}`;
      } else {
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
      }
    };
  
    return (
      <a href="#" onClick={openMap} className = {className} style={{...style}}>
        {text}
      </a>
    );
  };

export default OpenMapLink;