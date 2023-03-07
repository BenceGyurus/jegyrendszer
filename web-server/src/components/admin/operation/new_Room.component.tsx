import VenueDatas from "./seats/component/datasAboutVenue.component";
import Main from "./seats/main";
import { useState } from "react";
import SaveButton from "../../saveButton/saveButton.component";

const addNewRoom = ()=>{
    return (
        <div>
            <Main seatsDatas = {[]} groupsDatas = {[]} />
        </div>
    );
}

export default addNewRoom;