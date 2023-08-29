import AccessSkeleton from "./accessSkeleton.component";

const AccessSkeletons = ()=>{
    return (
        <div>
            {Array.from(Array(10), (e, i) => {
                return  <AccessSkeleton />
              })}
        </div>
    )
}

export default AccessSkeletons;