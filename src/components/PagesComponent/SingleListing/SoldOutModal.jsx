'use client'
import { placeholderImage, t } from '@/utils'
import { Checkbox, Modal, Radio } from 'antd'
import Image from 'next/image'
import { MdClose } from 'react-icons/md'
import { useEffect, useState } from 'react'
import { getItemBuyerListApi } from '@/utils/api'
import { useSelector } from 'react-redux'
import NoDataFound from '../../../../public/assets/no_data_found_illustrator.svg'



const SoldOutModal = ({ SingleListing, IsSoldOutModalOpen, OnHide, handleSoldOut, selectedRadioValue, setSelectedRadioValue }) => {

    const CloseIcon = <div className="close_icon_cont"><MdClose size={24} color="black" /></div>
    const systemSettingsData = useSelector((state) => state?.Settings)
    const placeholder_image = systemSettingsData?.data?.placeholder_image

    const CurrencySymbol = systemSettingsData?.data?.data?.currency_symbol

    const [isNoneOfAboveChecked, setIsNoneOfAboveChecked] = useState(false);
    const [Buyer, setBuyer] = useState([])

    const getBuyers = async () => {
        try {
            const res = await getItemBuyerListApi.getItemBuyerList({ item_id: SingleListing?.id })
            setBuyer(res?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (IsSoldOutModalOpen) {
            getBuyers()
        }
    }, [IsSoldOutModalOpen])


    const NoBuyersFound = () => {
        return (
            <div className="col-12 text-center no_buyers">
                <div>
                    <Image loading="lazy" src={NoDataFound} alt="no_img" width={200} height={200} onError={placeholderImage} />
                </div>
                <h3>{t('noBuyersFound')}</h3>
            </div>
        )
    }

    // Handler for radio button change
    const onRadioChange = (e) => {
        setSelectedRadioValue(e.target.value);
    };

    // Handler for checkbox change
    const onCheckboxChange = (e) => {
        setIsNoneOfAboveChecked(e.target.checked);
    };

    // Determine if the apply_btn_transparent class should be applied
    const isTransparent = selectedRadioValue !== null || isNoneOfAboveChecked;
    const isCheckboxDisabled = selectedRadioValue !== null;


    return (
        <Modal
            centered
            open={IsSoldOutModalOpen}
            closeIcon={CloseIcon}
            colorIconHover='transparent'
            className="ant_register_modal"
            onCancel={OnHide}
            footer={null}
            maskClosable={false}
        >
            <div className='soldOutModal'>
                <h5 className='whoMadePurchase'>{t('whoMadePurchase')}</h5>
                <div className='adItemDet'>
                    <Image src={SingleListing?.image || placeholder_image} width={72} height={72} alt='Ad Item' className='adItemImg' onErrorCapture={placeholderImage} />
                    <div className='adItemContent'>
                        <p className='adItemName'>{SingleListing?.name}</p>
                        <span className='adItemPrice'>{CurrencySymbol} {SingleListing?.price}</span>
                    </div>
                </div>
                <p className='selectBuyerFromList'>{t('selectBuyerFromList')}</p>

                {Buyer?.length === 0 ? (
                    <NoBuyersFound />
                ) : (
                    <Radio.Group className='soldOutRadioGroup' onChange={onRadioChange}>
                        {Buyer.map((buyer, index) => (
                            <div className='adBuyersList' key={index}>
                                <div className='adBuyer'>
                                    <Image src={buyer?.profile || placeholder_image} width={48} height={48} alt='Ad Buyer' className='AdBuyerImg' onErrorCapture={placeholderImage} />
                                    <span className='adBuyerName'>{buyer?.name}</span>
                                </div>
                                <Radio className='soldOutRadio' value={buyer?.id} disabled={isNoneOfAboveChecked} />
                            </div>
                        ))}
                    </Radio.Group>
                )}
                <div className='submitSoldOut'>
                    <div className='noneOfAboveContainer'>
                        <Checkbox onChange={onCheckboxChange} disabled={isCheckboxDisabled} className='noneOfAbobeCheck'>{t('noneOfAbove')}</Checkbox>
                    </div>
                    <button disabled={!isTransparent} onClick={handleSoldOut} className={`mrkAsSoldOut ${isTransparent && 'apply_btn_transparent'}`}>{t('soldOut')}</button>
                </div>
            </div>
        </Modal>
    )
}

export default SoldOutModal