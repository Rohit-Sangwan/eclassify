'use client'
import React from 'react'
import { FaAngleRight } from "react-icons/fa";
import Image from 'next/image'
import { useSelector } from 'react-redux';
import { placeholderImage } from '@/utils';
import { t } from "@/utils"
import { settingsData } from '@/redux/reuducer/settingSlice';



const ContentOne = ({ handleCategoryTabClick, CurrenCategory, currentPage, lastPage, fetchMoreCategory, IsLoading, IsLoadMoreCat }) => {

  const systemSettingsData = useSelector(settingsData)
  const settings = systemSettingsData?.data

  return (
    <>
      <>

        {
          CurrenCategory.length > 0 && <span className='contentTitle'>{t('allCategory')}</span>
        }

        {CurrenCategory.length > 0 && CurrenCategory.map((tab1) => (

          <div className="col-md-6 col-lg-4 catDetails" key={tab1?.id} onClick={() => handleCategoryTabClick(tab1)}>
            <div>
              <span className='imgWrapper'>
                <Image src={tab1?.image ? tab1.image : settings?.placeholder_image} height={45} width={45} alt='categoryImg' onErrorCapture={placeholderImage} />
              </span>
              <span>{tab1.translated_name}</span>
            </div>
            {tab1?.subcategories_count && tab1?.subcategories_count > 0 ?
              (
                <span><FaAngleRight className='angle_right' /></span>
              ) : null
            }
          </div>
        ))}

        {
          IsLoading && <div className="loader adListingLoader"></div>
        }

      </>
      {
        IsLoadMoreCat ? (
          <div className="loader adListingLoader"></div>
        ) : (
          currentPage < lastPage && (
            <div className="loadMore">
              <button onClick={fetchMoreCategory}> {t('loadMore')} </button>
            </div>
          )
        )
      }

    </>
  );

}

export default ContentOne
