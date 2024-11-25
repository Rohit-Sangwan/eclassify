import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

const OurBlogCardSkeleton = () => {
    return (
        <SkeletonTheme baseColor="lightgray" highlightColor="#e0e0e0">
            <div className='ourblog_card'>
                <Skeleton width="100%" className='blog_card_img' />
                <Skeleton count={1.3} />
                <Skeleton count={2} />
                <Skeleton count={0.4} />
            </div>
        </SkeletonTheme>
    )
}

export default OurBlogCardSkeleton