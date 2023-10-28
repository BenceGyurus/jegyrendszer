import { Input } from "antd";
import typeOfGroupSettings from "./type/groupSettings";
import { useState } from "react";
import typeOfGroup from "./type/group";
import { group } from "console";
import groupByCommonWords from "./groupByCommonWords";

const GroupsSettings = ({ groups, setGroups, seats }:typeOfGroupSettings)=>{

    const [createdGroups, setCreatedGroups] = useState<any>(groupByCommonWords(groups, seats));

    return (
        <div>
            {
                Object.keys(createdGroups).map(key=>{
                    return <div>
                        <h2>{key}</h2>
                        {createdGroups[key].map((group:any)=>{
                        return (<div>
                            <Input value={group.name} />
                        </div>)
                    })
                }</div>
                })
            }
        </div>
    );
}

export default GroupsSettings;


/*
groups.map((group)=>{
                    return ( seats.filter(seat=>{return seat.group === group.id}).length ?  <div style={{borderBottom : `3px solid ${group.color}`}}>
                        <Input value={group.name} />
                    </div> : <></>)
                })*/