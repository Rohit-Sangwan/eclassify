'use client'
import { userSignUpData } from "@/redux/reuducer/authSlice"
import { isLogin, placeholderImage, t, truncate } from "@/utils"
import { Button, Dropdown, Menu } from "antd"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { BiChat, BiDollarCircle, BiReceipt } from "react-icons/bi"
import { FaAngleDown } from "react-icons/fa6"
import { FiUser } from "react-icons/fi"
import { IoMdNotificationsOutline } from "react-icons/io"
import { LiaAdSolid } from "react-icons/lia"
import { LuHeart } from "react-icons/lu"
import { RiLogoutCircleLine } from "react-icons/ri"
import { useSelector } from "react-redux"

const ProfileDropdown = ({ closeDrawer, settings, handleLogout, isDrawer }) => {

    const router = useRouter()
    const UserData = useSelector(userSignUpData)

    const items = [
        {
            key: 1,
            href: '/profile/edit-profile',
            label: (
                <div className="profDropIconCont">
                    <span><FiUser size={16} /></span>
                    <span>{t('myProfile')}</span>
                </div>
            )
        },
        {
            key: 2,
            href: '/notifications',
            label: (
                <div className="profDropIconCont">
                    <span><IoMdNotificationsOutline size={16}/></span>
                    <span>{t('notification')}</span>
                </div>
            )
        },
        {
            key: 3,
            href: '/chat',
            label: (
                <div className="profDropIconCont">
                    <span><BiChat size={16} /></span>
                    <span>{t('chat')}</span>
                </div>
            )
        },
        {
            key: 4,
            href: '/user-subscription',
            label: (
                <div className="profDropIconCont">
                    <span><BiDollarCircle size={16} /></span>
                    <span>{t('subscription')}</span>
                </div>
            )
        },
        {
            key: 5,
            href: '/ads',
            label: (
                <div className="profDropIconCont">
                    <span><LiaAdSolid size={16} /></span>
                    <span>{t('ads')}</span>
                </div>
            )
        },
        {
            key: 6,
            href: '/favourites',
            label: (
                <div className="profDropIconCont">
                    <span><LuHeart size={16} /></span>
                    <span>{t('favorites')}</span>
                </div>
            )
        },
        {
            key: 7,
            href: '/transactions',
            label: (
                <div className="profDropIconCont">
                    <span><BiReceipt size={16} /></span>
                    <span>{t('transaction')}</span>
                </div>
            )
        },
        {
            key: 8,
            label: (
                <div className="profDropIconCont">
                    <span><RiLogoutCircleLine size={16} /></span>
                    <span>{t('signOut')}</span>
                </div>
            )
        },
    ]

    const handleMenuClick = (props) => {
        closeDrawer()
        if (Number(props.key) === 8) {
            handleLogout()
            return
        }
        const item = items.find(item => item.key === Number(props.key))
        if (item?.href) {
            router.push(item.href)
        } else {
            console.error("href is undefined for menu item with key: ", props.key) // Error logging
        }
    }

    const menuProps = {
        items,
        onClick: handleMenuClick
    };

    return (
        <Dropdown
            menu={menuProps}
            className='profile_dropdown'
        // onChange={handleClose}
        >
            <Button className="d-flex align-items-center" id="dropdown-basic">

                <Image
                    src={UserData?.profile ? UserData?.profile : settings?.placeholder_image}
                    alt={UserData?.name}
                    width={32}
                    height={32}
                    onErrorCapture={placeholderImage}
                    className='profile_img_div'
                />
                <div className='username_header'>
                    {isLogin() ? (
                        UserData.name !== null && UserData.name !== "null" ? (
                            isDrawer ? truncate(UserData.name, 27) : truncate(UserData.name, 12)
                        ) : UserData.email !== "null" || UserData.email !== null ? (
                            isDrawer ? truncate(UserData.email, 27) : truncate(UserData.email, 12)
                        ) : UserData.mobile !== "undefined" ? (
                            UserData.mobile
                        ) : "Hello"
                    ) : null}
                </div>
                <FaAngleDown className='prof_down_arrow' />
            </Button>
        </Dropdown>
    )
}

export default ProfileDropdown