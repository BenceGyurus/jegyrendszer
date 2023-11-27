import { Button, Checkbox, Slider } from "antd";
import typeOfTansformParams from "./type/transformParams";
import { useState } from "react";

const TransformsSettings = ({incrementStairs, decrementStairs}:typeOfTansformParams)=>{

    return <div>
        <div>
        <span>Lépcsőzetes (x)</span>
        <Button onClick={e=>incrementStairs()}>
            +
        </Button>
        <Button onClick={e=>decrementStairs()}>
            -
        </Button>
        </div>
    </div>
}

export default TransformsSettings;