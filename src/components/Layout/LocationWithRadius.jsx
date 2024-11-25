import React, { useEffect } from 'react';
import { GoogleMap, Marker, Circle } from '@react-google-maps/api';
import { loadGoogleMaps } from '@/utils';
import { settingsData } from '@/redux/reuducer/settingSlice';
import { useSelector } from 'react-redux';
import { getCityData } from '@/redux/reuducer/locationSlice';

const LocationWithRadius = ({ setPosition, position, setKmRange, getLocationWithMap, KmRange, appliedKilometer }) => {

    const systemSettingsData = useSelector(settingsData)
    const globalPos = useSelector(getCityData)

    const placeHolderPos = {
        lat: globalPos?.lat,
        lng: globalPos?.long
    }

    const settings = systemSettingsData?.data
    const { isLoaded } = loadGoogleMaps();


    useEffect(() => {
        if (window.google && isLoaded) {
            // Initialize any Google Maps API-dependent logic here

        }
    }, [isLoaded]);
    const containerStyle = {
        marginTop: "30px",
        width: '100%',
        height: '400px'
    };

    const latitude = Number(settings?.default_latitude)
    const longitude = Number(settings?.default_longitude)

    const center = {
        lat: position?.lat ? position.lat : latitude,
        lng: position?.lng ? position?.lng : longitude
    };
    const handleMapClick = (event) => {
        const newPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setPosition(newPosition);
        getLocationWithMap(newPosition);
    };


    useEffect(() => {
        setKmRange(appliedKilometer)
    }, [])


    return (
        <>
            {isLoaded &&
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={8}
                    onClick={handleMapClick}
                >
                    {(position?.lat || placeHolderPos.lat) && (
                        <>

                            <Marker
                                position={position?.lat ? position : placeHolderPos}
                                options={{
                                    strokeColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()
                                }}
                            />

                            <Circle
                                center={position?.lat ? position : placeHolderPos}
                                radius={KmRange * 1000} // radius in meters (50km = 50000 meters)
                                options={{
                                    strokeColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    fillColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
                                    fillOpacity: 0.35,
                                }}
                            />
                        </>
                    )}
                </GoogleMap>
            }
        </>
    );
};

export default LocationWithRadius;
