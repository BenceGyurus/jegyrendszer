import { Space, Table, Tag, DatePicker,Badge, Dropdown, Button, Tooltip } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { DeleteFilled, DownOutlined, PrinterFilled } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { v4 as uuid } from 'uuid';
import typeOfTicket from './types/ticket';
import typeOfDatas from './types/tableData';
import typeOfCustomerDatas from './types/customerData';

const { RangePicker } = DatePicker;

type typeOfTicketsTable = {
    tickets : Array<typeOfDatas>,
    deleteFunction : Function,
    printFunction : Function
}

interface DataType {
    key: string;
    eventName: string;
    eventDate: any;
    sellerName : string,
    numberOfTickets : number,
    fullPrice : number,
    isLocal : boolean,
    nameOfCustomer : typeOfCustomerDatas | undefined,
    tickets : Array<typeOfTicket>,
  }

interface ExpandedDataType {
    key: React.Key;
    name: string;
    price: number;
    amount: number;
  }

  type RangeValue = [Dayjs | null, Dayjs | null] | null;


const TicketsTable = ({ tickets, deleteFunction, printFunction }:typeOfTicketsTable) => {

    const [dates, setDates] = useState<RangeValue>(null);
    const [value, setValue] = useState<RangeValue>(null);

    const onOpenChange = (open: boolean) => {
        if (open) {
            setDates([null, null]);
        } else {
            setDates(null);
        }
    };


  const getFullNumberOfTicket = (t:Array<typeOfTicket>)=>{
    let n = 0;  
    t.forEach(ticket => {
        n += ticket.amount;
    });
    return n;
  }

  const convertDate = (d:string)=>{
    return `${new Date(d).getFullYear()} ${new Date(d).getMonth()+1 > 9 ? new Date(d).getMonth()+1 : `0${new Date(d).getMonth()+1}`}. ${new Date(d).getDate() > 9 ? new Date(d).getDate() : `0${new Date(d).getDate()}`}. ${new Date(d).getHours() > 9 ? new Date(d).getHours() : `0${new Date(d).getHours()}`}:${new Date(d).getMinutes() > 9 ? new Date(d).getMinutes() : `0${new Date(d).getMinutes()}`}`;
}

  const columns: ColumnsType<DataType> = [
    Table.EXPAND_COLUMN,
    {
        title: 'Esemény neve',
        dataIndex: 'eventName',
        key: 'eventName',
        sortDirections: ['descend', 'ascend'],
        sorter: (a,b) => a.eventName.charCodeAt(16) - b.eventName.charCodeAt(16)
    },
    {
        title: 'Vásárlás ideje',
        dataIndex: 'eventDate',
        key: 'eventDate',
        render: (text) => <span>{convertDate(text)}</span>,
        sorter : (a,b)=> new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    },
    {
        title : "Eladó neve",
        dataIndex : "sellerName",
        key : "sellerName",
        filterMode: 'tree',
    },
    {
        title : "Jegyek száma",
        dataIndex : "numberOfTickets",
        key : "numberOfTickets",
        render : (text) => <span>{text} db</span>,
    },
    {
        title : "Teljes ár",
        dataIndex : "fullPrice",
        key : "fullPrice",
        render : (text) => <span>{text.toLocaleString('hu-HU', { useGrouping: true, minimumFractionDigits: 0 })} Ft</span>,
        sorter: (a, b) => a.fullPrice - b.fullPrice,
    },
    {
        title : "Helyi vásárlás",
        dataIndex : "isLocal",
        key : "fullPrice",
        render : (isLocal) => <span style={{color : isLocal ? "green" : "red"}}>{isLocal ? "Igen" : "Nem"}</span>,
        filterMode: 'tree',
        filterSearch: true,
        
    },
    {
        title : "Vásárló neve",
        dataIndex : "nameOfCustomer",
        key : "nameOfCustomer",
        render : (text)=> <Tooltip placement="top" title = {<div><span>Név: {text?.customerName}</span><br /><span>E-mail cím: {text?.cusotmerEmail}</span><br /><span>Telefonszám: {text?.phoneNumber}</span></div>}><span className = "customer-data-link">{text?.customerName ? text?.customerName : ""}</span></Tooltip>
    },
    {
        title : "Műveletek",
        dataIndex : "actions",
        key : "actions"
    }
  ];

  const getDatas:any = ()=>{
    return tickets.map((ticket)=>{
        return {
            key : ticket.buyId,
            eventName : ticket.eventName,
            eventDate : ticket.date,
            sellerName : ticket.user,
            fullPrice : ticket.fullPrice,
            numberOfTickets : getFullNumberOfTicket(ticket.tickets),
            isLocal : ticket.local,
            tickets : ticket.tickets,
            actions : <span><DeleteFilled onClick={e=>deleteFunction(ticket.buyId)}/><PrinterFilled onClick={e=>printFunction(ticket.buyId)} /></span>,
            nameOfCustomer : {customerName : ticket?.customerName ? ticket?.customerName : "", cusotmerEmail : ticket?.cusotmerEmail, phoneNumber : ticket?.phoneNumber}
        }
    });
  }

  const rowRender = (t:Array<typeOfTicket>) => {
    const expandedColumns: TableColumnsType<ExpandedDataType> = [
      { title: 'Esemény neve', dataIndex: 'name', key: 'name' },
      { title: 'Jegyek ára', dataIndex: 'price', key: 'price' },
      {
        title: 'Jegyek mennyisége',
        dataIndex : "amount"
      },
    ];

    let data:any = t.map(item=>{
        return {
            name : item.name,
            price : <span>{item.price.toLocaleString('hu-HU', { useGrouping: true, minimumFractionDigits: 0 })} Ft</span>,
            amount : <span>{item.amount} db</span>,
            key : uuid()
        }
    })

    return <Table bordered = {true} key={uuid()} columns={expandedColumns} dataSource={data} pagination={false} />;
  };


  return (
      <Table
        className = "ads-table"
        bordered = {true}
        columns={columns}
        dataSource={getDatas()}
        expandable={{expandedRowRender: (record) => rowRender(record.tickets)}}
        pagination={false}
      />
  );
};

/*
 filterDropdown : () => <RangePicker
        value={dates || value}
        onCalendarChange={(val) => {
          setDates(val);
        }}
        onChange={(val) => {
          setValue(val);
        }}
        onOpenChange={onOpenChange}
      />*/

export default TicketsTable;