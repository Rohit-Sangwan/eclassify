import React from "react";
// import NoDataFound from "";
import Image from "next/image";
import { t } from "@/utils";

const NoChatFound = () => {
    return (
        <div className="col-12 text-center no_chat_wrapper">
            <div>
                {/* <Image loading="lazy" src={NoDataFound.src} alt="no_img" width={200} height={200}  onError={placeholderImage}/> */}
            </div>
            <div className="no_data_found_text">
                <h3>{t('noChatFound')}</h3>
                <span>{t('startConversation')}</span>
            </div>
        </div>
    );
};

export default NoChatFound;
