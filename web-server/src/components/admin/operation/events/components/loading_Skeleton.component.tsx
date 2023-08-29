import EventSkeleton from "./event_Skeleton.component"

type typeOfLoadingSkeletonParams = {
    limit : number
}

const LoadingSkeleton = ({limit}:typeOfLoadingSkeletonParams)=>{

    return <div className = "admin-event-list">
        {
            Array.from(Array(limit), (e, i) => {
                return  <EventSkeleton />
              })
        }
    </div>
}

export default LoadingSkeleton;