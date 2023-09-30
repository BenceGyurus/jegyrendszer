import { useRef,useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Tour } from 'antd';
import type { TourProps } from 'antd';
import "../../css/inputStyle.css";
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';
type typeOfInputTextParams = {
    title : string,
    onChangeFunction : Function,
    value? : string,
    params? : Array<any>,
    disabled? : boolean,
    info? : { image? : string, text? : string},
    ref? : any,
    money? : boolean,
    website? : boolean
}


const InputText = ({ title,onChangeFunction,value,params, disabled,info,ref, website, money }:typeOfInputTextParams)=>{
    const inputRef:any = useRef(null);
    let id = uuid();

    const [open, setOpen] = useState(false);

    const [showTooltip, setShowTooltip] = useState(false);

    const steps: TourProps['steps'] = [
      {
        title: title,
        description: info && info.text ? info.text : "",
        cover: (
          info && info.image ? <img style={{width : 200}}
            alt="tour.png"
            src={info.image}
          /> : ""
        ),
        target: () => inputRef.current,
      }
    ];

  const handleInfoButtonHover = () => {
    setShowTooltip(true);
  };

  const handleInfoButtonLeave = () => {
    setShowTooltip(false);
  };

    useEffect(()=>{
        if (inputRef.current && value){inputRef.current.value = value}
    })

    return (
      <div className="input-container" ref = {ref}>
        <div ref = {ref ? ref : null} >
            <label htmlFor={id} className = "inputLabel">{title}</label>
            <Input placeholder={title} addonAfter = {money ? "Ft" : ""} addonBefore = {website ? "www." : ""} size = "large" onChange={e => {params ? onChangeFunction(e.target.value, ...params) : onChangeFunction(e.target.value)}} value={value} suffix={info && info.text ? 
            <Tooltip title={info.text} zIndex={9999999999}>
              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip> : ""
      } /></div>
        </div>
    );
}

//className = "textInput" 

export default InputText;