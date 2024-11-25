'use client'
import React, { useEffect, useState } from 'react'
import BreadcrumbComponent from '../../Breadcrumb/BreadcrumbComponent'
import EditListingTwo from './EditListingContentTwo'
import EditListingThree from './EditListingContentThree'
import EditListingFour from './EditListingContentFour'
import EditListingFive from './EditListingContentFive'
import AdEditSuccessfulModal from '../EditListing/AdEditSuccessfulModal'
import { useSelector } from 'react-redux'
import { generateSlug, t } from '@/utils'
import { editItemApi, getAreasApi, getCitiesApi, getCoutriesApi, getCustomFieldsApi, getStatesApi, getParentCategoriesApi } from '@/utils/api'
import toast from 'react-hot-toast'
import axios from 'axios'
import { getMyItemsApi } from "@/utils/api";
import { settingsData } from '@/redux/reuducer/settingSlice'
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice'


const EditListing = ({ id }) => {

    const CurrentLanguage = useSelector(CurrentLanguageData)
    const systemSettingsData = useSelector(settingsData)
    const settings = systemSettingsData?.data
    const [activeTab, setActiveTab] = useState(2)
    const [IsAdSuccessfulModal, setIsAdSuccessfulModal] = useState(false)
    const [CurrenCategory, setCurrenCategory] = useState([])
    const [CustomFields, setCustomFields] = useState([])
    const [AdListingDetails, setAdListingDetails] = useState({
        title: '',
        slug: '',
        desc: '',
        price: '',
        phonenumber: '',
        link: '',
    })
    const [CreatedAdSlug, setCreatedAdSlug] = useState('')
    const [selectedCategoryPath, setSelectedCategoryPath] = useState([])
    const [selectedCateId, setSelectedCateId] = useState()
    const [extraDetails, setExtraDetails] = useState({})
    const [uploadedImages, setUploadedImages] = useState([]);
    const [OtherImages, setOtherImages] = useState([]);
    const [Location, setLocation] = useState({})
    const [Countries, setCountries] = useState([])
    const [States, setStates] = useState([])
    const [Cities, setCities] = useState([])
    const [Area, setArea] = useState([])
    const [SelectedCountry, setSelectedCountry] = useState({})
    const [SelectedState, setSelectedState] = useState({})
    const [SelectedCity, setSelectedCity] = useState({})
    const [SelectedArea, setSelectedArea] = useState({})
    const [CountrySearch, setCountrySearch] = useState('')
    const [StateSearch, setStateSearch] = useState('')
    const [CitySearch, setCitySearch] = useState('')
    const [AreaSearch, setAreaSearch] = useState('')
    const [ActiveLocation, setActiveLocation] = useState('manually')
    const [position, setPosition] = useState({ lat: settings?.default_latitude, lng: settings?.default_longitude });
    const [Address, setAddress] = useState('')
    const [LocationByMap, setLocationByMap] = useState({})
    const [extraFieldValue, setExtraFieldValue] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [deleteImagesId, setDeleteImagesId] = useState("")
    const [allCategoryIds, setAllCategoryIds] = useState()
    const [filePreviews, setFilePreviews] = useState({});

    const getCountriesData = async (search) => {
        try {
            // Fetch countries
            const res = await getCoutriesApi.getCoutries({ search });
            const allCountries = res?.data?.data?.data || [];
            setCountries(allCountries)
        } catch (error) {
            console.error("Error fetching countries data:", error);
        }
    };

    const getStatesData = async (search) => {
        try {
            const res = await getStatesApi.getStates({ country_id: SelectedCountry?.id, search });
            const allStates = res?.data?.data?.data || [];
            setStates(allStates)
        } catch (error) {
            console.error("Error fetching states data:", error);
            return [];
        }
    };

    const getCitiesData = async (search) => {
        try {
            const res = await getCitiesApi.getCities({ state_id: SelectedState?.id, search });
            const allCities = res?.data?.data?.data || [];
            setCities(allCities)
        } catch (error) {
            console.error("Error fetching cities data:", error);
            return [];
        }
    };

    const getAreaData = async (search) => {
        try {
            const res = await getAreasApi.getAreas({ city_id: SelectedCity?.id, search });
            const allArea = res?.data?.data?.data || [];
            setArea(allArea)
        } catch (error) {
            console.error("Error fetching cities data:", error);
            return [];
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            getCountriesData(CountrySearch);
        }, 1500);
        return () => {
            clearTimeout(timeout);
        };
    }, [CountrySearch])

    useEffect(() => {
        const timeout = setTimeout(() => {
            getStatesData(StateSearch);
        }, 1500);
        return () => {
            clearTimeout(timeout);
        };
    }, [SelectedCountry?.id, StateSearch])

    useEffect(() => {
        const timeout = setTimeout(() => {
            getCitiesData(CitySearch);
        }, 1500);
        return () => {
            clearTimeout(timeout);
        };

    }, [SelectedState?.id, CitySearch])

    useEffect(() => {
        const timeout = setTimeout(() => {
            SelectedCity?.id && getAreaData(AreaSearch);
        }, 500);
        return () => {
            clearTimeout(timeout);
        };

    }, [SelectedCity?.id, AreaSearch])

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
                address: results.formatted_address
            };

            setLocationByMap(locationData);
        } catch (error) {
            console.error('Error fetching location data:', error);
        }
    }

    const getCurrentLocation = async () => {
        setActiveLocation('locate');
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

                        // Extract address components
                        const addressComponents = results.address_components;
                        const getAddressComponent = (type) => {
                            const component = addressComponents.find(comp => comp.types.includes(type));
                            return component ? component.long_name : '';
                        };

                        const cityData = {
                            lat: locationData.latitude,
                            long: locationData.longitude,
                            city: getAddressComponent("locality"),
                            state: getAddressComponent("administrative_area_level_1"),
                            country: getAddressComponent("country"),
                            address: results.formatted_address
                        };

                        setLocation(cityData);
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


    const fetchCategoryPath = async () => {
        try {
            const response = await getParentCategoriesApi.getPaymentCategories({ child_category_id: selectedCateId })
            setSelectedCategoryPath(response?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }


    function isPdf(url) {
        // Split the URL by '.' and get the last part
        const parts = url.split('.');
        const extension = parts[parts.length - 1];
        // Check if the extension is 'pdf'
        return extension.toLowerCase() === 'pdf';
    }

    const getCustomFieldsData = async (id) => {
        try {
            const res = await getCustomFieldsApi.getCustomFields({ category_ids: id })
            const data = res?.data?.data
            setCustomFields(data)
            const tempExtraDetails = {};
            data?.forEach((field) => {
                const fieldId = field.id;
                const extraField = extraFieldValue.find(item => item.id === fieldId);
                const fieldValue = extraField ? extraField?.value : null;

                if (field.type === "checkbox") {
                    // For checkbox fields, initialize with the values from extraFieldValue
                    const checkboxValues = fieldValue || [];
                    tempExtraDetails[fieldId] = checkboxValues;
                } else if (field.type === "radio") {
                    // For radio fields, initialize as a single value
                    const radioValue = fieldValue ? fieldValue[0] : '';
                    tempExtraDetails[fieldId] = radioValue;
                }
                else if (field.type === "fileinput") {
                    // For fileinput fields, initialize with null or empty string

                    if (fieldValue) {
                        setFilePreviews(prevPreviews => ({
                            ...prevPreviews,
                            [fieldId]: {
                                url: fieldValue[0],
                                isPdf: isPdf(extraField.custom_field_value.value)
                            }
                        }));
                    }

                    tempExtraDetails[fieldId] = '';
                }
                else {
                    // For other fields
                    const initialValue = fieldValue ? fieldValue[0] : '';
                    tempExtraDetails[fieldId] = initialValue;
                }
            });

            setExtraDetails(tempExtraDetails);

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (allCategoryIds) {
            getCustomFieldsData(allCategoryIds)
        }
    }, [allCategoryIds])

    useEffect(() => {
        if (selectedCateId) {
            fetchCategoryPath()
        }
    }, [selectedCateId])

    useEffect(() => {
    }, [selectedCategoryPath])

    const handleGoBack = () => {
        if (activeTab == 4 && CustomFields?.length == 0) {
            setActiveTab((prev) => prev - 2)
        } else {
            setActiveTab((prev) => prev - 1)

        }
    }

    const handleAdListingChange = (e) => {
        const { name, value } = e.target;

        setAdListingDetails((prevDetails) => {
            const updatedDetails = {
                ...prevDetails,
                [name]: value,
            };
            if (name === 'title') {
                updatedDetails.slug = generateSlug(value);
            }
            return updatedDetails;
        });
    };

    const handleDetailsSubmit = () => {

        const isValidSlug = /^[a-z0-9-]+$/.test(AdListingDetails.slug.trim());

        if (AdListingDetails.title?.trim() == "") {
            toast.error(t('titleRequired'))
            return;
        }
        else if (AdListingDetails.desc.trim() == "") {
            toast.error(t('descriptionRequired'))
            return;
        } else if (AdListingDetails.price == "") {
            toast.error(t('priceRequired'))
            return;
        } else if (AdListingDetails.price < 0) {
            toast.error(t('enterValidPrice'));
            return
        }
        else if (AdListingDetails.phonenumber == "") {
            toast.error(t('phoneRequired'))
            return;
        } else if (AdListingDetails.slug.trim() && !isValidSlug) {
            toast.error(t('addValidSlug'));
            return;
        }

        if (CustomFields?.length === 0) {
            setActiveTab(4)
        }
        else {
            setActiveTab(3)
        }
    }

    const submitExtraDetails = (e) => {

        if (!validateExtraDetails(CustomFields, extraDetails)) {
            return;
        }
        setActiveTab(4)
    }

    const handleImageSubmit = () => {
        setActiveTab(5)
    }

    const validateExtraDetails = (CustomFields, extraDetails) => {
        for (const field of CustomFields) {
            const { name, type, required, id, min_length } = field;

            if (required) {
                if (type !== 'checkbox' && type !== 'radio' && type !== 'fileinput' && !(type === 'textbox' ? extraDetails[id]?.trim() : extraDetails[id])) {
                    toast.error(`${t('fillDetails')} ${name}.`);
                    return false;
                }

                if (type === 'fileinput' && !extraDetails[id] && !filePreviews[id]) {
                    toast.error(`${t('fillDetails')} ${name}.`);
                    return false
                }

                if ((type === 'checkbox' || type === 'radio') && extraDetails[id].length === 0) {
                    toast.error(`${t('selectAtleastOne')} ${name}.`);
                    return false;
                }

                // Required field with min_length validation
                if (extraDetails[id] && type === 'textbox' && extraDetails[id].trim().length < min_length) {
                    toast.error(`${name} ${t('mustBeAtleast')} ${min_length} ${t('charactersLong')}`);
                    return false;
                }
                if (extraDetails[id] && type === 'number' && extraDetails[id].length < min_length) {
                    toast.error(`${name} ${t('mustBeAtleast')} ${min_length} ${t('digitLong')}`);
                    return false;
                }

            }

            // Non-required field with min_length validation
            if (!required && extraDetails[id] && type === 'textbox' && extraDetails[id].length < min_length) {
                toast.error(`${name} ${t('mustBeAtleast')} ${min_length} ${t('charactersLong')}`);
                return false;
            }

            if (!required && extraDetails[id] && type === 'number' && extraDetails[id].length < min_length) {
                toast.error(`${name} ${t('mustBeAtleast')} ${min_length} ${t('digitLong')}`);
                return false;
            }
        }
        return true;
    };

    const isValidURL = (url) => {
        const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
        return pattern.test(url);
    };

    const editAd = async () => {
        
        let countryName, stateName, cityName, latitude, longitude, address;

        if (ActiveLocation === 'manually') {
            countryName = SelectedCountry.name;
            stateName = SelectedState.name;
            cityName = SelectedCity.name;
            address = Area.length !== 0 ? SelectedArea.name : Address;
            latitude = SelectedCity.latitude;
            longitude = SelectedCity.longitude;
        } else if (ActiveLocation === 'locate') {
            countryName = Location?.country;
            stateName = Location?.state;
            cityName = Location?.city;
            latitude = Location?.lat;
            longitude = Location?.long;
            address = Location?.address;
        } else {
            countryName = LocationByMap.country;
            stateName = LocationByMap.state;
            cityName = LocationByMap.city;
            latitude = LocationByMap.lat;
            longitude = LocationByMap.long;
            address = LocationByMap.address;
        }

        const transformedCustomFields = {};
        const customFieldFiles = [];

        Object.entries(extraDetails).forEach(([key, value]) => {

            if (value === null || value === undefined || value === "") {
                // Handle the case where the input file is null
                return;
            }
            if (value instanceof File || (Array.isArray(value) && value[0] instanceof File)) {

                customFieldFiles.push({ key, files: value });
            } else {
                transformedCustomFields[key] = Array.isArray(value) ? value : [value];
            }
        });

        const show_only_to_premium = 1;
        const allData = {
            id: id,
            name: AdListingDetails.title,
            slug: AdListingDetails.slug.trim(),
            description: AdListingDetails?.desc,
            price: AdListingDetails.price,
            contact: AdListingDetails.phonenumber,
            video_link: AdListingDetails?.link,
            custom_fields: transformedCustomFields,
            image: typeof uploadedImages == 'string' ? null : uploadedImages[0],
            gallery_images: OtherImages,
            address: address,
            latitude: latitude,
            longitude: longitude,
            custom_field_files: customFieldFiles,
            show_only_to_premium: show_only_to_premium,
            country: countryName,
            state: stateName,
            city: cityName,
            delete_item_image_id: deleteImagesId
        }
        const res = await editItemApi.editItem(allData)
        setCreatedAdSlug(res?.data?.data[0]?.slug)
        if (res?.data?.error === true) {
            toast.error(res?.data?.message)
            return
        }
        if (res?.data?.error === false) {
            setIsAdSuccessfulModal(true)
        }
    }

    const handleFullSubmission = () => {
        const { title, desc, price,slug, phonenumber, link } = AdListingDetails;

        const isValidSlug = /^[a-z0-9-]+$/.test(slug.trim());

        if (!title.trim() || !desc.trim() || !price || !phonenumber) {
            toast.error(t('completeDetails'));
            setActiveTab(2);
            return;
        }

        // Additional validation logic (e.g., format checks) can be added here
        if (price < 0) {
            toast.error(t('enterValidPrice'));
            setActiveTab(2);
            return;
        }

        if (slug.trim() && !isValidSlug) {
            toast.error(t('addValidSlug'));
            setActiveTab(2);
            return;
        }

        if (link && !isValidURL(link)) {
            toast.error(t('enterValidUrl'));
            setActiveTab(2);
            return;
        }

        if (CustomFields.length !== 0 && !validateExtraDetails(CustomFields, extraDetails)) {
            setActiveTab(3);
            return;
        }

        if (uploadedImages.length === 0) {
            toast.error(t('uploadMainPicture'));
            setActiveTab(4);
            return
        }
        if (ActiveLocation === 'manually' && Object.keys(SelectedCountry).length === 0) {
            toast.error(t('selectCountry'));
            return
        }
        if (ActiveLocation === 'manually' && Object.keys(SelectedState).length === 0) {
            toast.error(t('selectState'));
            return
        }
        if (ActiveLocation === 'manually' && Object.keys(SelectedCity).length === 0) {
            toast.error(t('selectCity'));
            return
        }
        if (ActiveLocation === 'manually' && Area.length !== 0 && Object.keys(SelectedArea).length === 0) {
            toast.error(t('selectArea'));
            return
        }
        if (ActiveLocation === 'manually' && Area.length === 0 && !Address) {
            toast.error(t('enterAddress'));
            return
        }

        const isLocation = Location?.city && Location?.country && Location?.state && Location?.lat && Location?.long

        if (ActiveLocation === 'locate' && !isLocation) {
            toast.error(t('locationSetFailed'));
            return
        }

        const isLocationByMap = LocationByMap.country && LocationByMap.state && LocationByMap.city && LocationByMap.address;

        if (ActiveLocation === 'map' && !isLocationByMap) {
            toast.error(t('pleaseSelectLocation'));
            return
        }
        editAd()
    }

    const getSingleListingData = async () => {
        try {
            const res = await getMyItemsApi.getMyItems({ id: Number(id) });
            const listingData = res?.data?.data?.[0];
            setUploadedImages(listingData?.image);
            setOtherImages(listingData?.gallery_images);
            setAllCategoryIds(listingData?.all_category_ids)
            setSelectedCateId(listingData?.category_id)
            await setEditCategory(listingData?.all_category_ids);
            setAdListingDetails((prevState) => ({
                ...prevState,
                title: listingData?.name,
                slug: listingData?.slug,
                desc: listingData?.description,
                price: listingData?.price,
                phonenumber: listingData?.contact,
                link: listingData?.video_link
            }));
            setSelectedCountry(listingData?.country);
            setSelectedState(listingData?.state);
            setSelectedCity(listingData?.city);
            setAddress(listingData?.address);
            setPosition({ lat: listingData?.latitude, lng: listingData?.longitude });
            setExtraFieldValue(listingData?.custom_fields)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const getData = async () => {
            await getSingleListingData();
        };
        getData();
    }, []);
    const setEditCategory = async (category) => {
        const selectedCategoryIds = category?.split(',')?.map(id => parseInt(id, 10));
        const filteredCategories = CurrenCategory?.filter(category =>
            selectedCategoryIds?.includes(category.id)
        );
        const sequencedCategories = [];
        const traverseCategories = (categories) => {
            for (const category of categories) {
                if (selectedCategoryIds?.includes(category?.id)) {
                    sequencedCategories.push(category);
                }
                if (category.subcategories && category.subcategories.length > 0) {
                    traverseCategories(category.subcategories);
                }
            }
        };
        traverseCategories(filteredCategories);
    };

    return (
        isLoading == false ? <>
            <BreadcrumbComponent title2={t('editListing')} />
            <section className='adListingSect container'>
                <div className="row">
                    <div className="col-12">
                        <span className='heading'>{t('editListing')}</span>
                    </div>
                </div>
                <div className="row tabsWrapper">
                    <div className="col-12">
                        <div className="tabsHeader">
                            <span className={`tab ${activeTab === 2 ? 'activeTab' : ''}`} onClick={() => setActiveTab(2)}>{t('details')}</span>
                            {
                                CustomFields.length !== 0 &&
                                <span className={`tab ${activeTab === 3 ? 'activeTab' : ''}`} onClick={() => setActiveTab(3)}>{t('extraDetails')}</span>
                            }
                            <span className={`tab ${activeTab === 4 ? 'activeTab' : ''}`} onClick={() => setActiveTab(4)}>{t('images')}</span>
                            <span className={`tab ${activeTab === 5 ? 'activeTab' : ''}`} onClick={() => setActiveTab(5)}>{t('location')}</span>
                        </div>
                    </div>
                    {activeTab === 2 ?
                        selectedCategoryPath && selectedCategoryPath?.length > 0 &&
                        <div className="col-12">
                            <div className="tabBreadcrumb">
                                <span className='title1'>{t('selected')} {""} {t('category')}</span>
                                <div className='selected_wrapper'>
                                    {
                                        selectedCategoryPath && selectedCategoryPath?.map((item, index) => (
                                            <span className='title2edit' key={item.id}>
                                                {item.name}
                                                {
                                                    index !== selectedCategoryPath?.length - 1 && selectedCategoryPath?.length > 1 ? ',' : ''
                                                }
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>
                        </div> : null
                    }
                    <div className="col-12">
                        <div className="contentWrapper">

                            <div className='row'>

                                {
                                    activeTab === 2 &&
                                    <EditListingTwo AdListingDetails={AdListingDetails} handleAdListingChange={handleAdListingChange} handleDetailsSubmit={handleDetailsSubmit} handleGoBack={handleGoBack} />
                                }

                                {
                                    activeTab === 3 && CustomFields.length !== 0 &&
                                    <EditListingThree CustomFields={CustomFields} extraDetails={extraDetails} setExtraDetails={setExtraDetails} submitExtraDetails={submitExtraDetails} handleGoBack={handleGoBack} filePreviews={filePreviews} setFilePreviews={setFilePreviews} />
                                }

                                {
                                    activeTab === 4 &&
                                    <EditListingFour setUploadedImages={setUploadedImages} uploadedImages={uploadedImages} OtherImages={OtherImages} setOtherImages={setOtherImages} handleImageSubmit={handleImageSubmit} handleGoBack={handleGoBack} setDeleteImagesId={setDeleteImagesId} />
                                }

                                {
                                    activeTab === 5 &&
                                    <EditListingFive getCurrentLocation={getCurrentLocation} Countries={Countries} setSelectedCountry={setSelectedCountry} setCountrySearch={setCountrySearch} SelectedCountry={SelectedCountry} SelectedState={SelectedState} setSelectedState={setSelectedState} States={States} setStateSearch={setStateSearch} setCitySearch={setCitySearch} Cities={Cities} setSelectedCity={setSelectedCity} SelectedCity={SelectedCity} handleGoBack={handleGoBack} setActiveLocation={setActiveLocation} ActiveLocation={ActiveLocation} Location={Location} handleFullSubmission={handleFullSubmission} position={position} setPosition={setPosition} getLocationWithMap={getLocationWithMap} setAreaSearch={setAreaSearch} Area={Area} setSelectedArea={setSelectedArea} LocationByMap={LocationByMap} Address={Address} setAddress={setAddress} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <AdEditSuccessfulModal IsAdSuccessfulModal={IsAdSuccessfulModal} OnHide={() => setIsAdSuccessfulModal(false)} CreatedAdSlug={CreatedAdSlug} />
        </> :
            <p>{t('loading')}</p>
    )
}

export default EditListing;
