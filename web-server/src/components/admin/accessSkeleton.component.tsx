import Skeleton from '@mui/material/Skeleton';

const AccessSkeleton = ()=>{
    return(
        <div style={{display : "flex", justifyContent : "space-between", width : "180px", marginBottom : 10, marginLeft: 20}}>
        <Skeleton animation="wave" width = {Math.random() * (150-50) + 50} height = {40} />
        </div>
    )
}

export default AccessSkeleton;