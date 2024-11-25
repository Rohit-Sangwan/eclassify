'use client'
import React, { useEffect, useState } from 'react';
import MainHeader from './MainHeader';
import Footer from './Footer';
import Loader from '@/components/Loader/Loader';
import { settingsSucess } from '@/redux/reuducer/settingSlice';
import { settingsApi } from '@/utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice';
const PushNotificationLayout = dynamic(() => import('../firebaseNotification/PushNotificationLayout.jsx'), { ssr: false });
import { store } from '@/redux/store';
import ScrollToTopButton from './ScrollToTopButton';
import { saveCity, setIsBrowserSupported } from '@/redux/reuducer/locationSlice';
import { protectedRoutes } from '@/app/routes/routes';
import Swal from 'sweetalert2';
import { IsLandingPageOn, getDefaultLatLong, getPlaceApiKey, isLogin, t } from '@/utils';
import Image from 'next/image';
import UnderMaitenance from '../../../public/assets/something_went_wrong.svg'
import axios from 'axios';

const Layout = ({ children }) => {

    const pathname = usePathname()
    const dispatch = useDispatch();
    const cityData = useSelector(state => state?.Location?.cityData);
    const settingsData = store.getState().Settings?.data
    const router = useRouter();
    const [isLoading, setisLoading] = useState(true);
    const lang = useSelector(CurrentLanguageData);
    const requiresAuth = protectedRoutes.some(route => route.test(pathname));
    const isLandingPage = IsLandingPageOn()



    if (Number(settingsData?.data?.maintenance_mode)) {
        return (
            <div className='underMaitenance'>
                <Image src={UnderMaitenance} height={255} width={255} />
                <p className='maintenance_label'>Our website is currently undergoing maintenance and will be temporarily unavailable.</p>
            </div>
        )
    }

    useEffect(() => {
        handleRouteAccess()
    }, [pathname])

    const handleRouteAccess = () => {
        if (requiresAuth && !isLogin()) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: t("loginFirst"),
                allowOutsideClick: false,
                customClass: {
                    confirmButton: 'Swal-confirm-buttons',
                },

            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/");
                }
            });
        }
    }

    useEffect(() => {
        if (lang && lang.rtl === true) {
            document.documentElement.dir = "rtl";
        } else {
            document.documentElement.dir = "ltr";
        }
    }, [lang]);
    useEffect(() => {
        const getSystemSettings = async () => {
            try {
                const response = await settingsApi.getSettings({
                    type: "" // or remove this line if you don't need to pass the "type" parameter
                });
                const data = response.data;
                dispatch(settingsSucess({ data }));
                setisLoading(false);
                document.documentElement.style.setProperty('--primary-color', data?.data?.web_theme_color);
                requestLocationPermission(); // Request location after settings are loaded

            } catch (error) {
                console.error("Error:", error);
                setisLoading(false);
            }
        };

        getSystemSettings();

    }, []);


    const getLocationWithoutLanding = async (pos) => {

        const placeApiKey = getPlaceApiKey()

        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.latitude},${pos.longitude}&key=${placeApiKey}`);
            const results = response?.data?.results[0];

            // Extract address components
            const addressComponents = results?.address_components;
            const getAddressComponent = (type) => {
                const component = addressComponents?.find(comp => comp.types.includes(type));
                return component ? component?.long_name : '';
            };

            const locationData = {
                lat: pos.latitude,
                long: pos.longitude,
                city: getAddressComponent("locality"),
                state: getAddressComponent("administrative_area_level_1"),
                country: getAddressComponent("country"),
                // address: results?.formatted_address
            };

            saveCity(locationData)
        } catch (error) {
            console.log(error)
        }
    }


    const requestLocationPermission = () => {

        const isLanding = IsLandingPageOn();
        const letLong = getDefaultLatLong()

        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isSafari) {
            dispatch(setIsBrowserSupported(false));
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    if (isLanding === 0) {
                        getLocationWithoutLanding(locationData)
                    }
                },
                (error) => {
                    if (isLanding === 0 && (error.code === 1 || error.code === 2 || error.code === 3)) {
                        getLocationWithoutLanding(letLong)
                    }
                }
            );
            dispatch(setIsBrowserSupported(true));
        } else {
            console.error('Geolocation is not supported by this browser.');
            dispatch(setIsBrowserSupported(false))
        }
    };


    useEffect(() => {
        if (isLandingPage === 1) {
            const isBlogPage = pathname.startsWith('/blogs/');
            const isSellerProfile = pathname.startsWith('/seller/');
            const isProductDetailsPage = pathname.startsWith('/product-details/');
            const isStaticPage = ['/about-us', '/contact-us', '/privacy-policy', '/terms-and-condition'].includes(pathname);
            const hasLocationData = cityData?.city === '' && cityData?.state === '' && cityData?.country === ''
            if (hasLocationData && !isBlogPage && !isProductDetailsPage && !isStaticPage && !isSellerProfile) {
                router.push('/home');
            }
        }
    }, [cityData, pathname, isLandingPage]);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <PushNotificationLayout>
                        <MainHeader />
                        {children}
                        <Footer />
                    </PushNotificationLayout>
                    <ScrollToTopButton />
                </>
            )}
        </>
    );
};

export default Layout;
