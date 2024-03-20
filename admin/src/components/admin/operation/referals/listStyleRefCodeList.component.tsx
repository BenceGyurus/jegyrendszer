import typeOfListStyleRefCodeListParams from "./types/typeOfListStyleRefCodeListParams";
import React from 'react';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import typeOfCoupon from "./types/typeOfCoupon";

const generateDate = (date:string)=>{
    let d = new Date(date);
    return `${d.getFullYear()}.${d.getMonth()+1>9 ? d.getMonth()+1 : `0${d.getMonth()+1}`}.${d.getDate()>9 ? d.getDate() : `0${d.getDate()}`}`
};


const ListStyleRefCodeList = ({coupons, deleteFunction, editFunction}:typeOfListStyleRefCodeListParams)=>{
    return <Table columns={[
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Mennyiség',
          key: 'amount',
          render: (_, record) => (
            <Space size="middle">
              <span>{record.amount} {record.money ? "Ft" : "%"}</span>
            </Space>
          ),
        },
        {
          title: 'Valid',
          render: (_, record) => (
            <Space size="middle">
              <span>{generateDate(record.validity)}</span>
            </Space>
          ),
          key: 'valid',
        },
        {
            title : "Used",
            dataIndex : "usedTicket",
            key : "used"
        },
        {
          title: 'Action',
          key: 'action',
          render : (_, record) => (
            <Space size="middle">
              <a onClick = {()=>editFunction(record._id)}>Edit</a>
              <a onClick = {()=>deleteFunction(record._id)}>Delete</a>
            </Space>
          )
        },
      ]} dataSource={coupons} />;
}

export default ListStyleRefCodeList;