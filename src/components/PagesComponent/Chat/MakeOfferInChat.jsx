'use client'
import { t } from "@/utils"

const MakeOfferInChat = ({handleOfferLaterClick, OfferPrice, setOfferPrice, handleSendOffer}) => {

    const handleOfferPriceChange = (e) => {
        setOfferPrice(e.target.value)
    }

    return (
        <div className='rateSellerWrap'>
            <div className='rateSellerCont'>
                <h6 className='makeOfferLabel'>{t('makeOffer')}</h6>
                <div className="rateExpCont">
                    <input type='number' className='auth_input' value={OfferPrice} onChange={handleOfferPriceChange} placeholder={t('typeOfferPrice')} />
                    <div className="offerBtnCont">
                        <button className='offerLaterBt' onClick={handleOfferLaterClick}>{t('offerLater')}</button>
                        <button className='reviewSubmitBtn' onClick={handleSendOffer}>{t('submit')}</button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default MakeOfferInChat