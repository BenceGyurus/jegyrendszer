import Skeleton from '@mui/material/Skeleton';

const  EventSkeleton = ()=>{
    return (<div style={{display : "inline-table", backgroundColor : "transparent", margin : 10, height : 370, width: "30%", overflow: "hidden"}} >
            <Skeleton variant="rounded" width = {"100%"} height = {200} animation="wave" />
            <Skeleton width = {"100%"} height = {50} /> 
            <div className='buttons'>
            <Skeleton width = {100} height = {50}  className = "edit-button" /> 
            <Skeleton width = {100} height = {50}  className = "delete-button" /> 
            </div>
    </div>)
   
}

export default EventSkeleton;