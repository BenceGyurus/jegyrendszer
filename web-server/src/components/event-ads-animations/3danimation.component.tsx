import "../../css/3danimation.css";
import { useEffect, useState } from "react";


type typeOfAnimation3dTextParams = {
    text : string
}

const Animation3dText = ( { text }:typeOfAnimation3dTextParams )=>{
    const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // Add the animation class when the component loads
    setAnimationClass("animation-text-shadow");
  }, []);

  return (
    <div className={animationClass}>
        <span className = "appear-text">{text}</span>
      {text}
      <span className = "appear-text">{text}</span>
    </div>
  );
}
export default Animation3dText;