'use client'
import React, { useEffect, useRef, useState } from 'react'
// Import Swiper styles
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import SubscriptionCard from '../Cards/SubscriptionCard';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import { getPackageApi } from '@/utils/api';
import SubscriptionCardSkeleton from '../Skeleton/SubscriptionCardSkeleton';
import { isLogin, t } from '@/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';


const Subscription = () => {
    const swiperRef = useRef();
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [Subscription, setSubscription] = useState([])
    const [IsLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const getPackageData = async () => {
        try {
            setIsLoading(true)
            const res = await getPackageApi.getPackage({})
            setSubscription(res?.data?.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPackageData()
    }, [])

    const handlePurchasePackage = (e) => {
        e.preventDefault();

        if (!isLogin) {
            toast.error(t("loginFirst"))
        } else {
            router.push('/subscription')
        }

    }

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

    const breakpoints = {
        0: {
            slidesPerView: 1,
        },
        576: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 3,
        },
    };

    return (

        <section id='sucscription'>

            <div className="container">
                <div className="main_sucscription">
                    <div className="main_header">
                        <span>
                            {t('goProSellFaster')}
                        </span>
                    </div>
                    <span className='title_desc'>
                        {t('upgradeSubscription')}
                    </span>
                </div>

                <div className="swiper_section">

                    <Swiper
                        slidesPerView={3}
                        spaceBetween={30}
                        freeMode={true}
                        pagination={false}
                        modules={[FreeMode, Pagination]}
                        className="subscription-swiper"
                        breakpoints={breakpoints}
                        onSlideChange={handleSlideChange}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                            setIsEnd(swiper.isEnd);
                            setIsBeginning(swiper.isBeginning);
                        }}
                    >

                        {
                            IsLoading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <SwiperSlide key={index}>
                                        <SubscriptionCardSkeleton />
                                    </SwiperSlide>
                                ))
                            )
                                :

                                Subscription.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <SubscriptionCard data={item} handlePurchasePackage={handlePurchasePackage} />
                                    </SwiperSlide>
                                ))
                        }

                    </Swiper>

                    <div className={`pag_leftarrow_cont sub_pagi_leftarrow ${isBeginning ? 'PagArrowdisabled' : ''}`} onClick={swipePrev}>
                        <RiArrowLeftLine size={24} color="white" />
                    </div>
                    <div className={`pag_rightarrow_cont sub_pagi_rightarrow ${isEnd ? 'PagArrowdisabled' : ''}`} onClick={swipeNext} >
                        <RiArrowRightLine size={24} color="white" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Subscription
