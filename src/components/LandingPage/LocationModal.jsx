import React, { useEffect, useState, useRef } from 'react';
import { Modal, Slider } from 'antd';
import { loadGoogleMaps, t } from '@/utils';
import { MdClose } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { BiCurrentLocation } from 'react-icons/bi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getKilometerRange, saveCity, setKilometerRange } from '@/redux/reuducer/locationSlice';
import { settingsData } from '@/redux/reuducer/settingSlice';
import LocationWithRadius from '../Layout/LocationWithRadius';


const LocationModal = ({ IsLocationModalOpen, OnHide }) => {

    const dispatch = useDispatch()
    const cityData = useSelector(state => state?.Location?.cityData);
    const lat = cityData?.lat
    const lng = cityData?.long
    const { isLoaded } = loadGoogleMaps();
    const [googleMaps, setGoogleMaps] = useState(null);
    const router = useRouter();
    const systemSettingsData = useSelector(settingsData);
    const settings = systemSettingsData?.data;
    const searchBoxRef = useRef(null);
    const [isValidLocation, setIsValidLocation] = useState(false);
    const [selectedCity, setSelectedCity] = useState(cityData);
    const [KmRange, setKmRange] = useState(0)
    const [position, setPosition] = useState({ lat, lng });
    const appliedKilometer = useSelector(getKilometerRange)


    useEffect(() => {
        if (IsLocationModalOpen) {
            setSelectedCity(cityData)
        }
    }, [IsLocationModalOpen])


    useEffect(() => {
        if (isLoaded) {
            setGoogleMaps(window.google);
        }
    }, [isLoaded]);

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
            const newPosition = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            }

            getLocationWithMap(newPosition)
            setPosition(newPosition)
            setSelectedCity(cityData);
            setIsValidLocation(true);
        } else {
            setIsValidLocation(false);
        }
    };
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
                        const cityData = {
                            lat: locationData.latitude,
                            long: locationData.longitude,
                            city: results.address_components.find(comp => comp.types.includes("locality")).long_name,
                            state: results.address_components.find(comp => comp.types.includes("administrative_area_level_1")).long_name,
                            country: results.address_components.find(comp => comp.types.includes("country")).long_name,
                            formattedAddress: results.formatted_address
                        };
                        setPosition({
                            lat: locationData.latitude,
                            lng: locationData.longitude
                        })
                        saveCity(cityData);
                        setSelectedCity(cityData);
                        OnHide();
                        router.push('/');
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

    const getLocationWithMap = async (pos) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.lat},${pos.lng}&key=${settings?.place_api_key}`);
            const results = response.data.results[0];

            // Extract address components
            const addressComponents = results.address_components;
            const getAddressComponent = (type) => {
                const component = addressComponents.find(comp => comp.types.includes(type));
                return component ? component.long_name : '';
            };

            const locationData = {
                lat: pos.lat,
                long: pos.lng,
                city: getAddressComponent("locality"),
                state: getAddressComponent("administrative_area_level_1"),
                country: getAddressComponent("country"),
                formatted_address: results.formatted_address
            };
            setSelectedCity(locationData);
            setIsValidLocation(true);
        } catch (error) {
            console.error('Error fetching location data:', error);
        }
    }


    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>;

    useEffect(() => {
        if (window.google && isLoaded) {
            // Initialize any Google Maps API-dependent logic here
        }
    }, [isLoaded]);

    const handleSearch = (value) => {
        setSelectedCity({ city: value });
        setIsValidLocation(false);
    };
    const handleUpdateLocation = (e) => {
        e.preventDefault();
        if (selectedCity) {
            
            if (isValidLocation || (cityData && cityData.lat && cityData.long)) {
                dispatch(setKilometerRange(KmRange))
                saveCity(selectedCity);
                router.push('/');
                OnHide();
            } else {
                toast.error("Please Select valid location")
            }
        } else {
            toast.error(t('pleaseSelectCity'));
        }
    };


    const handleRange = (range) => {
        setKmRange(range)
    }

    const formatter = (value) => `${value}KM`;

    useEffect(() => {
        setKmRange(appliedKilometer)
    }, [])

    return (
        <Modal
            centered
            visible={IsLocationModalOpen}
            closeIcon={CloseIcon}
            className="ant_register_modal"
            onCancel={OnHide}
            footer={null}
            maskClosable={false}
        >
            <div className='location_modal'>
                <h5 className='head_loc'>{selectedCity ? t('editLocation') : t('addLocation')}</h5>
                <div className="card">
                    <div className="card-body">
                        <div className="location_city">
                            <div className="row loc_input gx-0">
                                <div className="col-8">

                                    {isLoaded && googleMaps && (
                                        <StandaloneSearchBox
                                            onLoad={ref => (searchBoxRef.current = ref)}
                                            onPlacesChanged={handlePlacesChanged}
                                        >

                                            <input
                                                type="text"
                                                placeholder={t('selectLocation')}
                                                value={selectedCity?.formatted_address || selectedCity?.formattedAddress}
                                                onChange={(e) => handleSearch(e.target.value)}
                                            />
                                        </StandaloneSearchBox>
                                    )}

                                </div>
                                <div className="col-4">
                                    <div className="useCurrentLocation">
                                        <button onClick={getCurrentLocation}>
                                            <span>
                                                <BiCurrentLocation size={22} />
                                            </span>
                                            <span className='curr_loc'>
                                                {t('currentLocation')}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <LocationWithRadius KmRange={KmRange} setKmRange={setKmRange} setPosition={setPosition} position={position} getLocationWithMap={getLocationWithMap} appliedKilometer={appliedKilometer} />
                                </div>
                            </div>
                        </div>
                    </div>


                    <div>
                        <label htmlFor="range" className='auth_pers_label'>{t('range')}</label>
                        <Slider className='kmRange_slider' value={KmRange} tooltip={{ formatter, ...(KmRange !== 0 ? { open: true } : { open: false }) }} onChange={handleRange} />
                    </div>

                    <div className="card-footer">
                        <button onClick={handleUpdateLocation}>
                            {t('save')}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default LocationModal;
