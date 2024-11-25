"use client"
import BreadcrumbComponent from '@/components/Breadcrumb/BreadcrumbComponent'
import { store } from '@/redux/store'
import { t } from '@/utils'
import React from 'react'



const AboutUs = () => {

    const settingsData = store.getState().Settings?.data
    const aboutUs = settingsData?.data?.about_us
    return (
        <section className='aboutus'>
            <BreadcrumbComponent title2={t('aboutUs')} />
            <div className='container'>
                {/* <div className="main_title">
                    <span>
                        {t('aboutUs')}
                    </span>
                </div> */}
                <div className="page_content">
                    <div dangerouslySetInnerHTML={{ __html: aboutUs || "" }} />
                </div>
            </div>
        </section>
    )
}

export default AboutUs
