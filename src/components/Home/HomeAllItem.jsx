'use client'
import { settingsData } from "@/redux/reuducer/settingSlice";
import { allItemApi } from "@/utils/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import { userSignUpData } from "../../redux/reuducer/authSlice";
import ProductCardSkeleton from "../Skeleton/ProductCardSkeleton.jsx";
import NoData from "../NoDataFound/NoDataFound.jsx";
import ProductCard from "../Cards/ProductCard.jsx";
import { getKilometerRange } from "@/redux/reuducer/locationSlice.js";



const HomeAllItem = ({ cityData, allEmpty }) => {

    const KmRange = useSelector(getKilometerRange)
    const systemSettingsData = useSelector(settingsData)
    const settings = systemSettingsData?.data
    const isDemoMode = settings?.demo_mode
    const userData = useSelector(userSignUpData);
    const [AllItemData, setAllItemData] = useState([])
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const getAllItemData = async () => {
        if (page === 1) {
            setIsLoading(true);
        }
        try {
            const response = await allItemApi.getItems({
                page,
                city: !isDemoMode ? cityData?.city : '',
                state: !isDemoMode ? cityData?.state : '',
                country: !isDemoMode ? cityData?.country : '',
                radius: !isDemoMode ? KmRange : '',
                latitude: !isDemoMode ? cityData.lat : '',
                longitude: !isDemoMode ? cityData.long : '',
            });
            if (response?.data?.data?.data.length > 0) {
                const data = response?.data?.data?.data;
                const currentPage = response?.data?.data?.current_page;
                const lastPage = response?.data?.data?.last_page;
                setAllItemData(prevData => [...prevData, ...data]);
                setHasMore(currentPage < lastPage);
            }
            else {
                setAllItemData([])
            }

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllItemData()
    }, [page, cityData, KmRange])

    const handleLikeAllData = (id) => {
        const updatedItems = AllItemData.map((item) => {
            if (item.id === id) {
                return { ...item, is_liked: !item.is_liked };
            }
            return item;
        });
        setAllItemData(updatedItems);
    }

    const fetchMoreData = () => {
        setPage(prevPage => prevPage + 1);
    };

    const AllItemLoader = () => {
        return <div className="loader p-5"></div>
    }




    return (
        <div className="container">

            {
                isLoading ? (
                    <div className="row top_spacing product_card_card_gap">
                        {[...Array(8)].map((_, index) => (
                            <div className="col-xxl-3 col-lg-4 col-md-6 col-6" key={index}>
                                <ProductCardSkeleton />
                            </div>
                        ))}
                    </div>
                )
                    :
                    (
                        AllItemData.length > 0 ? (
                            <InfiniteScroll
                                dataLength={AllItemData.length}
                                next={fetchMoreData}
                                hasMore={hasMore}
                                loader={<AllItemLoader />}
                            >
                                <div className={`row product_card_card_gap ${!allEmpty && 'top_spacing'}`}>
                                    {AllItemData.map((data, index) => (
                                        <div className="col-xxl-3 col-lg-4 col-md-6 col-6 product_card_card_gap" key={index}>
                                            <Link href={userData?.id === data?.user_id ? `/my-listing/${data?.slug}` : `/product-details/${data.slug}`} prefetch={false}>

                                                {isLoading ? (
                                                    <ProductCardSkeleton /> // Show skeleton while loading
                                                ) : (
                                                    <ProductCard data={data} handleLike={handleLikeAllData} /> // Show product card when loaded
                                                )}

                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </InfiniteScroll>
                        ) :
                            (
                                allEmpty && AllItemData.length === 0 && <NoData />
                            )
                    )}
        </div>
    )
}

export default HomeAllItem