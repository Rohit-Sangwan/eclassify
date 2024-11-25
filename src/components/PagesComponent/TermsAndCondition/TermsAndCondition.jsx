'use client'
import React from 'react'
import BreadcrumbComponent from '@/components/Breadcrumb/BreadcrumbComponent'
import { store } from '@/redux/store'
import { t } from '@/utils'

const TermsAndCondition = () => {

    const settingsData = store.getState().Settings.data
    const privacy = settingsData?.data?.terms_conditions
    return (
        <section className='aboutus'>
            <BreadcrumbComponent title2={t('termsConditions')} />
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

export default TermsAndCondition
