import { useRef,useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Tour } from 'antd';
import type { TourProps } from 'antd';
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';
import "../../css/numberInputStyle.css";
type typeOfInputTextParams = {
    title? : string,
    onChangeFunction : Function,
    value?:number|string,
    disabled? : boolean,
    functionParams? : Array<any>,
    money? : boolean,
    info? : { text : string },
    sufix? : string,
    size? : "small" | "large" | "middle"
}
const InputNumber = ({ title,onChangeFunction,value,disabled,functionParams, money, info,sufix, size }:typeOfInputTextParams)=>{
    let id = uuid();
    const numberInputRef:any = useRef(null);
    useEffect(()=>{
        if (numberInputRef.current && value){numberInputRef.current.value = value}
    }, [value]);
    console.log(value);
    return (
        <div className="input-container">
        <div>
            {title ? <label htmlFor={id} className = "inputLabel">{title}</label> : <></>}
            <Input size = {size ? size : "large"} ref={numberInputRef} disabled = {disabled} type='number' placeholder={title} addonAfter = {money ? "Ft" : sufix ? sufix : ""} onChange={e => {onChangeFunction(Number(e.target.value))}} value={value} suffix={info && info.text ? 
            <Tooltip title={info.text} zIndex={9999999}>
              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip> : ""
      } /></div>
        </div>
    );
}

export default InputNumber;