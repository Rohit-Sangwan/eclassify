'use client'
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent"
import ProfileSidebar from "@/components/Profile/ProfileSidebar"
import TransactionsTable from "@/components/Profile/TransactionsTable"
import { CurrentLanguageData } from "@/redux/reuducer/languageSlice"
import { t } from "@/utils"
import { useSelector } from "react-redux"


const Transactions = () => {

    const CurrentLanguage = useSelector(CurrentLanguageData)

    return (
        <>
        <BreadcrumbComponent title2={t('transaction')} />
            <div className='container'>
                <div className="row my_prop_title_spacing">
                    <h4 className="pop_cat_head">{t('myTransaction')}</h4>
                </div>
                <div className="row profile_sidebar">
                    <ProfileSidebar />
                    <div className="col-lg-9 p-0">
                        <div className="notif_cont">
                            <TransactionsTable />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Transactions