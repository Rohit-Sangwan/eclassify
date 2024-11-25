'use client'
import Image from "next/image"
import user from '../../../public/assets/classified_Image2.svg'
import { FaRegCheckCircle } from "react-icons/fa"
import { LuUser } from "react-icons/lu"
import { BsThreeDotsVertical } from "react-icons/bs";
import { Dropdown } from "antd";
import { IoShareSocialOutline } from "react-icons/io5";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import ReportModal from "../User/ReportModal";
import FollowersFollowing from "../User/FollowersFollowing";
import UserCardSkeleton from "../Skeleton/UserCardSkeleton"
import { placeholderImage, t } from "@/utils"

const UserCard = () => {

    const [IsReportModalOpen, setIsReportModalOpen] = useState(false)
    const [IsFollowersModalOpen, setIsFollowersModalOpen] = useState(false)
    const [IsFollowingActive, setIsFollowingActive] = useState(false)

    const [IsLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate a loading period
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, []);


    const handleFollowersClick = () => {
        if (IsFollowingActive) {
            setIsFollowingActive(false)
        }
    }

    const handleFollowingClick = () => {
        if (!IsFollowingActive) {
            setIsFollowingActive(true)
        }
    }

    const openReportModal = () => {
        setIsReportModalOpen(true)
    }

    const openFollowers = () => {
        if (IsFollowingActive) {
            setIsFollowingActive(false)
        }
        setIsFollowersModalOpen(true)
    }

    const openFollowing = () => {
        if (!IsFollowingActive) {
            setIsFollowingActive(true)
        }
        setIsFollowersModalOpen(true)
    }

    const items = [
        {
            key: '1',
            label: (
                <div className="report_user_cont" onClick={openReportModal} >
                    <AiOutlineExclamationCircle size={16} color="black" />
                    <span>{t('reportUser')}</span>
                </div>
            ),
        },
        {
            key: '2',
            label: (
                <div className="share_prof_cont">
                    <IoShareSocialOutline size={16} color="black" />
                    <span className="share_prof">{t('shareProfile')}</span>
                </div>
            ),
        },

    ];


    return (
        <>

            {
                IsLoading ? (
                    <UserCardSkeleton />
                ) : (
                    <div className="usercard">
                        <div className="user_img_cont">
                            <Image src={user} width={276} height={276} alt="User" className="usersimg" onErrorCapture={placeholderImage} />

                            <Dropdown
                                menu={{
                                    items,
                                }}
                                placement="bottom"
                                trigger={['click']}
                            >
                                <div className="three_dots_vert">
                                    <BsThreeDotsVertical size={18} color="black" />
                                </div>
                            </Dropdown>



                        </div>
                        <div className="card_det_wrapper">
                            <div className="userdet_cont">
                                <div className="username_cont">
                                    <h5 className="user_card_name">Sophia Anderson</h5>
                                    <FaRegCheckCircle size={24} color="#198754" />
                                </div>
                                <p className="member_since">{t('memberSince')}: 2017</p>
                            </div>

                            <div className="followers_following_cont">
                                <div className="followers_cont" onClick={openFollowers} >
                                    <LuUser color="#000" size={24} />
                                    <p className="followers_following">40 {t('followers')}</p>
                                </div>
                                <div className="v_line"></div>
                                <p className="followers_following" onClick={openFollowing}>12 {t('following')}</p>
                            </div>
                            <div className="h_line"></div>

                            <div className="message_follow_btn_cont">
                                <button className="message_btn">{t('message')}</button>
                                <button className="follow_btn">{t('follow')}</button>
                            </div>
                        </div>
                    </div>
                )
            }
            <ReportModal IsReportModalOpen={IsReportModalOpen} OnHide={() => setIsReportModalOpen(false)} />
            <FollowersFollowing IsFollowersModalOpen={IsFollowersModalOpen} OnHide={() => setIsFollowersModalOpen(false)} handleFollowersClick={handleFollowersClick} handleFollowingClick={handleFollowingClick} IsFollowingActive={IsFollowingActive} />
        </>
    )
}

export default UserCard