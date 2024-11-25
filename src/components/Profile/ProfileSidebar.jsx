'use client'
import { logoutSuccess } from '../../redux/reuducer/authSlice';
import { t } from '@/utils';
import FirebaseData from '@/utils/Firebase';
import { deleteUserApi } from '@/utils/api';
import { deleteUser, getAuth } from 'firebase/auth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { BiChat, BiDollarCircle, BiReceipt, BiShieldAlt2, BiTrashAlt } from 'react-icons/bi'
import { FiUser } from 'react-icons/fi';
import { IoMdNotificationsOutline } from 'react-icons/io'
import { LiaAdSolid } from "react-icons/lia";
import { LuHeart } from "react-icons/lu";
import { RiLogoutCircleLine } from 'react-icons/ri';
import Swal from 'sweetalert2';

const ProfileSidebar = () => {
    const router = useRouter()
    const pathname = usePathname()

    const { signOut } = FirebaseData();

    const handleLogout = () => {
        Swal.fire({
            title: `${t('areYouSure')} \u200E`,
            text: `${t('logoutConfirmation')} \u200E`,
            icon: "warning",
            showCancelButton: true,
            customClass: {
                confirmButton: 'Swal-confirm-buttons',
                cancelButton: "Swal-cancel-buttons"
            },
            confirmButtonText: t("yes"),
        }).then((result) => {
            if (result.isConfirmed) {

                // Perform the logout action
                logoutSuccess();
                signOut()
                router.push('/')

                toast.success(t('signOutSuccess'));
            } else {
                toast.error(t('signOutCancelled'));
            }
        });
    };



    const handleDeleteAcc = async () => {
        // Initialize Firebase Authentication
        const auth = getAuth();

        // Get the currently signed-in user
        const user = auth.currentUser;

        Swal.fire({
            title: `${t('areYouSure')} \u200E`,
            html: `
            <ul>
                <li class="delete_acc_points">${t('adsAndTransactionWillBeDeleted')}</li>
                <li class="delete_acc_points">${t('accountsDetailsWillNotRecovered')}</li>
                <li class="delete_acc_points">${t('subWillBeCancelled')}</li>
                <li class="delete_acc_points">${t('savedMesgWillBeLost')}</li>
            </ul>
        `,

            icon: "warning",
            showCancelButton: true,
            customClass: {
                confirmButton: 'Swal-confirm-buttons',
                cancelButton: "Swal-cancel-buttons"
            },
            cancelButtonColor: "#d33",
            confirmButtonText: t("yes"),
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Delete the user
                    await deleteUser(user);

                    // Call your API to delete user data
                    const response = await deleteUserApi.deleteUser();

                    router.push("/");
                    toast.success(t("userDeleteSuccess"));
                    logoutSuccess();
                } catch (error) {
                    console.error('Error deleting user:', error.message);
                    if (error.code === "auth/requires-recent-login") {
                        router.push("/");
                        toast.error(t("deletePop"));
                        logoutSuccess();
                    }
                }
            } else {
            }
        });
    };


    return (
        <div className="col-lg-3 p-0">
            <div className='profile_tab_cont'>
                <Link href='/profile/edit-profile' className={`profile_sidebar_tab ${pathname === '/profile/edit-profile' && 'active_tab'}`}>
                    <FiUser size={24} />
                    <span className='profile_sidebar_notif'>{t('editProfile')}</span>
                </Link>
                <Link href='/notifications' className={`profile_sidebar_tab ${pathname === '/notifications' && 'active_tab'}`}>
                    <IoMdNotificationsOutline size={24} />
                    <span className='profile_sidebar_notif'>{t('notifications')}</span>
                </Link>
                <Link href='/chat' className={`profile_sidebar_tab ${pathname === '/chat' && 'active_tab'}`}>
                    <BiChat size={24} />
                    <span className='profile_sidebar_notif'>{t('chat')}</span>
                </Link>
                <Link href='/user-subscription' className={`profile_sidebar_tab ${pathname === '/user-subscription' && 'active_tab'}`}>
                    <BiDollarCircle size={24} />
                    <span className='profile_sidebar_notif'>{t('subscription')}</span>
                </Link>
                <Link href='/ads' className={`profile_sidebar_tab ${pathname === '/ads' && 'active_tab'}`}>
                    <LiaAdSolid size={24} />
                    <span className='profile_sidebar_notif'>{t('ads')}</span>
                </Link>
                <Link href='/favourites' className={`profile_sidebar_tab ${pathname === '/favourites' && 'active_tab'}`}>
                    <LuHeart size={24} />
                    <span className='profile_sidebar_notif'>{t('favourites')}</span>
                </Link>
                <Link href='/transactions' className={`profile_sidebar_tab ${pathname === '/transactions' && 'active_tab'}`}>
                    <BiReceipt size={24} />
                    <span className='profile_sidebar_notif'>{t('transaction')}</span>
                </Link>
                {/* <Link href='/password' className={`profile_sidebar_tab ${pathname === '/password' && 'active_tab'}`}>
                        <BiShieldAlt2 size={24} />
                        <span className='profile_sidebar_notif'>Password</span>
                    </Link> */}
                <div className="profile_sidebar_tab" onClick={handleLogout}>
                    <RiLogoutCircleLine size={24} />
                    <span className='profile_sidebar_notif'>{t('signOut')}</span>
                </div>
                <div className="profile_sidebar_tab" onClick={handleDeleteAcc}>
                    <BiTrashAlt size={24} className='delete_account' />
                    <span className='profile_sidebar_notif delete_account'>{t('deleteAccount')}</span>
                </div>
            </div>
        </div>
    )
}

export default ProfileSidebar