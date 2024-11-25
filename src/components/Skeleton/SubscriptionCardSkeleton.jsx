import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'


const SubscriptionCardSkeleton = () => {
    return (
        <SkeletonTheme baseColor="lightgray" highlightColor="#e0e0e0">
            <div className="card regular_card">
                <div className="card-header">
                    <div className="sub_icon_div">
                        <Skeleton width={80} height={80} className='sub_icon' />
                    </div>
                    <div>
                        <Skeleton width={50} count={1} />
                        <Skeleton width={100} count={1} />
                    </div>
                </div>
                <div className="card-body">
                    <div className="details_list">
                        <Skeleton width={200} count={1} />
                        <Skeleton width={200} count={0.8}/>
                        <Skeleton width={200} count={0.6}/>
                        <Skeleton width={200} count={1}/>
                        <Skeleton width={200} count={0.9}/>
                    </div>
                </div>
                <div className="card-footer">
                    <Skeleton width={200} count={1} />
                </div>
            </div>
        </SkeletonTheme>
    )
}

export default SubscriptionCardSkeleton