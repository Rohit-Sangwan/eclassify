import React, { useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { loadGoogleMaps } from '@/utils';
import { settingsData } from '@/redux/reuducer/settingSlice';
import { useSelector } from 'react-redux';

const MapComponent = ({ setPosition, position, getLocationWithMap }) => {

    const systemSettingsData = useSelector(settingsData)
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

    return (
        <>
            {isLoaded &&
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={8}
                    onClick={handleMapClick}
                >
                    {position && (
                        <Marker position={position} />
                    )}
                </GoogleMap>
            }
        </>
    );
};

export default MapComponent;
