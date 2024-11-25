'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import OurBlogCard from '../Cards/OurBlogCard';
import { useEffect, useRef, useState } from 'react';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';
import { getBlogsApi } from '@/utils/api';
import OurBlogCardSkeleton from '../Skeleton/OurBlogCardSkeleton';
import { t } from '@/utils';
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice';
import { useSelector } from 'react-redux';



const OurBlogs = () => {
    const swiperRef = useRef();
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [Blogs, setBlogs] = useState([])
    const [IsLoading, setIsLoading] = useState(false)
    const lang = useSelector(CurrentLanguageData);

    const getBlogsData = async () => {
        try {
            setIsLoading(true)
            const res = await getBlogsApi.getBlogs()
            setBlogs(res?.data?.data?.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getBlogsData()
    }, [])

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.changeLanguageDirection(lang?.rtl === true ? 'rtl' : 'ltr');
        }
    }, [lang?.rtl]);

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
        320: {
            slidesPerView: 2,
            spaceBetween: 10
        },
        576: {
            slidesPerView: 2,
            spaceBetween: 30
        },
        768: {
            slidesPerView: 2,
        },
        992: {
            slidesPerView: 2,
        },
        1200: {
            slidesPerView: 3,
        },
    }


    return (
        Blogs && Blogs.length > 0 &&
        <div className="ourblogs_wrapper" id='ourBlogs'>
            <div className="container">
                <div className="row">
                    <div className="ourblogs">
                        <div className="ourblogs_header">
                            <p className="ourblogs_title">{t('ourBlogs')}</p>
                            <h1 className="Ourblogs_maintitle">
                                {t('masteringMarketplace')}<br />
                                {t('withOurBlog')}
                            </h1>
                        </div>


                        <div className="ourblogs_cards">
                            <Swiper
                                dir={lang && lang?.rtl === true ? 'rtl' : 'ltr'}
                                spaceBetween={lang && lang?.rtl === true ? 30 : 30}
                                slidesPerView={3}
                                onSlideChange={handleSlideChange}
                                onSwiper={(swiper) => {
                                    swiperRef.current = swiper;
                                    setIsEnd(swiper.isEnd);
                                    setIsBeginning(swiper.isBeginning);
                                }}
                                breakpoints={breakpoints}
                            >

                                {
                                    IsLoading ? (
                                        Array.from({ length: 3 }).map((_, index) => (
                                            <SwiperSlide key={index}>
                                                <OurBlogCardSkeleton />
                                            </SwiperSlide>
                                        ))
                                    )
                                        :

                                        Blogs && Blogs?.map((item, index) => (
                                            <SwiperSlide key={index}><OurBlogCard data={item} /></SwiperSlide>
                                        ))
                                }

                            </Swiper>
                            {Blogs && Blogs.length > 0 &&
                                <div className="pagination_arrows">
                                    <button className={`pag_leftarrow_cont ${isBeginning ? 'PagArrowdisabled' : ''}`} onClick={swipePrev}>
                                        <RiArrowLeftLine size={24} color="white" />
                                    </button>
                                    <button className={`pag_rightarrow_cont ${isEnd ? 'PagArrowdisabled' : ''}`} onClick={swipeNext} >
                                        <RiArrowRightLine size={24} color="white" />
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default OurBlogs