'use client'
import { CurrentLanguageData } from "@/redux/reuducer/languageSlice.js"
import { getFaqApi } from "@/utils/api.js"
import { t } from "@/utils/index.jsx"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
const QuickAnswerAccordion = dynamic(() => import('./QuickAnswerAccordion.jsx'), {
    ssr: false
})


const QuickAnswers = () => {
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

        <div className="quick_answers" id="faq">
            {Faq && Faq.length > 0 &&
                <div className="container">
                    <div className="row">
                        <div className="ourblogs_header">
                            <p className="ourblogs_title">{t('navigating')}</p>
                            <h1 className="Ourblogs_maintitle">
                                {t('quickAnswers')}
                            </h1>
                        </div>
                        <div className="quickanswer_accordion_wrapper">
                            <QuickAnswerAccordion Faq={Faq} />
                        </div>
                    </div>
                </div>
            }
        </div>

    )
}

export default QuickAnswers