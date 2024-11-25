import MapComponent from '@/components/MyListing/MapComponent';
import { getIsBrowserSupported } from '@/redux/reuducer/locationSlice';
import { t } from '@/utils';
import { Select } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';

const ContentFive = ({ getCurrentLocation, Countries, setSelectedCountry, setSelectedState, States, setCountrySearch, setStateSearch, Cities, setCitySearch, setSelectedCity, handleGoBack, setActiveLocation, ActiveLocation, Location, handleFullSubmission, position, setPosition, getLocationWithMap, setAreaSearch, Area, setSelectedArea, LocationByMap, SelectedCountry, SelectedState, setAddress, Address, SelectedCity, isAdPlaced }) => {

    const IsBrowserSupported = useSelector(getIsBrowserSupported)

    const handleCountryChange = (value) => {
        if (value.value === 'loadMore') {
            handleLoadMore();
        } else {
            const Country = Countries.find(country => country.name === value?.label);
            setSelectedCountry(Country);
        }
    }

    const handleStateChange = (value) => {
        const State = States.find(country => country.name === value?.label);
        setSelectedState(State);
    }
    const handleCityChange = (value) => {
        const City = Cities.find(city => city.name === value?.label);
        setSelectedCity(City);
    }
    const handleAreaChange = (value) => {
        const chosenArea = Area.find(item => item.name === value?.label);
        setSelectedArea(chosenArea);
    }

    const handleCountrySearch = (value) => {
        setCountrySearch(value);
    };
    const handleStateSearch = (value) => {
        setStateSearch(value);
    };
    const handleCitySearch = (value) => {
        setCitySearch(value);
    };
    const handleAreaSearch = (value) => {
        setAreaSearch(value);
    };

    const handleSelectManually = () => {
        setActiveLocation('manually')
    }

    const handleSelectMap = () => {
        setActiveLocation('map')
    }

    const handleAddressChange = (e) => {
        setAddress(e.target.value)
    }

    const isLocation = Location?.city && Location?.country && Location?.state && Location?.lat && Location?.long;
    const isLocationByMap = LocationByMap.country && LocationByMap.state && LocationByMap.city && LocationByMap.address;

    return (
        <>
            <div className="col-12">
                <div className='extra_det_loc_cont'>
                    <button className={`select_manually ${ActiveLocation === 'manually' && 'active_bg'}`} onClick={handleSelectManually}>{t('manually')}</button>

                    {
                        IsBrowserSupported &&
                        <button className={`select_manually ${ActiveLocation === 'locate' && 'active_bg'}`} onClick={getCurrentLocation} >
                            {t('locateMe')}
                        </button>
                    }

                    <button className={`select_manually ${ActiveLocation === 'map' && 'active_bg'}`} onClick={handleSelectMap}>{t('map')}</button>
                </div>
            </div>

            {ActiveLocation === 'locate' && (
                <div className='loc_set_succ'>
                    {isLocation ? t("locationIsSet") : t("locationSetFailed")}
                </div>
            )}

            {ActiveLocation === 'manually' && (
                <div className="col-12">
                    <div className='extradet_select_wrap'>
                        <Select
                            showSearch
                            style={{ width: "100%" }}
                            placeholder={t('countrySelect')}
                            onChange={handleCountryChange}
                            onSearch={handleCountrySearch}
                            labelInValue
                            filterOption={false}
                            className='location_select'
                            defaultValue='All Categories'
                            value={Object.keys(SelectedCountry).length !== 0 ? { value: SelectedCountry?.name, label: SelectedCountry?.name } : null}
                        >
                            {Countries && Countries.map((country, index) => (
                                <Option key={index} value={country.name}>
                                    {country.name}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            showSearch
                            style={{ width: "100%" }}
                            placeholder={t('stateSelect')}
                            onChange={handleStateChange}
                            onSearch={handleStateSearch}
                            labelInValue
                            filterOption={false}
                            className='location_select'
                            value={Object.keys(SelectedState).length !== 0 ? { value: SelectedState?.name, label: SelectedState?.name } : null}
                            disabled={Object.keys(SelectedCountry).length === 0}
                        >
                            {States && States.map((state, index) => (
                                <Option key={index} value={state.name}>
                                    {state.name}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            showSearch
                            style={{ width: "100%" }}
                            placeholder={t('citySelect')}
                            onChange={handleCityChange}
                            onSearch={handleCitySearch}
                            labelInValue
                            value={Object.keys(SelectedCity).length !== 0 ? { value: SelectedCity?.name, label: SelectedCity?.name } : null}
                            filterOption={false}
                            className='location_select'
                            disabled={Object.keys(SelectedState).length === 0}
                        >
                            {Cities.map((city, index) => (
                                <Option key={index} value={city.name}>
                                    {city.name}
                                </Option>
                            ))}
                        </Select>
                        {Area.length !== 0 ? (
                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                placeholder={t('areaSelect')}
                                onChange={handleAreaChange}
                                onSearch={handleAreaSearch}
                                labelInValue
                                filterOption={false}
                                className='location_select'
                            >
                                {Area.map((item, index) => (
                                    <Option key={index} value={item.name}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        ) : (
                            Object.keys(SelectedCity).length !== 0 && (
                                <div className='auth_in_cont'>
                                    <label htmlFor="address" className='auth_pers_label'>{t('address')}</label>
                                    <textarea name="address" id="address" rows="3" className='auth_input' value={Address} onChange={handleAddressChange}></textarea>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {ActiveLocation === 'map' && (
                <div className="col-12">
                    {isLocationByMap && (
                        <div className='location_details'>
                            {`${t('country')} : ${LocationByMap.country}, ${t('state')} : ${LocationByMap.state}, ${t('city')} : ${LocationByMap.city}, ${t('address')} : ${LocationByMap.address}`}
                        </div>
                    )}
                    <MapComponent setPosition={setPosition} position={position} getLocationWithMap={getLocationWithMap} />
                </div>
            )}

            <div className="col-12">
                <div className="formBtns">
                    <button className='backBtn' onClick={handleGoBack}>{t('back')}</button>
                    <button className={isAdPlaced ? 'btn btn-secondary' : 'nextBtn'} onClick={handleFullSubmission} disabled={isAdPlaced}>{t('postNow')}</button>
                </div>
            </div>
        </>
    )
}

export default ContentFive
