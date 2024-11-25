import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Modal } from 'antd'
import { MdClose } from 'react-icons/md'
import { t } from '@/utils'
import { itemOfferApi, tipsApi } from '@/utils/api'
import { FaCheck } from 'react-icons/fa6'
import { saveOfferData } from '@/redux/reuducer/offerSlice'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const MakeOfferModal = ({ IsOpenMakeOffer, OnHide, offerData }) => {
    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>
    const router = useRouter()
    const systemSettingsData = useSelector((state) => state?.Settings)
    const CurrencySymbol = systemSettingsData?.data?.data?.currency_symbol
    const [showTips, setShowTips] = useState(false)
    const [tipsData, setTipsData] = useState([])
    const [offerPrice, setOfferPrice] = useState('') // State to store offer price
    const [error, setError] = useState('') // State to store error message

    const closeOfferModal = () => {
        OnHide()
        setShowTips(true)
        setOfferPrice("")
        setError("")
    }
    const fetchTipsData = async () => {
        try {
            const response = await tipsApi.tips({})
            const { data } = response.data
            if (data.length > 0) {
                setShowTips(true)
                setTipsData(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleShowMakeOffer = () => {
        setShowTips(false)
    }

    const handleOfferPriceChange = (e) => {
        setOfferPrice(e.target.value)
        setError('') // Clear the error message when the input changes
    }

    const handleSendOffer = async () => {
        // Ensure the offer price is a valid number
        const offerAmount = parseFloat(offerPrice);
    
        if (isNaN(offerAmount) || offerAmount <= 0) {
            setError(t('offerPricePositiveError')); // Set an error message if the offer price is not valid
            return;
        }
    
        if (offerAmount > offerData.itemPrice) {
            setError(t('offerPriceError')); // Set an error message if the offer price is too high
            return;
        }
    
        try {
            const response = await itemOfferApi.offer({
                item_id: offerData.itemId,
                amount: offerAmount
            });
            const { data } = response.data;
            toast.success(response?.data?.message);
            saveOfferData(data);
            setError(''); // Clear the error message on successful offer
            router.push('/chat');
        } catch (error) {
            console.log(error);
            setError(t('offerSendError')); // Handle error during offer sending
        }
    };
    

    useEffect(() => {
        if (IsOpenMakeOffer) {
            fetchTipsData()
        }
    }, [IsOpenMakeOffer])

    return (
        <Modal
            centered
            open={IsOpenMakeOffer}
            closeIcon={CloseIcon}
            colorIconHover='transparent'
            className="ant_register_modal"
            onCancel={closeOfferModal}
            footer={null}
            maskClosable={false}
        >
            <div className='makeoffer_modal'>
                {!showTips ? (
                    <>
                        <div className='header'>
                            <h1>{t("makeAn")} <span>{t("offer")}</span></h1>
                            <p>{t("openToOffers")}</p>
                        </div>
                        <div className='sellerprice_cont'>
                            <p className='m-0'>{t("sellerPrice")}</p>
                            <span>{CurrencySymbol} {offerData?.itemPrice}</span>
                        </div>
                        <div className='sendoffer_cont'>
                            <div className='auth_in_cont'>
                                <label htmlFor="offer" className='auth_pers_label'>{t("yourOffer")}</label>
                                <input
                                    type="number"
                                    id='offer'
                                    className='auth_input'
                                    placeholder={t("typeOfferPrice")}
                                    value={offerPrice}
                                    onChange={handleOfferPriceChange}
                                />
                                {error && <span className={`error_message ${error ? 'show' : ''}`}>{error}</span>}
                            </div>
                            <button className='sendoffer_btn' onClick={handleSendOffer}>{t("sendOffer")}</button>
                        </div>
                    </>
                ) : (
                    <div className='safetyTips'>
                        <div className='header'>
                            <h1>{t("safety")} <span>{t("tips")}</span></h1>
                        </div>
                        <div className="tips_list">
                            <div className="row">
                                {tipsData && tipsData.map((ele, index) => (
                                    <div className="col-12" key={index}>
                                        <div className="tip">
                                            <div className="tip_correct_icon">
                                                <FaCheck size={18} />
                                            </div>
                                            <div className="tips_desc">
                                                <p>{ele?.translated_name}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="continue_button" onClick={handleShowMakeOffer}>
                            <button>{t('continue')}</button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default MakeOfferModal
