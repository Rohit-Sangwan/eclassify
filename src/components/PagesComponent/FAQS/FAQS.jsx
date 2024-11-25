"use client"
import BreadcrumbComponent from '@/components/Breadcrumb/BreadcrumbComponent'
import QuickAnswerAccordion from '@/components/LandingPage/QuickAnswerAccordion'
import NoData from '@/components/NoDataFound/NoDataFound'
import { CurrentLanguageData } from '@/redux/reuducer/languageSlice'
import { store } from '@/redux/store'
import { t } from '@/utils'
import { getFaqApi } from '@/utils/api'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const FAQS = () => {
    
    const [Faq, setFaq] = useState([])
    const CurrentLanguage = useSelector(CurrentLanguageData)

    const getFaqData = async () => {
        try {
            const res = await getFaqApi.getFaq()
            setFaq(res?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getFaqData()
    }, [])

    return (
        <section className='static_pages'>
            <BreadcrumbComponent title2={t("faqs")} />
            <div className='container'>
                <div className="static_div">
                    <div className="main_title">
                        <span>
                            {t('faqs')}
                        </span>
                    </div>
                    <div className="page_content p-0">
                        <div className="quickanswer_accordion_wrapper">
                            {Faq && Faq.length > 0 ? (

                                <QuickAnswerAccordion Faq={Faq} />
                            ) : (
                                <div>
                                    <NoData />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FAQS
