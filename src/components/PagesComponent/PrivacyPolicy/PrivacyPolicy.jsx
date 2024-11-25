'use client'
import React from 'react'
import BreadcrumbComponent from '@/components/Breadcrumb/BreadcrumbComponent'
import { store } from '@/redux/store'
import { t } from '@/utils'

const PrivacyPolicy = () => {

    const settingsData = store.getState().Settings.data
    const privacy = settingsData?.data?.privacy_policy
    return (
        <section className='aboutus'>
            <BreadcrumbComponent title2={t('privacyPolicy')} />
            <div className='container'>
                {/* <div className="main_title">
                    <span>
                        {t('aboutUs')}
                    </span>
                </div> */}
                <div className="page_content">
                    <div dangerouslySetInnerHTML={{ __html: privacy || "" }} />
                </div>
            </div>
        </section>
    )
}

export default PrivacyPolicy
