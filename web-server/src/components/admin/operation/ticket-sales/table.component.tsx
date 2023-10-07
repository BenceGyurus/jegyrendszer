import { Space, Table, Tag, DatePicker,Badge, Dropdown, Button } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { v4 as uuid } from 'uuid';

const { RangePicker } = DatePicker;

type typeOfTicket = {
    name : string,
    price : number,
    unitPrice : number,
    amount : number,
    ticketId : string,
    places : Array<string>,
    eventId : string
}


type typeOfDatas = {
    user : string, 
    coupon : string, 
    price : number, 
    local : boolean, 
    tickets : Array<typeOfTicket>,
    date : string, 
    fullPrice : number, 
    eventName : string, 
    eventId : string,
    buyId : string
}

type typeOfTicketsTable = {
    tickets : Array<typeOfDatas>
}

interface DataType {
    key: string;
    eventName: string;
    eventDate: any;
    sellerName : string,
    numberOfTickets : number,
    fullPrice : number,
    isLocal : boolean,
    nameOfCustomer : string,
    tickets : Array<typeOfTicket>
  }

interface ExpandedDataType {
    key: React.Key;
    name: string;
    price: number;
    amount: number;
  }

  type RangeValue = [Dayjs | null, Dayjs | null] | null;


const TicketsTable = ({ tickets }:typeOfTicketsTable) => {

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
    },
    {
        title: 'Vásárlás ideje',
        dataIndex: 'eventDate',
        key: 'eventDate',
        render: (text) => <span>{convertDate(text)}</span>,
        filterDropdown : () => <RangePicker
        value={dates || value}
        onCalendarChange={(val) => {
          setDates(val);
        }}
        onChange={(val) => {
          setValue(val);
        }}
        onOpenChange={onOpenChange}
      />
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
        render : (text) => <span>{text}db</span>,
    },
    {
        title : "Teljes ár",
        dataIndex : "fullPrice",
        key : "fullPrice",
        render : (text) => <span>{text}Ft</span>,
        sorter: (a, b) => a.fullPrice - b.fullPrice,
    },
    {
        title : "Helyi vásárlás",
        dataIndex : "isLocal",
        key : "fullPrice",
        render : (isLocal) => <span style={{color : isLocal ? "green" : "red"}}>{isLocal ? "Igen" : "Nem"}</span>,
        filters: [
            {
                text: 'Igen',
                value: true,
            },
            {
                text: 'Nem',
                value: false,
            },
        ],
        filterMode: 'tree',
        filterSearch: true,
        
    },
    {
        title : "Vásárló neve",
        dataIndex : "nameOfCustormer",
        key : "nameOfCustomer"
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
            nameOfCustomer : "",
            tickets : ticket.tickets,
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
            price : item.price,
            amount : item.amount,
            key : uuid()
        }
    })

    return <Table bordered = {true} key={uuid()} columns={expandedColumns} dataSource={data} pagination={false} />;
  };

  const header = ()=>{
    return <div><div><h2>Jegyeladások</h2></div><Button onClick = {e=>{}}>Herunterladen (.csv)</Button></div>
  }

  return (
      <Table
        className = "ads-table"
        bordered = {true}
        title={()=>header()}
        columns={columns}
        dataSource={getDatas()}
        expandable={{expandedRowRender: (record) => rowRender(record.tickets)}}
        pagination={false}
      />
  );
};

export default TicketsTable;