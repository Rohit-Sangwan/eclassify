'use client'
import React, { useEffect, useState } from 'react'
import { FeaturedSectionApi, sliderApi } from '@/utils/api'
import { useDispatch, useSelector } from 'react-redux'
import { SliderData, setSlider } from '@/redux/reuducer/sliderSlice'
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice'
import { settingsData } from '@/redux/reuducer/settingSlice'
import FeaturedSectionsSkeleton from '../Skeleton/FeaturedSectionsSkeleton'
import SliderSkeleton from '../Skeleton/Sliderskeleton'
import OfferSlider from './OfferSlider'
import PopularCategories from './PopularCategories'
import FeaturedSections from './FeaturedSections'
import HomeAllItem from './HomeAllItem'
import { getKilometerRange } from '@/redux/reuducer/locationSlice'


const HomePage = () => {

    const dispatch = useDispatch()
    const slider = useSelector(SliderData);
    const KmRange = useSelector(getKilometerRange)
    const [IsLoading, setIsLoading] = useState(false)
    const [IsFeaturedLoading, setIsFeaturedLoading] = useState(false)
    const CurrentLanguage = useSelector(CurrentLanguageData)
    const [featuredData, setFeaturedData] = useState([])
    const systemSettingsData = useSelector(settingsData)
    const settings = systemSettingsData?.data
    const isDemoMode = settings?.demo_mode
    const cityData = useSelector(state => state?.Location?.cityData);


    useEffect(() => {
        const fetchSliderData = async () => {
            try {
                setIsLoading(true)
                const response = await sliderApi.getSlider();
                const data = response.data;
                dispatch(setSlider(data.data))
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false)
            }
        };
        fetchSliderData();
    }, []);

    useEffect(() => {
        const fetchFeaturedSectionData = async () => {
            setIsFeaturedLoading(true)
            try {
                if (isDemoMode) {
                    const response = await FeaturedSectionApi.getFeaturedSections({});
                    const { data } = response.data;
                    setFeaturedData(data);
                } else {
                    const response = await FeaturedSectionApi.getFeaturedSections({ city: cityData?.city, state: cityData?.state, country: cityData?.country});
                    const { data } = response.data;
                    setFeaturedData(data);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsFeaturedLoading(false)
            }
        };
        fetchFeaturedSectionData();
    }, [cityData, CurrentLanguage, KmRange]);

    const allEmpty = featuredData?.every(ele => ele?.section_data.length === 0);

    return (
        <>
            {
                IsLoading ? (<SliderSkeleton />) : (<OfferSlider sliderData={slider} />)
            }
            <PopularCategories />
            {
                IsFeaturedLoading ? (<FeaturedSectionsSkeleton />) : (<FeaturedSections featuredData={featuredData} setFeaturedData={setFeaturedData} cityData={cityData} allEmpty={allEmpty} />)
            }
            <HomeAllItem cityData={cityData} allEmpty={allEmpty} />
        </>
    )
}

export default HomePage
