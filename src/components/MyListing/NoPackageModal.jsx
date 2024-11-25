'use client'
import { t } from '@/utils'
import { createFeaturedItemApi } from '@/utils/api'
import { Modal } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const NoPackageModal = ({ IsNoPackageModal, OnHide, IsGranted, item_id }) => {

    const router = useRouter()

    const createFeaturedAd = async () => {
        try {
            const res = await createFeaturedItemApi.createFeaturedItem({ item_id, positions: 'home_screen' })
            if (res?.data?.error === false) {
                toast.success(t('featuredAdCreated'))
            }
            else {
                toast.error(res?.data?.message)
            }
            OnHide()
            router.push('/ads')
        } catch (error) {
            console.log(error)
        }
    }

    return (

        <Modal
            centered
            open={IsNoPackageModal}
            colorIconHover='transparent'
            onCancel={OnHide}
            footer={null}
            closeIcon={null}
            className='nopackage_modal'
        >
            {
                IsGranted ?
                    <div className='nopackage'>
                        <div className='nopackage_content'>
                            <h2>{t('createFeaturedAd')}</h2>
                            <p>{t('youWantToCreateFeaturedAd')}</p>
                        </div>
                        <div className='nopackage_btn_cont'>
                            <button className='cancel' onClick={OnHide}>{t('cancel')}</button>
                            <button className='subscribe' onClick={createFeaturedAd}>{t('yes')}</button>
                        </div>
                    </div>
                    :
                    <div className='nopackage'>
                        <div className='nopackage_content'>
                            <h2>{t('noPackage')}</h2>
                            <p>{t('pleaseSubscribes')}</p>
                        </div>
                        <div className='nopackage_btn_cont'>
                            <button className='cancel' onClick={OnHide}>{t('cancel')}</button>
                            <Link href='/user-subscription' className='subscribe'>{t('subscribe')}</Link>
                        </div>
                    </div>
            }
        </Modal>
    )
}

export default NoPackageModal