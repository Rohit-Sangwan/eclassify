import { t } from "@/utils"
import { IoGiftOutline } from "react-icons/io5"

const NoConvWithSeller = ({handleMakeOfferInStart}) => {
    return (
        <div className="noConv">
            <div className="noConvContent">
                <h1 className="noConvTitle">{t('noConvWithSeller')}</h1>
                <p className="noConvDesc">{t('notInitiated')}</p>
            </div>

            <button className="makeOfferCont" onClick={handleMakeOfferInStart}>
                <span><IoGiftOutline size={20} /></span>
                <span>{t('makeOffer')}</span>
            </button>

        </div>
    )
}

export default NoConvWithSeller