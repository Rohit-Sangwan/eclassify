'use client'
import { Modal } from "antd"
import trueGif from '../../../../public/assets/true.gif'
import Image from "next/image"
import Link from "next/link"
import { placeholderImage, t } from "@/utils"


const AdSuccessfulModal = ({ IsAdSuccessfulModal, OnHide, CreatedAdSlug }) => {
    return (
        <Modal
            centered
            open={IsAdSuccessfulModal}
            colorIconHover='transparent'
            onCancel={OnHide}
            footer={null}
            closeIcon={null}
            className='adsuccessfull_modal'
            maskClosable={false}
        >
            <div className="adsuccessfull">
                <Image src={trueGif} width={250} height={250} alt="True" onErrorCapture={placeholderImage} />
                <h2 className="ad_succ_head">{t('adPostedSuccess')}</h2>
                <Link href={`/my-listing/${CreatedAdSlug}`} className="viewAdBtn">{t('viewAd')}</Link>
                <Link href='/' className="backtoHome">{t('backToHome')}</Link>
            </div>
        </Modal>
    )
}

export default AdSuccessfulModal