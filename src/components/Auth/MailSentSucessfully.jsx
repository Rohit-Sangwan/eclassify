'use client'
import { Modal } from 'antd'
import Image from 'next/image'
import React from 'react'
import mailVerification from '../../../public/assets/Mail Verification.svg'
import { placeholderImage, t } from '@/utils'
import { MdClose } from 'react-icons/md'


const MailSentSucessfully = ({ IsMailSentOpen, OnHide, IsLoginModalOpen }) => {

    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>

    
    // const handleGoClick = () => {
    //     OnHide()
    //     IsLoginModalOpen()
    //     window.open('https://mail.google.com/mail/u/0/#inbox', '_blank');
    // }
    return (
        <Modal
            centered
            open={IsMailSentOpen}
            closeIcon={CloseIcon}
            colorIconHover='transparent'
            className="ant_register_modal"
            onCancel={OnHide}
            footer={null}
            maskClosable={false}
        >
            <div className='verify_email_modal'>
                <Image src={mailVerification} width={300} height={195} alt='Email Verification' className='email_verification' onErrorCapture={placeholderImage} />
                <h1 className='got_mail'>{t("youveGotMail")}</h1>
                <p className='click_toVerify'>{t("verifyAccount")}</p>
                {/* <button className='go_inbox' onClick={handleGoClick}>
                    <p>{t("checkEmail")}</p>
                    <FaArrowRight size={16} />
                </button> */}
            </div>
        </Modal>
    )
}

export default MailSentSucessfully