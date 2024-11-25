import React from "react";
import NoDataFound from "../../../public/assets/no_data_found_illustrator.svg";
import Image from "next/image";
import { placeholderImage, t } from "@/utils";

const NoData = () => {
    return (
        <div className="col-12 text-center no_data_conatiner">
            <div>
                <Image loading="lazy" src={NoDataFound} alt="no_img" width={200} height={200}  onError={placeholderImage}/>
            </div>
            <div className="no_data_found_text">
                <h3>{t('noDataFound')}</h3>
                <span>{t('sorryTryAnotherWay')}</span>
            </div>
        </div>
    );
};

export default NoData;
