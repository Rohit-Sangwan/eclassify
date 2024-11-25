import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SliderSkeleton = () => {
  return (
    <SkeletonTheme baseColor="lightgray" highlightColor="#e0e0e0">

    <div className="offer_slider pop_categ_mrg_btm p-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="swiper_section">
              <Skeleton width="100%" height={493} style={{ borderRadius: '26px' }} />
              <div className="pop_cat_btns d-none pop_cat_left_btn">
                <Skeleton circle={true} height={24} width={24} />
              </div>
              <div className="pop_cat_btns d-none pop_cat_right_btn">
                <Skeleton circle={true} height={24} width={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </SkeletonTheme>
  );
};

export default SliderSkeleton;