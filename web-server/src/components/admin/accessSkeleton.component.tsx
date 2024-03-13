import Skeleton from '@mui/material/Skeleton';

const AccessSkeleton = ()=>{
    return(
        <div style={{display : "flex", justifyContent : "space-between", width : "30px", marginBottom : 10, marginLeft: 20}}>
        <Skeleton animation="wave" width = {30} height = {40} />
        </div>
    )
}

export default AccessSkeleton;