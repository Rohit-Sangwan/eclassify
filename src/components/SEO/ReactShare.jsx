import React from 'react'
import { Menu } from 'antd';
import { FacebookIcon, FacebookShareButton, TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from 'react-share';
import { CiLink } from "react-icons/ci";
import { t } from '@/utils';

const ReactShare = ({ currentUrl, handleCopyUrl, data, CompanyName }) => {
    const headline = `🚀 Discover the perfect deal! Explore "${data}" from ${CompanyName} and grab it before it's gone. Shop now at`;

    return (
        <>
            <Menu>
                <Menu.Item key="1">
                    <FacebookShareButton className="w-100" url={currentUrl} title={headline} hashtag={CompanyName}>
                        <div className='shareLabelCont'>
                            <FacebookIcon size={30} round />
                            <span>{t('facebook')}</span>
                        </div>
                    </FacebookShareButton>
                </Menu.Item>
                <Menu.Item key="2">
                    <TwitterShareButton className="w-100" url={currentUrl} title={headline}>
                        <div className='shareLabelCont'>
                            <XIcon size={30} round />
                            <span>X</span>
                        </div>
                    </TwitterShareButton>
                </Menu.Item>
                <Menu.Item key="3">
                    <WhatsappShareButton className="w-100" url={currentUrl} title={headline} hashtag={CompanyName}>
                        <div className='shareLabelCont'>
                            <WhatsappIcon size={30} round />
                            <span>{t('whatsapp')}</span>
                        </div>
                    </WhatsappShareButton>
                </Menu.Item>
            
                <Menu.Item key="4">
                    <div className='shareLabelCont' onClick={handleCopyUrl}>
                        <CiLink size={30} />
                        <span>{t("copyLink")}</span>
                    </div>
                </Menu.Item>
            </Menu>
        </>
    )
}

export default ReactShare;
