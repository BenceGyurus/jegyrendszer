import { useRef,useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Tour } from 'antd';
import type { TourProps } from 'antd';
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Tooltip } from 'antd';
import "../../css/numberInputStyle.css";
type typeOfInputTextParams = {
    title : string,
    onChangeFunction : Function,
    value?:number|string,
    disabled? : boolean,
    functionParams? : Array<any>,
    money? : boolean,
    info? : { text : string },
    sufix? : string
}
const InputNumber = ({ title,onChangeFunction,value,disabled,functionParams, money, info,sufix }:typeOfInputTextParams)=>{
    let id = uuid();
    const numberInputRef:any = useRef(null);
    useEffect(()=>{
        if (numberInputRef.current && value){numberInputRef.current.value = value}
    })
    return (
        <div className="input-container">
        <div ref = {numberInputRef ? numberInputRef : null} >
            <label htmlFor={id} className = "inputLabel">{title}</label>
            <Input disabled = {disabled} type='number' placeholder={title} addonAfter = {money ? "Ft" : sufix ? sufix : ""} size = "large" onChange={e => {onChangeFunction(e.target.value)}} value={value} suffix={info && info.text ? 
            <Tooltip title={info.text} zIndex={9999999}>
              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip> : ""
      } /></div>
        </div>
    );
}

export default InputNumber;