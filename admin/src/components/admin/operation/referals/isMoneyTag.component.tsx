import typeOfIsMoneyTagParams from "./types/typeOfIsMoneyTagParams";
import { Space, Tag } from 'antd';

const { CheckableTag } = Tag;

const IsMoneyTag = ({typeOfDiscount, onChangeFunction}:typeOfIsMoneyTagParams)=>{
    return (
        <div className = "discountType">
        <CheckableTag
            key={"tag_1"}
            checked={!typeOfDiscount}
            onChange={e=>onChangeFunction(false)}
          >
            %
          </CheckableTag>
          <CheckableTag
            key={"tag_2"}
            checked={typeOfDiscount}
            onChange={e=>onChangeFunction(true)}
          >
            Ft
          </CheckableTag>
        </div>
    )
}

export default IsMoneyTag