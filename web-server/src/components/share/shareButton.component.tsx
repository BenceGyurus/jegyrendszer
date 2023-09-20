
import { Button } from 'antd';
import "../../css/shareButton.css";
import { LinkOutlined } from '@ant-design/icons';


type typeOfShareButtonParams = {
    onClickFunction : Function
}

const ShareButton = ({}:typeOfShareButtonParams)=>{
    return (
    <button className = "share-button">
        <LinkOutlined style={{color : "#fff", fontSize : 18}} className='share-button-icon' />
        Másolás
    </button>
    );  
}

export default ShareButton;