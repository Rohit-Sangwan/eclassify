import React, { useEffect, useRef, useState } from 'react'
// Import Swiper styles
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import ProductCard from '../Cards/ProductCard';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import Link from 'next/link';
import { userSignUpData } from '@/redux/reuducer/authSlice';
import { useSelector } from 'react-redux';
import { FreeMode } from 'swiper/modules';
import { useIsRtl } from '@/utils';


const SimilarProducts = ({ similarData, setSimilarData }) => {
    const swiperRef = useRef();
    const isRtl = useIsRtl();
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const userData = useSelector(userSignUpData);
    const swipePrev = () => {
        swiperRef?.current?.slidePrev()
    }
    const swipeNext = () => {
        swiperRef?.current?.slideNext()
    }

    const handleSlideChange = () => {
        setIsEnd(swiperRef?.current?.isEnd);
        setIsBeginning(swiperRef?.current?.isBeginning);
    };


    useEffect(() => {
        if (swiperRef && swiperRef?.current) {
            swiperRef?.current?.changeLanguageDirection(isRtl ? 'rtl' : 'ltr');
        }
    }, [isRtl]);


    const breakpoints = {
        0: {
            slidesPerView: 2,
        },
        450: {
            slidesPerView: 2,
        },
        576: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 3.5,
        },
        1200: {
            slidesPerView: 3,
        },
        1400: {
            slidesPerView: 4,
        },
    };

    const handleLike = (id) => {
        const updatedItems = similarData.map((item) => {
            if (item.id === id) {
                return { ...item, is_liked: !item.is_liked };
            }
            return item;
        });
        setSimilarData(updatedItems);
    }

    return (

        <>
            {similarData?.length > 4 ? (
                <div className="col-12">
                    <div className='similar_prod_swiper'>
                        <Swiper
                            dir={isRtl ? "rtl" : "ltr"}
                            className="similar_product_swiper"
                            slidesPerView={4}
                            spaceBetween={30}
                            breakpoints={breakpoints}
                            onSlideChange={handleSlideChange}
                            modules={[FreeMode]}
                            freeMode={true}
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                                setIsEnd(swiper.isEnd);
                                setIsBeginning(swiper.isBeginning);
                            }}
                        >
                            {similarData && similarData.map((data, index) => (
                                <SwiperSlide key={index}>
                                    <Link href={userData?.id == data?.user_id ? `/my-listing/${data?.slug}` : `/product-details/${data.slug}`} prefetch={false}>
                                        <ProductCard data={data} handleLike={handleLike} />
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {similarData?.length > 4 &&
                            <>
                                <div className={`pag_leftarrow_cont leftarrow ${isBeginning ? 'hideArrow' : ''}`} onClick={swipePrev}>
                                    <FaArrowLeft size={24} className='arrowLeft' />
                                </div>
                                <div className={`pag_rightarrow_cont rightarrow ${isEnd ? 'hideArrow' : ''}`} onClick={swipeNext} >
                                    <FaArrowRight size={24} className='arrowRight' />
                                </div>
                            </>
                        }
                    </div>
                </div>
            ) : (
                similarData && similarData.map((data, index) => (
                    <div className="col-6 col-md-6 col-lg-3" key={index}>
                        <Link href={userData?.id == data?.user_id ? `/my-listing/${data?.slug}` : `/product-details/${data.slug}`} prefetch={false}>
                            <ProductCard data={data} handleLike={handleLike} />
                        </Link>
                    </div>
                ))
            )}

        </>

    )
}

export default SimilarProducts
