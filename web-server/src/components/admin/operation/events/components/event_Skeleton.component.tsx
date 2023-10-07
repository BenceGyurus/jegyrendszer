import Skeleton from '@mui/material/Skeleton';

const  EventSkeleton = ({skeletonKey}:{skeletonKey : string})=>{
    return (<div key={skeletonKey} style={{display : "inline-table", backgroundColor : "transparent", margin : 10, height : 370, width: "30%", overflow: "hidden"}} >
            <Skeleton key = "face-skeleton" variant="rounded" width = {"100%"} height = {200} animation="wave" />
            <Skeleton key = "image-skeleton" width = {"100%"} height = {50} /> 
            <div className='buttons' key = {skeletonKey+"skeleton"}>
            <Skeleton key = "button-skeleton-1" width = {100} height = {50}  className = "edit-button" /> 
            <Skeleton key = "button-skeleton-2" width = {100} height = {50}  className = "delete-button" /> 
            </div>
    </div>)
   
}

export default EventSkeleton;