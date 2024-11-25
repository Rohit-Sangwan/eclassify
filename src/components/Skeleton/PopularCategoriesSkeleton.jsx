import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


const PopularCategoriesSkeleton = () => {


    return (
        <SkeletonTheme baseColor="lightgray" highlightColor="#e0e0e0">

            <div className="container">
                <div className="row pop_categ_mrg_btm top_space">
                    <div className="col-12">
                        <div className="pop_cat_header">
                            <h4 className="pop_cat_head">
                                <Skeleton width={125} />
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="row pop_categ_mrg_btm">
                    <div className="col-12">
                        <div className="cate_skel">
                            {Array.from({ length: 9 }, (_, index) => (
                                <Skeleton key={index} height={120} width={120} style={{ borderRadius: '100%' }} />
                    
                            ))}
                           
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default PopularCategoriesSkeleton;