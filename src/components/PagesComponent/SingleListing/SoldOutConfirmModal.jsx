import { t } from "@/utils"
import { Modal } from "antd"
import Link from "next/link"


const SoldOutConfirmModal = ({ isOpen, OnHide, makeItemSoldOut }) => {
    return (
        <Modal
            centered
            open={isOpen}
            colorIconHover='transparent'
            onCancel={OnHide}
            footer={null}
            closeIcon={null}
            className='nopackage_modal'
        >
            <div className='nopackage'>
                <div className='nopackage_content'>
                    <h2>{t('confirmSoldOut')}</h2>
                    <p>{t('cantUndoChanges')}</p>
                </div>
                <div className='nopackage_btn_cont'>
                    <button className='cancel' onClick={OnHide}>{t('cancel')}</button>
                    <button className='subscribe' onClick={makeItemSoldOut}>{t('confirm')}</button>
                </div>
            </div>

        </Modal>
    )
}

export default SoldOutConfirmModal