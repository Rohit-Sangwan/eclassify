'use client'
import { Modal } from "antd"
import Image from 'next/image'
import user from '../../../public/assets/classified_Image2.svg'
import { useState } from "react"
import { placeholderImage, t } from "@/utils"
import { MdClose } from "react-icons/md"


const FollowersFollowing = ({ IsFollowersModalOpen, OnHide, handleFollowersClick, handleFollowingClick, IsFollowingActive }) => {

    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>

    return (
        <Modal
            centered
            open={IsFollowersModalOpen}
            closeIcon={CloseIcon}
            colorIconHover='transparent'
            className="ant_register_modal"
            onCancel={OnHide}
            footer={null}
            maskClosable={false}
        >
            <div className='followers_modal'>
                <div className="followers_following_head">
                    <h5 className={`followers ${!IsFollowingActive && 'followerfollowing_active'}`} onClick={handleFollowersClick}>{t('followers')}</h5>
                    <h5 className={`following ${IsFollowingActive && 'followerfollowing_active'}`} onClick={handleFollowingClick}>{t('following')}</h5>
                </div>
                <div className="followers_following_items_cont">
                    <div className="followers_following_item">
                        <Image src={user} width={48} height={48} alt="User" className="followers_following_user_img" onErrorCapture={placeholderImage} />
                        <h5 className="followers_following_username">James Smith</h5>
                    </div>
                    <div className="followers_following_item">
                        <Image src={user} width={48} height={48} alt="User" className="followers_following_user_img" onErrorCapture={placeholderImage} />
                        <h5 className="followers_following_username">James Smith</h5>
                    </div>
                    <div className="followers_following_item">
                        <Image src={user} width={48} height={48} alt="User" className="followers_following_user_img" onErrorCapture={placeholderImage} />
                        <h5 className="followers_following_username">James Smith</h5>
                    </div>
                    <div className="followers_following_item">
                        <Image src={user} width={48} height={48} alt="User" className="followers_following_user_img" onErrorCapture={placeholderImage} />
                        <h5 className="followers_following_username">James Smith</h5>
                    </div>
                    <div className="followers_following_item">
                        <Image src={user} width={48} height={48} alt="User" className="followers_following_user_img" onErrorCapture={placeholderImage} />
                        <h5 className="followers_following_username">James Smith</h5>
                    </div>
                    <div className="followers_following_item">
                        <Image src={user} width={48} height={48} alt="User" className="followers_following_user_img" onErrorCapture={placeholderImage} />
                        <h5 className="followers_following_username">James Smith</h5>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default FollowersFollowing