import typeOfEditingPageParams from "./type/editingPageParams";
import "../../css/editing-page.css";
import "../../css/editing-seat-style.css";
import { useEffect, useState } from "react";
import { Select, Tooltip } from "antd";
import ImageUpload from "../image-upload/imageUpload.component";
import { Collapse } from "@mui/material";
import { InfoCircleOutlined } from "@ant-design/icons";


const EditingPage = ({ widthOfSeats, heightOfSeats, setHeightOfSeats, setWidthOfSeats, spaceBetweenOfSeats, spaceUnderOfSeats, setSpaceBetweenOfSeats, setSpaceUnderOfSeats, setBackground, background, rowName, seatName, typeOfRowNumber, typeOfSeatNumber, setTypeOfRowNumber, setRowName, setSeatName, setTypeOfSeatNumber, sector, setSector, isSector, setIsSector, setError, startCounting, setStartCounting }:typeOfEditingPageParams)=>{
    

    const [elements, setElements] = useState<JSX.Element[]>();
    const [opened, setOpened] = useState<boolean>(false);

    const generate_Example = ()=>{
        let elements:JSX.Element[] = [];
        if (widthOfSeats && heightOfSeats && spaceBetweenOfSeats && spaceUnderOfSeats){
            for (let i = 0; i < Math.floor(((window.innerWidth*.3)*.3)/(widthOfSeats+spaceBetweenOfSeats)); i++){
                for (let j = 0; j < 5; j++){
                    elements.push(<span className = "editing-seat" style = {{width : widthOfSeats, height : heightOfSeats, position : "absolute", left : i*(widthOfSeats+spaceBetweenOfSeats), top : j*(heightOfSeats+spaceUnderOfSeats)}}></span>)
                }
            }
            setElements(elements);
        }
    }

    useEffect(()=>{
        generate_Example();
    }, [widthOfSeats, heightOfSeats, spaceBetweenOfSeats, spaceUnderOfSeats])
    
    
    return (
    <div>
        <div onDoubleClick={e=>setIsSector(true)} className={`drawing-selector`}><div className = {`drawing-selector-header ${isSector ? "active-drawing-sector" : ""}`}><div><span className = "drawing-selector-title">Szektor</span><Tooltip  title= "Vásárláskor választható ülőhelyek, kijelölés duplakattintással" placement="bottom"><InfoCircleOutlined /></Tooltip></div><span onClick={e=>{if (isSector) setOpened(!opened)}}>{ isSector && opened ? <i className="fas fa-chevron-down"></i> : <i className="fas fa-chevron-right"></i>}</span></div>
        <Collapse in = {opened && isSector}><div>
            <div>
            <h2 className = "editing-title">Székek méretének beállítása</h2>
            <div className = "edit-map-fields">
                <label className = "edit-map-field-label" htmlFor="width-of-seats">A székek szélessége (px)</label>
                <input className = "edit-map-field-input" id = "width-of-seats" type="number" defaultValue={widthOfSeats} onChange={e=>setWidthOfSeats(Number(e.target.value))} />
            </div>
            <div className = "edit-map-fields">
                <label className = "edit-map-field-label" htmlFor="height-of-seats">A székek magassága (px)</label>
                <input className = "edit-map-field-input" id = "height-of-seats" type="number" defaultValue={heightOfSeats} onChange={e=>setHeightOfSeats(Number(e.target.value))} />
            </div>
            <div  className = "edit-map-fields">
                <label className = "edit-map-field-label" htmlFor="space-between-of-seats">Hely a székek között (px)</label>
                <input className = "edit-map-field-input" id = "space-between-of-seats" type="number" defaultValue={spaceBetweenOfSeats} onChange={e=>setSpaceBetweenOfSeats(Number(e.target.value))} />
            </div>
            <div  className = "edit-map-fields">
                <label className = "edit-map-field-label" htmlFor="space-under-the-seats">Hely a székek alatt (px)</label>
                <input className = "edit-map-field-input" type="number" id = "space-under-the-seats" defaultValue={spaceUnderOfSeats} onChange={e=>setSpaceUnderOfSeats(Number(e.target.value))} />
            </div>
            <div className = "edit-seats-seat-example" style={{height : 5*(heightOfSeats+spaceUnderOfSeats)}}>
                {elements}
            </div>
        </div>
        <h2 className = "editing-title">Szektorok és székek elnevezése</h2>
        <div>
        <div className = "edit-map-fields">
                <label className = "edit-map-field-label" htmlFor="name-of-seat-column">A szektor elnevezése</label>
                <input className = "edit-map-field-input" id = "name-of-seat-column" type="text" defaultValue={sector} onChange={e=>setSector(e.target.value)} />
            </div>
        <div className = "edit-map-fields">
                <label className = "edit-map-field-label" htmlFor="type-of-number-by-name-of-seat-column">Szám típusa a széksoroknál</label>
                <Select className = "edit-map-field-select" onChange={e=>setTypeOfRowNumber(e)} id = "type-of-number-by-name-of-seat-column" defaultValue={typeOfSeatNumber} options={[
                    {label : "Római szám", value : true},
                    {label : "Arab szám", value : false}
                ]} />
            </div>
        <div className = "edit-map-fields">
                <label className = "edit-map-field-label" htmlFor="name-of-seat-column">A széksorok elnevezése</label>
                <input className = "edit-map-field-input" id = "name-of-seat-column" type="text" defaultValue={rowName} onChange={e=>setRowName(e.target.value)} />
            </div>
            <div className = "edit-map-fields">
                <label className = "edit-map-field-label" htmlFor="type-of-number-by-name-of-seat-row">Szám típusa a székeknél</label>
                <Select className = "edit-map-field-select" onChange={e=>setTypeOfSeatNumber(e)} id = "type-of-number-by-name-of-seat-row" defaultValue={typeOfSeatNumber} options={[
                    {label : "Római szám", value : true},
                    {label : "Arab szám", value : false}
                ]} />
            </div>
        <div className = "edit-map-fields">
                <label className = "edit-map-field-label" htmlFor="name-of-seat-column">A székek elnevezése</label>
                <input className = "edit-map-field-input" id = "name-of-seat-column" type="text" defaultValue={seatName} onChange={e=>setSeatName(e.target.value)} />
            </div>
            <div className = "edit-map-fields">
                <label className = "edit-map-field-label" htmlFor="name-of-seat-column">Számlálás kezdése</label>
                <input className = "edit-map-field-input" id = "name-of-seat-column" type="number" defaultValue={startCounting} onChange={e=>setStartCounting(Number(e.target.value))} />
            </div>
        </div></div></Collapse></div>
        <div onDoubleClick={e=>setIsSector(false)} className={`drawing-selector`}><div className = {`drawing-selector-header ${!isSector ? "active-drawing-sector" : ""}`}><div><span className = "drawing-selector-title">Színpad</span><Tooltip  title= "Vásárláskor nem választható ki, színpadkét kerül megjelenítésre, kijelölés duplakattintással" placement="bottom"><InfoCircleOutlined /></Tooltip></div><span onClick={e=>{if (!isSector) setOpened(!opened)}}>{ !isSector && opened ? <i className="fas fa-chevron-down"></i> : <i className="fas fa-chevron-right"></i>}</span></div></div>
    </div>)
}

export default EditingPage;