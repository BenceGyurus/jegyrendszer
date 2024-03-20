import EventSkeleton from "./event_Skeleton.component"
import { v4 as uuid } from 'uuid';

type typeOfLoadingSkeletonParams = {
    limit : number
}

const LoadingSkeleton = ({limit}:typeOfLoadingSkeletonParams)=>{

    return <div className = "admin-event-list" key = "skeleton">
        {
            Array.from(Array(limit), (e, i) => {
                return  <EventSkeleton key={uuid()} skeletonKey = {uuid()} />
              })
        }
    </div>
}

export default LoadingSkeleton;