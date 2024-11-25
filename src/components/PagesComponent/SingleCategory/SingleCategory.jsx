'use client'
// import TopAd from "@/components/Advertisements/TopAd"
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent"
import ProdcutHorizontalCard from "@/components/Cards/ProdcutHorizontalCard"
import ProductCard from "@/components/Cards/ProductCard"
import FilterCard from "@/components/ProductPageUI/FilterCard"
import { useEffect, useState } from "react"
import { IoCloseCircle, IoGrid } from "react-icons/io5"
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { Select, MenuItem } from '@mui/material';
import { allItemApi, getCustomFieldsApi} from "@/utils/api"
import ProductHorizontalCardSkeleton from "@/components/Skeleton/ProductHorizontalCardSkeleton"
import ProductCardSkeleton from "@/components/Skeleton/ProductCardSkeleton"
import NoData from "@/components/NoDataFound/NoDataFound"
import { t } from "@/utils"
import { useDispatch, useSelector } from "react-redux"
import { BreadcrumbPathData } from "@/redux/reuducer/breadCrumbSlice"
import { SearchData } from "@/redux/reuducer/searchSlice"
import Link from "next/link"
import { userSignUpData } from "@/redux/reuducer/authSlice"
import { CatItems, SingleCurrentPage, SingleLastPage, ViewCategory, setCategoryView, setSingleCatCurrentPage, setSingleCatItem, setSingleCatLastPage } from "@/redux/reuducer/categorySlice"
import { getCityData } from "@/redux/reuducer/locationSlice"


const SingleCategory = ({ slug }) => {

    const { lat, long } = useSelector(getCityData)
    const dispatch = useDispatch()
    const BreadcrumbPath = useSelector(BreadcrumbPathData)
    const catId = slug[0];
    const userData = useSelector(userSignUpData);
    const SingleCatItem = useSelector(CatItems)
    const currentPage = useSelector(SingleCurrentPage)
    const lastPage = useSelector(SingleLastPage)
    const search = useSelector(SearchData)
    const [sortBy, setSortBy] = useState('new-to-old');
    const view = useSelector(ViewCategory)
    const [IsLoading, setIsLoading] = useState(false)
    const [selectedLocationKey, setSelectedLocationKey] = useState([])
    const [MinMaxPrice, setMinMaxPrice] = useState({
        min_price: '',
        max_price: '',
    })
    const [Country, setCountry] = useState('')
    const [State, setState] = useState('')
    const [City, setCity] = useState('')
    const [Area, setArea] = useState('')
    const [IsShowBudget, setIsShowBudget] = useState(false)
    const [DatePosted, setDatePosted] = useState('')
    const [IsFetchSingleCatItem, setIsFetchSingleCatItem] = useState(false)
    const [Title, setTitle] = useState('')
    const [KmRange, setKmRange] = useState(0)
    const [categoryIds, setCategoryIds] = useState('')
    const [CustomFields, setCustomFields] = useState([])
    const [ExtraDetails, setExtraDetails] = useState({})
    const [IsShowExtraDet, setIsShowExtraDet] = useState(false)
    const [IsShowKmRange, setIsShowKmRange] = useState(false)
    const [IsLoadMore, setIsLoadMore] = useState(false)

    const getSingleCatItem = async (page) => {
        let data = "";
        try {
            const params = {
                sort_by: sortBy,
                min_price: MinMaxPrice?.min_price,
                max_price: MinMaxPrice?.max_price,
                country: Country,
                state: State,
                city: City,
                area_id: Area?.id,
                posted_since: DatePosted,
                page,
                category_slug: catId,
                custom_fileds: ExtraDetails,
            };

            // Conditionally add latitude, longitude, and radius if IsShowKmRange is true
            if (IsShowKmRange) {
                params.latitude = lat;
                params.longitude = long;
                params.radius = KmRange;
            }

            if (search !== "") {
                params.search = search;
            }

    
            if (page === 1) {
                setIsLoading(true);
            }
            const res = await allItemApi.getItems(params);
            data = res?.data;
            if (data.error !== true) {
                if (page > 1) {
                    dispatch(setSingleCatItem([...SingleCatItem, ...data?.data?.data]));
                } else {
                    dispatch(setSingleCatItem(data?.data?.data));
                }
                dispatch(setSingleCatCurrentPage(data?.data?.current_page));
                dispatch(setSingleCatLastPage(data?.data?.last_page));
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false);
            setIsLoadMore(false)
        }
    }


    const getCustomFieldsData = async () => {
        try {
            const res = await getCustomFieldsApi.getCustomFields({ category_ids: categoryIds })
            const data = res?.data?.data
            setCustomFields(data)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (categoryIds) {
            getCustomFieldsData()
        }
    }, [categoryIds])


    useEffect(() => {
        getSingleCatItem(1)
    }, [slug, sortBy, IsFetchSingleCatItem, search])

    useEffect(() => {
        if (BreadcrumbPath?.length === 2) {
            setTitle(BreadcrumbPath[1]?.name)
        }
        else if (BreadcrumbPath?.length > 2) {
            setTitle(`${BreadcrumbPath[BreadcrumbPath.length - 1]?.name} in ${BreadcrumbPath[BreadcrumbPath.length - 2]?.name}`)
        }
    }, [BreadcrumbPath])


    const handleChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleGridClick = (viewType) => {
        dispatch(setCategoryView(viewType))
    };

    const clearLocation = () => {
        setCountry('')
        setState('')
        setCity('')
        setArea('')
        setSelectedLocationKey([])
        setIsFetchSingleCatItem((prev) => !prev)
    }

    const clearBudget = () => {
        setIsShowBudget(false)
        setMinMaxPrice({
            min_price: '',
            max_price: '',
        })
        setIsFetchSingleCatItem((prev) => !prev)
    }

    const clearDatePosted = () => {
        setDatePosted('');
        setIsFetchSingleCatItem((prev) => !prev)
    }

    const clearAll = () => {
        setSelectedLocationKey([]);
        setCountry('');
        setState('');
        setCity('');
        setArea('')
        setMinMaxPrice({
            min_price: '',
            max_price: '',
        });
        setIsShowBudget(false);
        setIsShowExtraDet(false)
        setIsShowKmRange(false)
        setExtraDetails({})
        setSortBy('new-to-old');
        setDatePosted('');
        setKmRange(0)
        setIsFetchSingleCatItem((prev) => !prev);
    };

    const postedSince = DatePosted === 'all-time' ? t('allTime') :
        DatePosted === 'today' ? t('today') :
            DatePosted === 'within-1-week' ? t('within1Week') :
                DatePosted === 'within-2-week' ? t('within2Weeks') :
                    DatePosted === 'within-1-month' ? t('within1Month') :
                        DatePosted === 'within-3-month' ? t('within3Months') : '';

    const isClearAll = selectedLocationKey.length === 0 && !IsShowBudget && DatePosted === '' && sortBy === 'new-to-old' && !IsShowExtraDet && !IsShowKmRange

    const handleLoadMore = () => {
        setIsLoadMore(true)
        getSingleCatItem(currentPage + 1);
    };

    const handleLike = (id) => {
        const updatedItems = SingleCatItem.map((item) => {
            if (item.id === id) {
                return { ...item, is_liked: !item.is_liked };
            }
            return item;
        });
        dispatch(setSingleCatItem(updatedItems))
    }

    const getExtraDetailNameById = (id) => {
        const field = CustomFields.find(field => field.id === Number(id));

        return field ? field.name : '';
    };

    const clearExtraDetails = (id) => {
        setExtraDetails((prevDetails) => {
            const newDetails = { ...prevDetails };
            delete newDetails[id];

            if (Object.keys(newDetails).length === 0) {
                setIsShowExtraDet(false);
                return {}; // Hide extra details if empty
            }

            return newDetails;
        });
        setIsFetchSingleCatItem((prev) => !prev)
    };

    const clearKmRange = () => {
        setKmRange(0)
        setIsShowKmRange(false)
        setIsFetchSingleCatItem((prev) => !prev)
    }



    return (
        <>
            <BreadcrumbComponent />
            <section className='all_products_page'>
                <div className="container">
                    {/* <TopAd /> */}

                    <div className="all_products_page_main_content">
                        <div className="heading">
                            <h3>{Title}</h3>
                        </div>
                        <div className="row" id='main_row'>
                            <div className="col-12 col-md-6 col-lg-3" id='filter_sec'>
                                <FilterCard slug={slug[0]} MinMaxPrice={MinMaxPrice} setMinMaxPrice={setMinMaxPrice} setIsFetchSingleCatItem={setIsFetchSingleCatItem} setCountry={setCountry} setState={setState} setCity={setCity} setArea={setArea} selectedLocationKey={selectedLocationKey} setSelectedLocationKey={setSelectedLocationKey} setIsShowBudget={setIsShowBudget} DatePosted={DatePosted} setDatePosted={setDatePosted} IsShowBudget={IsShowBudget} setKmRange={setKmRange} setCategoryIds={setCategoryIds} CustomFields={CustomFields} ExtraDetails={ExtraDetails} setExtraDetails={setExtraDetails} setIsShowExtraDet={setIsShowExtraDet} setIsShowKmRange={setIsShowKmRange} KmRange={KmRange} />
                            </div>
                            <div className="col-12 col-md-6 col-lg-9" id='listing_sec'>
                                <div className="sortby_header">
                                    <div className="sortby_dropdown">
                                        <div className="sort_by_label">
                                            <span><CgArrowsExchangeAltV size={25} /></span>
                                            <span>{t('sortBy')}</span>
                                        </div>

                                        <Select
                                            value={sortBy}
                                            onChange={handleChange}
                                            variant="outlined"
                                            className="product_filter"
                                        >
                                            <MenuItem value="new-to-old">{t('newestToOldest')}</MenuItem>
                                            <MenuItem value="old-to-new">{t('oldestToNewest')}</MenuItem>
                                            <MenuItem value="price-high-to-low">{t('priceHighToLow')}</MenuItem>
                                            <MenuItem value="price-low-to-high">{t('priceLowToHigh')}</MenuItem>
                                            <MenuItem value="popular_items">{t('popular')}</MenuItem>
                                        </Select>
                                    </div>
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
                                <div className="filter_header">
                                    <div className="filterList">

                                        {
                                            (Country || State || City || Area) &&
                                            <div className="filter_item">
                                                <span>{t('location')}: {Country ? Country : State ? State : City ? City : Area.title}</span>
                                                <button onClick={clearLocation}>
                                                    <IoCloseCircle size={24} />
                                                </button>
                                            </div>
                                        }

                                        {
                                            IsShowBudget && (
                                                <div className="filter_item">
                                                    <span>{t('budget')}: {MinMaxPrice.min_price}-{MinMaxPrice.max_price}</span>
                                                    <button onClick={clearBudget}>
                                                        <IoCloseCircle size={24} />
                                                    </button>
                                                </div>
                                            )
                                        }
                                        {
                                            DatePosted &&
                                            <div className="filter_item">
                                                <span>{postedSince}</span>
                                                <button onClick={clearDatePosted}>
                                                    <IoCloseCircle size={24} />
                                                </button>
                                            </div>
                                        }
                                        {
                                            IsShowKmRange &&
                                            <div className="filter_item">
                                                <span>{t("nearByKmRange")} : {KmRange} {t("km")}</span>
                                                <button onClick={clearKmRange}>
                                                    <IoCloseCircle size={24} />
                                                </button>
                                            </div>
                                        }



                                        {IsShowExtraDet &&
                                            Object.entries(ExtraDetails)
                                                .filter(([id, value]) => value !== null && value !== undefined && value !== '')
                                                .map(([id, value]) => (
                                                    <div className="filter_item" key={id}>
                                                        <span>{getExtraDetailNameById(id)}: {Array.isArray(value) ? value.join(', ') : value}</span>
                                                        <button onClick={() => clearExtraDetails(id)}>
                                                            <IoCloseCircle size={24} />
                                                        </button>
                                                    </div>
                                                ))
                                        }

                                    </div>

                                    {
                                        !isClearAll &&
                                        <div className="removeAll">
                                            <button onClick={clearAll}>{t('clearAll')}</button>
                                        </div>
                                    }


                                </div>
                                <div className="listing_items">
                                    <div className="row">
                                        {
                                            IsLoading ?

                                                Array.from({ length: 12 })?.map((_, index) => (
                                                    view === "list" ? (
                                                        <div className="col-12" key={index}>
                                                            <ProductHorizontalCardSkeleton />
                                                        </div>
                                                    ) : (
                                                        <div className="col-xxl-3 col-lg-4 col-6" key={index}>
                                                            <ProductCardSkeleton />
                                                        </div>
                                                    )
                                                ))

                                                :

                                                SingleCatItem && SingleCatItem.length > 0 ?

                                                    SingleCatItem?.map((item, index) => (
                                                        view === "list" ? (
                                                            <div className="col-12" key={index}>
                                                                <Link href={userData?.id == item?.user_id ? `/my-listing/${item?.slug}` : `/product-details/${item.slug}`} prefetch={false}>
                                                                    <ProdcutHorizontalCard data={item} handleLike={handleLike} />
                                                                </Link>
                                                            </div>
                                                        ) : (

                                                            <div className="col-xxl-3 col-lg-4 col-6" key={index}>
                                                                <Link href={userData?.id == item?.user_id ? `/my-listing/${item?.slug}` : `/product-details/${item.slug}`} prefetch={false}>
                                                                    <ProductCard data={item} handleLike={handleLike} />
                                                                </Link>
                                                            </div>
                                                        )
                                                    ))
                                                    :
                                                    <NoData />
                                        }

                                    </div>
                                    {
                                        IsLoadMore ?
                                            <div className="loader adListingLoader"></div>
                                            :
                                            currentPage < lastPage && SingleCatItem && SingleCatItem.length > 0 && (
                                                <div className="loadMore">
                                                    <button onClick={handleLoadMore}> {t('loadMore')} </button>
                                                </div>
                                            )
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

export default SingleCategory