import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

const UserCardSkeleton = () => {
    return (
        <SkeletonTheme baseColor="lightgray" highlightColor="#e0e0e0">
            <div className="usercard">
                <div className="user_img_cont">
                    <Skeleton width='100%' className="usersimg" />
                </div>
                <div className="card_det_wrapper">
                    <div className="userdet_cont">
                        <Skeleton count={0.6} />
                        <Skeleton count={0.4} />
                    </div>

                    <Skeleton count={0.8} />
                    
                    <div className="h_line"></div>

                    <Skeleton count={1} />
                </div>
            </div>
        </SkeletonTheme>
    )
}

export default UserCardSkeleton