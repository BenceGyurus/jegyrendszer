import Skeleton from '@mui/material/Skeleton';
const SkeletonUser = ()=>{
    return <div className = "admin-user-element">
        <Skeleton variant="circular" width={40} height={40} animation="wave" />
        <Skeleton variant="text" sx={{ fontSize: '16px' }} width = {70} animation="wave" />
        <div className = "buttons">
        </div>
    </div>
}

export default SkeletonUser