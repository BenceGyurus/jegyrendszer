import Skeleton from '@mui/material/Skeleton';

const AccessSkeleton = ()=>{
    return(
        <div style={{display : "flex", justifyContent : "space-between", width : "180px", marginBottom : 10}}>
        <Skeleton animation="wave" width = {170} height = {60} />
        </div>
    )
}

export default AccessSkeleton;