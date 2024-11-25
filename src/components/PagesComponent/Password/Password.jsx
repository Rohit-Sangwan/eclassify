import ProfileSidebar from "@/components/Profile/ProfileSidebar"
import { t } from "@/utils"


const Password = () => {
    return (
        <div className='container'>
            <div className="row my_prop_title_spacing">
                <h4 className="pop_cat_head">{t('password')}</h4>
            </div>
            <div className="row profile_sidebar">
                <ProfileSidebar />
                <div className="col-lg-9 p-0">
                    <div className="profile_content">
                        <div className='personal_info'>
                            <h5 className='personal_info_text'>{t('personalInfo')}</h5>
                            <form>
                                <div className="authrow">
                                    <div className='auth_in_cont'>
                                        <label htmlFor="currentPassword" className='auth_pers_label' >Current Password</label>
                                        <input type="text" id='currentPassword' className='auth_input personal_info_input' />
                                    </div>
                                    <div className='auth_in_cont'>
                                        <label htmlFor="newPassword" className='auth_pers_label' >New Password</label>
                                        <input type="text" id='newPassword' className='auth_input personal_info_input' />
                                    </div>
                                    <div className='auth_in_cont'>
                                        <label htmlFor="confirmPassword" className='auth_pers_label' >Confirm Password</label>
                                        <input type="text" id='confirmPassword' className='auth_input personal_info_input' />
                                    </div>
                                </div>

                            </form>
                        </div>
                        <button className='sv_chng_btn'>{t('saveChanges')}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Password