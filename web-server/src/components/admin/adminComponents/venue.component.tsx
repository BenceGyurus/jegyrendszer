import { useState } from "react";
import SmallMap from "./smallMap.component";
import { typeOfVenueDatas } from "./venuesList.component";
import { Card, Popconfirm, Tag } from "antd";
import StringAvatar from "../../avatar/avatar.component";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export type venueParams = {
    size : {width : number, height : number},
    element : typeOfVenueDatas,
    handleDeleteFunction : Function,
    handleEditFunction : Function
}

export default function Venue({size, element, handleDeleteFunction, handleEditFunction}:venueParams){

    const [openPopConfirm, setOpenPopConfirm] = useState(false);


    return (
        <Card bordered = {true} cover = {
            element.seats.length ? <SmallMap sizeOfArea={size} colorOfBackGround = {element.colorOfBackGround} sizeOfSeats = {element.sizeOfSeat} colorOfSeat = {element.colorOfSeat} seatDatas = {element.seats} /> : <img className = "card-logo" src="/images/logo.png" alt="agora logo" />
          }
          actions={[<Popconfirm title="Helyszín törlése" description="Biztosan törli a helyszínt, ez a művelet nem vonható vissza" open = {openPopConfirm} onConfirm={event=>handleDeleteFunction(element.id)} onCancel={()=>setOpenPopConfirm(false)}><DeleteOutlined onClick = {()=>setOpenPopConfirm(true)} /></Popconfirm>, <EditOutlined onClick = {e => {handleEditFunction(element.id)}} />]}>
          <div className = "venue-list-venue-body">
              <StringAvatar username={element.addedBy} />
              <div className = "venue-datas-holder">
                  <Tag bordered = {true} color={element.seats.length ? "blue" : "magenta"}>
                      {element.seats.length ? "ülő" : "álló"}
                  </Tag>
                  { element.seats.length ? <Tag bordered = {true} color = "red">
                      {element.seats.length} ülőhely
                  </Tag> : <></>}
                  <h3 className = "venue-name">{element.name}</h3>
              </div>
          </div>
          </Card>
    );
};