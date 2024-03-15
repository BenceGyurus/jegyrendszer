import { EventSkeleton } from "./eventsSkeletons.component";

export function EventSkeletonList() {
    return <div className = "event-list-div"><EventSkeleton /><EventSkeleton /><EventSkeleton /></div>
};