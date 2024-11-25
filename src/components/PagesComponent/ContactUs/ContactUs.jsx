'use client'
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent"
import { CurrentLanguageData } from "@/redux/reuducer/languageSlice"
import { settingsData } from "@/redux/reuducer/settingSlice"
import { t } from "@/utils"
import { contactUsApi } from "@/utils/api"
import { useState } from "react"
import toast from "react-hot-toast"
import { FaFacebook, FaInstagram, FaLinkedin, FaPinterest, FaSquareXTwitter } from "react-icons/fa6"
import { GrLocation } from "react-icons/gr"
import { RiMailSendLine } from "react-icons/ri"
import { TbPhoneCall } from "react-icons/tb"
import { useSelector } from "react-redux"

const ContactUs = () => {

    const CurrentLanguage = useSelector(CurrentLanguageData)
    const systemSettingsData = useSelector(settingsData)
    const settings = systemSettingsData?.data

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const validateForm = () => {
        const { name, email, subject, message } = formData

        if (!name) {
            toast.error(t("nameRequired"))
            return false
        }

        if (!email) {
            toast.error(t("emailRequired"))
            return false
        }



        if (!subject) {
            toast.error(t("subjectRequired"))
            return false
        }

        if (!message) {
            toast.error(t("messageRequired"))
            return false
        }

        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            const res = await contactUsApi.contactUs(formData)
            if (res?.data?.error === false) {
                toast.success(t("thankForContacting"))
            }
            else {
                toast.error(t("errorOccurred"))
            }

            // Clear form after successful submission
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            })
            // You might want to show a success message to the user here
        } catch (error) {
            console.log(error)
            toast.error(t("errorOccurred"))
            // You might want to show an error message to the user here
        }
    }
    return (
        <>
        <BreadcrumbComponent title2={t('contactUs')} />
            <div className="container">
                <div className="row my_prop_title_spacing">
                    <h4 className="pop_cat_head">{t('contactUs')}</h4>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="contact_us_wrapper">
                            <form className="contact_us_form" onSubmit={handleSubmit}>
                                <div className="contact_us_form_header">
                                    <h5 className="send_us_mesg">{t('sendMessage')}</h5>
                                    <p className="contact_us_desc">{t('contactIntro')}</p>
                                </div>
                                <div className="authrow contact_us_row">
                                    <div className='auth_in_cont'>
                                        <label htmlFor="name" className='auth_pers_label'>{t('name')}</label>
                                        <input
                                            type="text"
                                            id='name'
                                            name='name'
                                            className='auth_input'
                                            placeholder={t("enterName")}
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className='auth_in_cont'>
                                        <label htmlFor="email" className='auth_pers_label'>{t('email')}</label>
                                        <input
                                            type="email"
                                            id='email'
                                            name='email'
                                            className='auth_input'
                                            placeholder={t("enterEmail")}
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className='auth_in_cont'>
                                    <label htmlFor="subject" className='auth_pers_label'>{t('subject')}</label>
                                    <input
                                        type="text"
                                        id='subject'
                                        name='subject'
                                        className='auth_input'
                                        placeholder={t("enterSubject")}
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className='auth_in_cont'>
                                    <label htmlFor="message" className='auth_pers_label'>{t('message')}</label>
                                    <textarea
                                        placeholder={t("enterMessage")}
                                        name="message"
                                        id="message"
                                        rows="5"
                                        className='auth_input'
                                        value={formData.message}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                                <button type="submit" className='sv_chng_btn'>{t('submit')}</button>
                            </form>
                            <div className="contact_info">
                                <h5 className="contact_info_head">{t('contactInfo')}</h5>
                                <div className="contact_detail">
                                    {settings?.company_address &&
                                        <div className="contact_detail_item">
                                            <div className="contact_info_icons">
                                                <GrLocation size={24} />
                                            </div>
                                            <p className="contc_info">{settings?.company_address}</p>
                                        </div>
                                    }
                                    {settings?.company_email &&
                                        <div className="contact_detail_item">
                                            <div className="contact_info_icons">
                                                <RiMailSendLine size={24} />
                                            </div>
                                            <a href={`mailto:${settings?.company_email}`}>
                                                <p className="contc_info">{settings?.company_email}</p>
                                            </a>
                                        </div>
                                    }
                                    {settings?.company_tel1 && settings?.company_tel2 &&
                                        <div className="contact_detail_item">
                                            <div className="contact_info_icons">
                                                <TbPhoneCall size={24} />
                                            </div>
                                            <div className="conatct_no">
                                                <a href={`tel:${settings?.company_tel1}`}>
                                                    <p className="contc_info">{settings?.company_tel1}</p>
                                                </a>
                                                <a href={`tel:${settings?.company_tel2}`}>
                                                    <p className="contc_info">{settings?.company_tel2}</p>
                                                </a>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="contact_socialmedia_icons_cont">
                                    <h5 className="contact_info_head">{t('socialMedia')}</h5>
                                    <div className="contact_socialmedia_icons">
                                        {settings?.facebook_link &&
                                            <a href={settings?.facebook_link}>
                                                <div className="social_media_items">
                                                    <FaFacebook size={24} />
                                                </div>
                                            </a>
                                        }
                                        {settings?.instagram_link &&
                                            <a href={settings?.instagram_link}>
                                                <div className="social_media_items">
                                                    <FaInstagram size={22} />
                                                </div>
                                            </a>
                                        }
                                        {settings?.x_link &&
                                            <a href={settings?.x_link}>
                                                <div className="social_media_items">
                                                    <FaSquareXTwitter size={22} />
                                                </div>
                                            </a>
                                        }
                                        {settings?.linkedin_link &&
                                            <a href={settings?.linkedin_link}>
                                                <div className="social_media_items">
                                                    <FaLinkedin size={24} />
                                                </div>
                                            </a>
                                        }
                                        {settings?.pinterest_link &&
                                            <a href={settings?.pinterest_link}>
                                                <div className="social_media_items">
                                                    <FaPinterest size={24} />
                                                </div>
                                            </a>
                                        }

                                    </div>
                                </div>
                                {settings?.google_map_iframe_link &&
                                    <iframe
                                        src={settings?.google_map_iframe_link}
                                        loading="lazy"
                                        className='contact_loc_map'
                                    ></iframe>
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactUs