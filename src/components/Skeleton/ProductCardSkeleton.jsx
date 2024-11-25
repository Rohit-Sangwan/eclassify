import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'

const ProductCardSkeleton = () => {
    return (
        <SkeletonTheme baseColor="lightgray" highlightColor="#e0e0e0">

            <div className="product_card">
                <div className="position-relative">
                    <Skeleton width='100%' className="product_card_prod_img" />
                </div>
                <Skeleton count={1} />
                <Skeleton count={0.7} />
                <Skeleton count={0.9} />
            </div>
        </SkeletonTheme>
    )
}

export default ProductCardSkeleton