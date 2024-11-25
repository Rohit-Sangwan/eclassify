"use client"
import React, { useEffect, useState } from "react";
import { FeaturedSectionApi, allItemApi } from "@/utils/api";
import ProductCardSkeleton from "@/components/Skeleton/ProductCardSkeleton";
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import ProductHorizontalCardSkeleton from "@/components/Skeleton/ProductHorizontalCardSkeleton";
import ProdcutHorizontalCard from "@/components/Cards/ProdcutHorizontalCard";
import ProductCard from "@/components/Cards/ProductCard";
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent";
import NoData from "@/components/NoDataFound/NoDataFound";
import { setBreadcrumbPath } from "@/redux/reuducer/breadCrumbSlice";
import { useDispatch, useSelector } from "react-redux";
import { t } from "@/utils";
import { IoGrid } from "react-icons/io5"
import Link from "next/link";
import { userSignUpData } from "@/redux/reuducer/authSlice"
import { CurrentLanguageData } from "@/redux/reuducer/languageSlice";


const FeaturedViewAll = ({ slug }) => {

    const dispatch = useDispatch()
    const userData = useSelector(userSignUpData)
    const CurrentLanguage = useSelector(CurrentLanguageData)
    const [featuredTitle, setFeaturedTitle] = useState("");
    const [view, setView] = useState('grid');
    const [isLoading, setIsLoading] = useState(true);
    const [itemsData, setItemsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [IsItemsLoadMore, setIsItemsLoadMore] = useState(false)

    const handleGridClick = (viewType) => {
        setView(viewType);
    };

    const fetchFeaturedSectionData = async () => {
        try {
            const response = await FeaturedSectionApi.getFeaturedSections({ slug: slug });
            const { data } = response.data;
            const featureSectionData = data?.[0];
            setFeaturedTitle(featureSectionData?.title);
            dispatch(setBreadcrumbPath([featureSectionData?.title]))

        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {
        if (slug) {
            fetchFeaturedSectionData();
        }
    }, [slug, CurrentLanguage]);

    // Ad a function or track the like and dislike and update UI according


    const fetchItemsData = async (page) => {
        try {
            if(page === 1){
                setIsLoading(true);
            }
            const response = await allItemApi.getItems({
                featured_section_slug: slug,
                page: page,
            });
            const responseData = response?.data;
            if (responseData) {

                const { data } = responseData;
                if (page === 1) {
                    // If it's the first page, replace the data
                    setItemsData(data ? data?.data : []);
                } else {
                    // If it's not the first page, append the data
                    setItemsData(prevItems => [...prevItems, ...(data ? data.data : [])]);
                }
                setCurrentPage(data.current_page);
                setLastPage(data.last_page);
            } else {
                console.error("Invalid response:", response);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false); // Set loading to false after data is fetched
            setIsItemsLoadMore(false)
        }
    };
    useEffect(() => {
        fetchItemsData(1);
    }, [slug]);

    const handleLoadMore = () => {
        setIsItemsLoadMore(true)
        fetchItemsData(currentPage + 1); // Pass current sorting option
    };


    const handleLike = (id) => {
        const updatedItems = itemsData.map((item) => {
            if (item.id === id) {
                return { ...item, is_liked: !item.is_liked };
            }
            return item;
        });
        setItemsData(updatedItems);
    }

    const handleBreadcrumbPath = (ele) => {

        dispatch(setBreadcrumbPath([{
            name: featuredTitle,
            slug: `/featured-sections/${slug}`
        }, {
            name: ele?.name
        }]))
    }


    return (
        <>
            <BreadcrumbComponent title2={featuredTitle} />
            <section className='all_products_page'>
                <div className="container">
                    <div className="all_products_page_main_content">

                        <div className="row" id='main_row'>
                            <div className="col-12 col-md-6 col-lg-12" id='listing_sec'>
                                <div className="heading">
                                    <div className="title">
                                        <h3>{featuredTitle}</h3>
                                    </div>
                                    <div className="sortby_header">
                                        <div className="gird_buttons">
                                            <button
                                                className={view === 'list' ? 'active' : 'deactive'}
                                                onClick={() => handleGridClick('list')}
                                            >
                                                <ViewStreamIcon size={24} />
                                            </button>
                                            <button
                                                className={view === 'grid' ? 'active' : 'deactive'}
                                                onClick={() => handleGridClick('grid')}
                                            >
                                                <IoGrid size={24} />
                                            </button>
                                        </div>
                                    </div>

                                </div>
                                <div className="listing_items">
                                    <div className="row">
                                        {isLoading ?
                                            view === "list" ?
                                                Array.from({ length: 4 }).map((_, index) => (
                                                    <div className="col-12" key={index}>
                                                        <ProductHorizontalCardSkeleton />
                                                    </div>
                                                ))
                                                :
                                                Array.from({ length: 4 }).map((_, index) => (
                                                    <div className="col-xxl-3 col-lg-4 col-6" key={index}>
                                                        <ProductCardSkeleton />
                                                    </div>
                                                ))

                                            : itemsData && itemsData.length === 0 ?
                                                <NoData />
                                                : view === "list" ?
                                                    itemsData && itemsData.map((ele, index) => (
                                                        <div className="col-12" key={index}>
                                                            <Link onClick={() => handleBreadcrumbPath(ele)} href={ele?.user_id == userData?.id ? `/my-listing/${ele?.slug}` : `/product-details/${ele?.slug}`}>
                                                                <ProdcutHorizontalCard data={ele} handleLike={handleLike} />
                                                            </Link>
                                                        </div>

                                                    ))
                                                    :
                                                    itemsData && itemsData.map((ele, index) => (
                                                        <div className="col-xxl-3 col-lg-4 col-6" key={index}>
                                                            <Link onClick={() => handleBreadcrumbPath(ele)} href={ele?.user_id == userData?.id ? `/my-listing/${ele?.slug}` : `/product-details/${ele?.slug}`}>
                                                                <ProductCard data={ele} handleLike={handleLike} />
                                                            </Link>
                                                        </div>

                                                    ))
                                        }
                                    </div>
                                    {
                                        IsItemsLoadMore ?
                                            <div className="loader adListingLoader"></div>
                                            :
                                            currentPage < lastPage && itemsData && itemsData.length > 0 &&
                                            <div className="loadMore">
                                                <button onClick={handleLoadMore}>{t('loadMore')}</button>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default FeaturedViewAll;
