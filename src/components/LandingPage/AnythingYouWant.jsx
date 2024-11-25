'use client'
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Img1 from "../../../public/assets/Image1.svg";
import Img2 from "../../../public/assets/Image2.svg";
import Img3 from "../../../public/assets/Image3.svg";
import Img4 from "../../../public/assets/Image4.svg";
import Img5 from "../../../public/assets/Image5.svg";
import Img6 from "../../../public/assets/Image6.svg";
import { SlLocationPin } from "react-icons/sl";
import { FaLocationCrosshairs } from 'react-icons/fa6';
import { IoSearchOutline } from "react-icons/io5";
import { loadGoogleMaps, placeholderImage, t } from '@/utils';
import toast from 'react-hot-toast';
import { getIsBrowserSupported, saveCity } from '@/redux/reuducer/locationSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { settingsData } from '@/redux/reuducer/settingSlice';
import { useSelector } from 'react-redux';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice';
import AddLocation from './AddLocation';



const AnythingYouWant = () => {

    const { isLoaded } = loadGoogleMaps();
    useEffect(() => {
        if (window.google && isLoaded) {
            // Initialize any Google Maps API-dependent logic here
        }
    }, [isLoaded]);
    const router = useRouter();
    const CurrentLanguage = useSelector(CurrentLanguageData)
    const LocationData = useSelector(state => state?.Location?.cityData);
    const lat = LocationData?.lat
    const lng = LocationData?.long
    const [position, setPosition] = useState({ lat, lng });
    const systemSettingsData = useSelector(settingsData);
    const settings = systemSettingsData?.data;
    const searchBoxRef = useRef(null);
    const [selectedCity, setSelectedCity] = useState(LocationData);
    const [isValidLocation, setIsValidLocation] = useState(false);
    const IsBrowserSupported = useSelector(getIsBrowserSupported)
    const [IsAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);


    const getCurrentLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const locationData = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        };
                        
                        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationData.latitude},${locationData.longitude}&key=${settings?.place_api_key}`);
                        const results = response.data.results[0];

                        if (response.data.error_message) {
                            toast.error(response.data.error_message)
                        }

                        const cityData = {
                            lat: locationData.latitude,
                            long: locationData.longitude,
                            city: results.address_components.find(comp => comp.types.includes("locality")).long_name,
                            state: results.address_components.find(comp => comp.types.includes("administrative_area_level_1")).long_name,
                            country: results.address_components.find(comp => comp.types.includes("country")).long_name
                        };

                        setPosition({ lat: locationData.latitude, lng: locationData.longitude })
                        setSelectedCity(cityData);
                        saveCity(cityData);
                        setIsAddLocationModalOpen(true)
                    } catch (error) {
                        console.error('Error fetching location data:', error);
                    }
                },
                (error) => {
                    toast.error(t('locationNotGranted'));
                }
            );
        } else {
            toast.error(t('geoLocationNotSupported'));
        }
    };

    const handleLocateMe = () => {

    }

    // AIzaSyAravivpxM8-uc_PTmb2reJ4bwGCc6J3Ik

    const handlePlacesChanged = () => {
        const places = searchBoxRef.current.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            const cityData = {
                lat: place.geometry.location.lat(),
                long: place.geometry.location.lng(),
                city: place.address_components.find(comp => comp.types.includes("locality"))?.long_name,
                state: place.address_components.find(comp => comp.types.includes("administrative_area_level_1"))?.long_name,
                country: place.address_components.find(comp => comp.types.includes("country"))?.long_name
            };
            saveCity(cityData);
            setSelectedCity(cityData);
            setIsValidLocation(true);
        } else {
            setIsValidLocation(false);
        }
    };

    const handleInputChange = () => {
        setIsValidLocation(false);
    };
    const handleSearchLocation = (e) => {
        e.preventDefault();
        if (selectedCity) {
            if (isValidLocation) {
                saveCity(selectedCity);
                router.push('/');
            } else {
                toast.error("Please select valid location")
            }
        } else {
            toast.error(t('pleaseSelectCity'));
        }
    };

    useEffect(() => {
    }, [selectedCity])

    return (
        <>
            <section id='anything_you_want'>
                <div className="container">
                    <div className="main_wrapper">
                        <div className="left_side_images">
                            <Image src={Img1} className="upper_img" height={0} width={0} alt='' loading='lazy' onErrorCapture={placeholderImage} />
                            <Image src={Img2} className="center_img" height={0} width={0} alt='' loading='lazy' onErrorCapture={placeholderImage} />
                            <Image src={Img3} className="down_img" height={0} width={0} alt='' loading='lazy' onErrorCapture={placeholderImage} />
                        </div>
                        <div className="center_content">
                            <div className="main_heading">
                                <h1>{t('buySell')} </h1>
                                <h1>{t('anythingYouWant')}</h1>
                            </div>
                            <div className="main_decs">
                                <p>{t('discoverEndlessPossibilitiesAt')} {""} {settings?.company_name} {""} {t('goToMarketplace')}</p>
                            </div>
                            <div className="search_main_div">
                                <div className='right_input'>
                                    <SlLocationPin size={22} />
                                    {isLoaded &&
                                        <StandaloneSearchBox
                                            onLoad={ref => (searchBoxRef.current = ref)}
                                            onPlacesChanged={handlePlacesChanged}
                                        >
                                            <input
                                                type="text"
                                                placeholder={t('selectLocation')}
                                                onChange={handleInputChange}
                                            />
                                        </StandaloneSearchBox>
                                    }
                                </div>
                                <div className='left_buttons'>

                                    {
                                        IsBrowserSupported && <button className='locate_me mx-2' onClick={getCurrentLocation} >
                                            <FaLocationCrosshairs size={22} />
                                            <span>{t('locateMe')}</span>
                                        </button>
                                    }


                                    <button
                                        className='serach'
                                        onClick={handleSearchLocation}
                                    // disabled={!isValidLocation}
                                    // style={{ cursor: isValidLocation ? "pointer" : "not-allowed", opacity: isValidLocation ? 1 : 0.5 }}
                                    >
                                        <IoSearchOutline size={22} />
                                        <span>{t('search')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="right_side_images">
                            <Image src={Img4} className="upper_img" height={0} width={0} alt='' loading='lazy' onErrorCapture={placeholderImage} />
                            <Image src={Img5} className="center_img" height={0} width={0} alt='' loading='lazy' onErrorCapture={placeholderImage} />
                            <Image src={Img6} className="down_img" height={0} width={0} alt='' loading='lazy' onErrorCapture={placeholderImage} />
                        </div>
                    </div>
                </div>
            </section>
            <AddLocation IsAddLocationModalOpen={IsAddLocationModalOpen} OnHide={() => setIsAddLocationModalOpen(false)} position={position} setPosition={setPosition} selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
        </>
    );
};

export default AnythingYouWant;
