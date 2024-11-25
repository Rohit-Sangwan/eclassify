import React, { useEffect, useState, useRef } from 'react';
import { Modal, Slider } from 'antd';
import { loadGoogleMaps, t } from '@/utils';
import { MdClose } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getKilometerRange, saveCity, setKilometerRange } from '@/redux/reuducer/locationSlice';
import { settingsData } from '@/redux/reuducer/settingSlice';
import LocationWithRadius from '../Layout/LocationWithRadius';


const AddLocation = ({ IsAddLocationModalOpen, OnHide, position, setPosition, selectedCity, setSelectedCity }) => {

    const dispatch = useDispatch()
    const LocationData = useSelector(state => state?.Location?.cityData);
    const { isLoaded } = loadGoogleMaps();
    const router = useRouter();
    const systemSettingsData = useSelector(settingsData);
    const settings = systemSettingsData?.data;
    const [isValidLocation, setIsValidLocation] = useState(false);
    const [KmRange, setKmRange] = useState(0)
    const appliedKilometer = useSelector(getKilometerRange)


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


    const handleUpdateLocation = (e) => {
        e.preventDefault();
        if (selectedCity) {
            if (isValidLocation || (LocationData && LocationData.lat && LocationData.long)) {
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


    return (
        <Modal
            centered
            visible={IsAddLocationModalOpen}
            closeIcon={CloseIcon}
            className="ant_register_modal"
            onCancel={OnHide}
            footer={null}
            maskClosable={false}
        >
            <div className='location_modal'>
                <h5 className='head_loc'>{t('location')}</h5>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <LocationWithRadius KmRange={KmRange} setKmRange={setKmRange} setPosition={setPosition} position={position} getLocationWithMap={getLocationWithMap} appliedKilometer={appliedKilometer} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="range" className='auth_pers_label'>{t('range')}</label>
                        <Slider className='kmRange_slider' value={KmRange || appliedKilometer} tooltip={{ formatter }} onChange={handleRange} />
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

export default AddLocation;
