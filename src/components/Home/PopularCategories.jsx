import React, { useEffect, useState, useCallback, useRef, lazy, Suspense } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";

import { t, useIsRtl } from "@/utils";
// import Loader from "../Loader/Loader";
import { categoryApi } from "@/utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setCatCurrentPage, setCatLastPage, setCateData } from "@/redux/reuducer/categorySlice";
import { CurrentLanguageData } from "@/redux/reuducer/languageSlice";
import PopularCategoriesSkeleton from "../Skeleton/PopularCategoriesSkeleton";
import PopularCategory from "./PopularCategory";

const PopularCategories = () => {

  const dispatch = useDispatch()
  const swiperRef = useRef()
  const isRtl = useIsRtl();
  const [isLoading, setIsLoading] = useState(true);
  const [cateData, setCatData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [cachedData, setCachedData] = useState({});
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const CurrentLanguage = useSelector(CurrentLanguageData)

  const [prevLang, setPrevLang] = useState(CurrentLanguage)

  useEffect(() => {
    if (swiperRef && swiperRef?.current) {
      swiperRef?.current?.changeLanguageDirection(isRtl ? 'rtl' : 'ltr');
    }
  }, [isRtl]);


  // this api call only in pop cate swiper 
  const getCategoriesData = (async (page) => {
    if (prevLang?.id !== CurrentLanguage?.id) {
      setIsLoadingMore(true);
      try {
        const response = await categoryApi.getCategory({ page: `${page}` });
        const { data } = response.data;
        if (data && Array.isArray(data.data)) {
          setCachedData(prev => ({
            ...prev,
            [page]: data.data
          }));
          setCatData(Object.values(data.data).flat());
          setCatData(Object.values(data.data).flat());
          dispatch(setCateData(data.data));
          dispatch(setCatCurrentPage(data?.current_page))
          dispatch(setCatLastPage(data?.last_page))
          setLastPage(data.last_page);
          
        }
      } catch (error) {

        console.error("Error:", error);
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false);
      }
    } else {

      if (cachedData[page]) {
        setCatData(Object.values(cachedData).flat());
        return;
      }
      setIsLoadingMore(true);
      try {
        const response = await categoryApi.getCategory({ page: `${page}` });
        const { data } = response.data;
        if (data && Array.isArray(data.data)) {
          setCachedData(prev => ({
            ...prev,
            [page]: data.data
          }));

          setCatData(Object.values({ ...cachedData, [page]: data.data }).flat());
          setCatData(Object.values({ ...cachedData, [page]: data.data }).flat());
          dispatch(setCateData([...cateData, ...data.data]));
          dispatch(setCatCurrentPage(data?.current_page))
          dispatch(setCatLastPage(data?.last_page))
          setLastPage(data.last_page);
          

        }
      } catch (error) {
        console.error("Error:", error);
        
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false);
      }
    }
  });

  useEffect(() => {
    getCategoriesData(1);
  }, [CurrentLanguage]);

  useEffect(() => {
    if (prevLang?.id !== CurrentLanguage?.id) {
      setPrevLang(CurrentLanguage);
      setCachedData({});
      setCatData([]);
      setCurrentPage(1);
      setLastPage(1);
      setIsLoading(true);
    }
  }, [CurrentLanguage, getCategoriesData, prevLang?.id]);

  const handleNextPage = useCallback(() => {
    if (currentPage < lastPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      getCategoriesData(nextPage);
    }
    if (swiperRef?.current) swiperRef?.current?.slideNext();
  }, [currentPage, lastPage, getCategoriesData]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      getCategoriesData(prevPage);
    }
    if (swiperRef?.current) swiperRef?.current?.slidePrev();
  }, [currentPage, getCategoriesData]);

  const handleLoadMore = useCallback(() => {
    if (currentPage < lastPage && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      getCategoriesData(nextPage);
    }
  }, [currentPage, lastPage, isLoadingMore, getCategoriesData]);

  const handleSlideChange = useCallback((swiper) => {
    setIsEnd(swiper.isEnd);
    setIsBeginning(swiper.isBeginning);
    if (swiper.isEnd) {
      handleLoadMore();
    }
  }, [handleLoadMore]);

  const breakpoints = {
    0: { slidesPerView: 1 },
    320: { slidesPerView: 3 },
    400: { slidesPerView: 3 },
    576: { slidesPerView: 4 },
    768: { slidesPerView: 5 },
    992: { slidesPerView: 7 },
    1200: { slidesPerView: 8 },
    1400: { slidesPerView: 9 }
  };

  return (
    isLoading ? (
      <PopularCategoriesSkeleton />
    ) : (

      <div className="container main_padding">
        {cateData?.length > 0 &&
          <>
            <div className="row mrg_btm">
              <div className="col-12">
                <div className="pop_cat_header">
                  <h4 className="pop_cat_head">{t('popularCategories')}</h4>

                  <div className="pop_cat_arrow">
                    <button className={`pop_cat_btns ${isBeginning && 'PagArrowdisabled'}`} onClick={handlePrevPage}>
                      <RiArrowLeftLine size={24} color="white" />
                    </button>
                    <button className={`pop_cat_btns ${isEnd && 'PagArrowdisabled'}`} onClick={handleNextPage}>
                      <RiArrowRightLine size={24} color="white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Swiper
                  dir={isRtl ? "rtl" : "ltr"}
                  spaceBetween={30}
                  slidesPerView={9}
                  onSlideChange={handleSlideChange}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    setIsEnd(swiper?.isEnd);
                    setIsBeginning(swiper?.isBeginning);
                  }}
                  breakpoints={breakpoints}
                  className="popular_cat_slider"
                >
                  {cateData?.map((ele, index) => (
                    <SwiperSlide key={index}>
                      <PopularCategory data={ele} />
                    </SwiperSlide>
                  ))}

                </Swiper>
              </div>
            </div>
          </>
        }
      </div>
    )
  );
};

export default PopularCategories;