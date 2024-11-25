'use client'
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

const SellerCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="lightgray" highlightColor="#e0e0e0">
      <div className="seller_card">
        <div className="seller_info_header">
          <Skeleton width={120} />
          <Skeleton width={30} />
        </div>
        <div className="seller_verified_cont">
          <Skeleton width={60} />
          <Skeleton width={70} />
        </div>
        <div className="seller_name_img_cont">
          <Skeleton width={120} height={120} style={{ borderRadius: '12px' }} />
          <div className="seller_name_rating_cont">
            <p className="seller_name">
              <Skeleton width={160} />
            </p>
            <div className="seller_Rating_cont">
              <Skeleton width={120} />
            </div>
          </div>
        </div>
        <div className="seller_details">
          <Skeleton width={160} />
          <Skeleton width={130} />
        </div>
      </div>
    </SkeletonTheme>
  )
}

export default SellerCardSkeleton