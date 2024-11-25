'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { GiHamburgerMenu } from "react-icons/gi";
import { Drawer } from 'antd';
import Link from 'next/link';
import { isEmptyObject, placeholderImage, t } from '@/utils';
import { getLanguageApi } from '@/utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { settingsData } from '@/redux/reuducer/settingSlice';
import { CurrentLanguageData, setCurrentLanguage } from '@/redux/reuducer/languageSlice';
import LanguageDropdown from '../HeaderDropdowns/LanguageDropdown';
import { MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import { store } from '@/redux/store';

const LandingPageHeader = () => {

    const dispatch = useDispatch();
    const CurrentLanguage = useSelector(CurrentLanguageData)
    const systemSettingsData = useSelector(settingsData)
    const settings = systemSettingsData?.data
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const getLanguageData = async (language_code = settings?.default_language) => {
        try {
            const res = await getLanguageApi.getLanguage({ language_code, type: 'web' });
            if (res?.data?.error === true) {
                toast.error(res?.data?.message)
            }
            else {
                if (show) {
                    setShow(false)
                }
                dispatch(setCurrentLanguage(res?.data?.data));
            }
        } catch (error) {
            console.log(error)
        }
    }

    // set default language if language not available in start

    const setDefaultLanguage = async () => {
        try {
            const language_code = settings?.default_language
            const res = await getLanguageApi.getLanguage({ language_code, type: 'web' });
            if (res?.data?.error === true) {
                toast.error(res?.data?.message)
            }
            else {
                dispatch(setCurrentLanguage(res?.data?.data));
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        if (isEmptyObject(CurrentLanguage)) {
            setDefaultLanguage()
        }
    }, [])

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            if (show) {
                handleClose()
            }
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <div className="left_side">
                        <div className="nav_logo">
                            <Link href="/home">
                                <Image src={settings?.header_logo} alt='logo' width={0} height={0} className='header_logo' onErrorCapture={placeholderImage} />
                            </Link>
                        </div>
                        <span onClick={handleShow} id="hamburg">
                            <GiHamburgerMenu size={25} />
                        </span>
                    </div>
                    <div className="nav_items_div">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item nav-link active">
                                    {t('home')}
                                </li>
                                <li className="nav-item nav-link" onClick={() => scrollToSection('work_process')}>
                                    {t('whyChooseUs')}
                                </li>

                                <li className="nav-item nav-link" onClick={() => scrollToSection('faq')}>
                                    {t('faqs')}
                                </li>
                                <li className="nav-item nav-link" onClick={() => scrollToSection('ourBlogs')}>
                                    {t('blog')}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="right_side">
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item dropdown mx-2">
                                    <LanguageDropdown getLanguageData={getLanguageData} settings={settings} />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            <Drawer className='eclassify_drawer' maskClosable={false} title={<Image src={settings?.header_logo} width={195} height={92} alt="Close Icon" onErrorCapture={placeholderImage} />} onClose={handleClose} open={show} closeIcon={<div className="close_icon_cont"><MdClose size={24} color="black" /></div>} >
                <ul className="mobile_nav">
                    <li className='mobile_nav_tab mob_nav_tab_active' >{t('home')}</li>
                    <li className='mobile_nav_tab' onClick={() => scrollToSection('work_process')}>{t('whyChooseUs')}</li>
                    <li className="mobile_nav_tab" onClick={() => scrollToSection('faq')}>{t('faqs')}</li>
                    <li className='mobile_nav_tab' onClick={() => scrollToSection('ourBlogs')}>{t('blog')}</li>
                    <li className='mobile_nav_tab'>

                        <LanguageDropdown getLanguageData={getLanguageData} settings={settings} />
                    </li>
                </ul>
            </Drawer>


        </>
    )
}

export default LandingPageHeader
