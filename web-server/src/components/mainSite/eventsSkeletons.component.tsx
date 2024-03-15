import { Skeleton } from "@mui/material";
import "../../css/eventSkeleton.css";


export function EventSkeleton(){
    return <Skeleton height={500} className="event event-skeleton"></Skeleton>
}