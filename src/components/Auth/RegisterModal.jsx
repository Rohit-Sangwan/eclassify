'use client'
import { Modal } from "antd";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import { userSignUpApi } from "@/utils/api";
import { loadUpdateData } from "../../redux/reuducer/authSlice";
import { useSelector } from "react-redux";
import { Fcmtoken, settingsData } from "@/redux/reuducer/settingSlice";
import { handleFirebaseAuthError, t } from "@/utils";

const RegisterModal = ({ IsRegisterModalOpen, OnHide, setIsLoginModalOpen, openSentMailModal }) => {
    const auth = getAuth();
    const fetchFCM = useSelector(Fcmtoken);
    const systemSettingsData = useSelector(settingsData);
    const settings = systemSettingsData?.data;
    const [IsPasswordVisible, setIsPasswordVisible] = useState(false);
    const [countryCode, setCountryCode] = useState(process.env.NEXT_PUBLIC_DEFAULT_COUNTRY || "in");
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);



    useEffect(() => {
        if (!IsRegisterModalOpen) {
            setFormData({
                username: "",
                email: "",
                phoneNumber: '',
                password: ""
            });
            setErrors({});
            setShowErrors(false);
            setCountryCode(process.env.NEXT_PUBLIC_DEFAULT_COUNTRY || "in");
        }
    }, [IsRegisterModalOpen]);

    const validate = (values) => {
        const errors = {};
        if (!values.username) {
            errors.username = t("usernameRequired");
        }
        if (!values.email) {
            errors.email = t("emailRequired");
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = t("emailInvalid");
        }
        if (!values.phoneNumber) {
            errors.phoneNumber = t("phoneRequired");
        } else if (!/^\+?[1-9]\d{1,14}$/.test(values.phoneNumber)) {
            errors.phoneNumber = t("phoneInvalid");
        }
        if (!values.password) {
            errors.password = t("passwordRequired");
        } else if (values.password.length < 6) {
            errors.password = t("passwordTooShort");
        }
        return errors;
    };

    const openLoginModal = () => {
        OnHide();
        setIsLoginModalOpen(true);
    };

    const togglePasswordVisible = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>;

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePhoneChange = (value, data) => {
        setFormData({ ...formData, phoneNumber: value });
        setCountryCode("+" + (data?.dialCode || ""));
    };

    const formattedNumber = formData?.phoneNumber.slice(countryCode?.length - 1)


    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        setErrors(validationErrors);
        setShowErrors(true);
        if (Object.keys(validationErrors).length === 0) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, formData?.email, formData?.password);
                const user = userCredential.user;
                await sendEmailVerification(user);
                openSentMailModal();
                try {
                    const response = await userSignUpApi.userSignup({
                        name: formData?.username ? formData?.username : "",
                        email: formData?.email ? formData?.email : "",
                        mobile: formattedNumber ? formattedNumber : "",
                        firebase_id: user?.uid,
                        country_code: countryCode ? countryCode : "",
                        type: "email",
                        registration: true
                    });
                } catch (error) {
                    console.log("error", error);
                }
            } catch (error) {
                const errorCode = error.code;
                handleFirebaseAuthError(errorCode);
            }
        }
        setTimeout(() => {
            setShowErrors(false);
        }, 3000);
    };

    const handleGoogleSignup = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const response = await signInWithPopup(auth, provider);
            const user = response.user;
            try {
                const response = await userSignUpApi.userSignup({
                    name: user.displayName ? user.displayName : "",
                    email: user?.email,
                    firebase_id: user.uid,
                    fcm_id: fetchFCM ? fetchFCM : "",
                    type: "google"
                });
                const data = response.data;
                loadUpdateData(data);
                toast.success(data.message);
                OnHide();
            } catch (error) {
                console.error("Error:", error);
            }
        } catch (error) {
            console.error(error);
            const errorCode = error.code;
            handleFirebaseAuthError(errorCode);
        }
    };

    return (
        <>
            <Modal
                centered
                open={IsRegisterModalOpen}
                closeIcon={CloseIcon}
                colorIconHover='transparent'
                className="ant_register_modal"
                onCancel={OnHide}
                footer={null}
                maskClosable={false}
            >
                <div className="register_modal">
                    <div className="reg_modal_header">
                        <h1 className="reg_modal_title">{t('welcomeTo')} <span className="brand_name">{settings?.company_name}</span></h1>
                        <p className="signin_redirect">{t('haveAccount')} <span className="main_signin_redirect" onClick={openLoginModal}>{t('logIn')}</span></p>
                    </div>
                    <form className="auth_form">
                        <div className="auth_in_cont">
                            <label htmlFor="username" className="auth_label">{t('username')}</label>
                            <input type="text" placeholder={t("typeUsername")} className="auth_input" name="username" required onChange={handleInputChange} value={formData.username} />
                            {showErrors && errors.username && (
                                <span className={`error_message ${showErrors && errors.username ? 'show' : ''}`}>{errors.username}</span>
                            )}
                        </div>

                        <div className="auth_in_cont">
                            <label htmlFor="email" className="auth_label">{t('email')}</label>
                            <input type="email" id="email" placeholder={t("typeEmail")} className="auth_input" name="email" required onChange={handleInputChange} value={formData.email} />
                            {showErrors && errors.email && (
                                <span className={`error_message ${showErrors && errors.email ? 'show' : ''}`}>{errors.email}</span>
                            )}
                        </div>

                        <div className="auth_in_cont">
                            <label htmlFor="phonenumber" className="auth_label">{t('phone')}</label>
                            <PhoneInput
                                country={countryCode}
                                defaultCountry={countryCode}
                                inputProps={{
                                    name: "phone",
                                    required: true,
                                    autoFocus: true,
                                }}
                                value={formData?.phoneNumber}
                                onChange={(phone, data) => handlePhoneChange(phone, data)}
                                onCountryChange={(code) => setCountryCode(code)}
                                required
                            />
                            {showErrors && errors.phoneNumber && (
                                <span className={`error_message ${showErrors && errors.phoneNumber ? 'show' : ''}`}>{errors.phoneNumber}</span>
                            )}
                        </div>

                        <div className="auth_in_cont">
                            <label htmlFor="password" className="auth_label">{t('password')}</label>
                            <div className="password_cont">
                                <input type={IsPasswordVisible ? "text" : "password"} id="password" placeholder={t("typePassword")} className="auth_input w-100" name="password" required onChange={handleInputChange} value={formData.password} />
                                {IsPasswordVisible ? <FaRegEye className="pass_eye" onClick={togglePasswordVisible} /> : <FaRegEyeSlash className="pass_eye" onClick={togglePasswordVisible} />}
                            </div>
                            {showErrors && errors.password && (
                                <span className={`error_message ${showErrors && errors.password ? 'show' : ''}`}>{errors.password}</span>
                            )}
                        </div>
                        <button type="button" className="verf_email_add_btn" onClick={handleVerifyEmail}>{t('verifyEmail')}</button>
                    </form>
                    <div className="signup_with_cont">
                        <hr />
                        <p>{t('orSignUpWith')}</p>
                        <hr />
                    </div>
                    <button className="reg_with_google_btn" onClick={handleGoogleSignup}>
                        <FcGoogle size={24} />
                        {t('google')}
                    </button>

                    <div className="auth_modal_footer">
                        {t('agreeCreateAccount')} {settings?.company_name} {' '}<br />
                        <Link onClick={OnHide} href='/terms-and-condition' className="link_brand_name">{t('termsService')}</Link> {t('and')} <Link onClick={OnHide} href='/privacy-policy' className="link_brand_name">{t('privacyPolicy')}</Link>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default RegisterModal;
