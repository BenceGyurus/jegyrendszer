import Skeleton from '@mui/material/Skeleton';

const TicketSkeleton = ()=>{
    return <div className = "user-page-ticket" style={{background : "white", height : 150, padding : 30}}>
        <div className = "ticket-item">
        <div className = "ticket-info">
        <Skeleton className = "ticket-name" width = {120} height = {30} animation="wave" />
        <Skeleton className = "ticket-price" width = {50} animation="wave" height = {20} />
        </div>
        <div className="quantity-selector">
            <Skeleton className = "quantity-btn" variant='circular' height = {30} width={30} animation="wave" />
            <Skeleton className = "ticket-quantity-skeleton" variant='circular' height = {30} width={30} animation="wave" />
            <Skeleton className = "quantity-btn" variant='circular' height = {30} width={30} animation="wave" />
        </div>
        </div>
        <div className="total-price" id="total-price" style={{width : "100%"}}>
        <Skeleton height = {30} width={100} animation="wave" style = {{float : "right"}} />
        </div>
    </div>
}

export default TicketSkeleton;


