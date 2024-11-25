'use client'
import { FaArrowRight, FaCheck } from 'react-icons/fa6'

import Image from 'next/image'
import { placeholderImage, t } from '@/utils'
import { useSelector } from 'react-redux'

const SubscriptionCard = ({ data, handlePurchasePackage }) => {

    const descriptionItems = data?.description ? data.description.split('\r\n') : [];
    const systemSettingsData = useSelector((state) => state?.Settings)
    const CurrencySymbol = systemSettingsData?.data?.data?.currency_symbol
    return (
        <div className={`card regular_card ${data.is_active ? 'active_card' : ""}`}>
            <div className="card-header">
                <div className="sub_icon_div">
                    <Image src={data?.icon} alt={data?.name} width={80} height={80} className='sub_icon' onErrorCapture={placeholderImage} />
                </div>
                <div className="sub_details">
                    <span className='name'>{data?.name}</span>
                    <div className="price">
                        {data?.final_price !== 0 ? (
                            <div className='price_with_currency'>
                                <span className="currency">{CurrencySymbol}</span>
                                <span className="price">{data?.final_price}</span>
                            </div>

                        ) : (
                            "Free"
                        )}
                        {
                            data?.price > data?.final_price &&
                            <div className='sale_price'>
                                <span>{CurrencySymbol}</span>
                                <span>{data?.price}</span>
                            </div>
                        }
                    </div>
                    {!data.is_active ? (
                        data?.discount_in_percentage !== 0 && <span className='sale_tag'> {t('off')} {data?.discount_in_percentage}%</span>
                    ) : null
                    }
                </div>
            </div>
            <div className="card-body">
                <div className="details_list">
                    <div className="list_menu">
                        <div>
                            <FaCheck size={24} className='right' />
                        </div>
                        <div>
                            <span >{data?.item_limit} {t('adsListing')}</span>
                        </div>
                    </div>
                    <div className="list_menu">
                        <div>
                            <FaCheck size={24} className='right' />
                        </div>
                        <div>
                            <span >{data?.duration !== "unlimited" ? `${data?.duration}  ${t('days')}` : `${data?.duration}  ${t('days')}`}  </span>
                        </div>

                    </div>

                    {descriptionItems.map((item, index) => (
                        <div className="list_menu" key={index}>
                            <div>
                                <FaCheck size={24} className='right' />
                            </div>
                            <div>
                                <span >{item}</span>
                            </div>
                        </div>
                    ))
                    }
                </div>
            </div>

            <div className="card-footer">

                <button onClick={(e) => handlePurchasePackage(e, data)} style={{ visibility: data.is_active ? 'hidden' : 'visible' }}>
                    <span>
                        {t('choosePlan')}
                    </span>
                    <FaArrowRight size={24} className='sub_card_arrow' />
                </button>

            </div>
        </div>
    )
}

export default SubscriptionCard