'use client'
import React from 'react'
import { FaAngleRight } from "react-icons/fa";
import Image from 'next/image'
import { placeholderImage } from '@/utils';
import { settingsData } from '@/redux/reuducer/settingSlice';
import { useSelector } from 'react-redux';


const ContentOne = ({ handleCategoryTabClick, CurrenCategory, userSelectedCategory }) => {
  const selectedCategoryIds = userSelectedCategory?.split(',')?.map(id => parseInt(id, 10));
  const filteredCategories = CurrenCategory?.filter(category =>
    selectedCategoryIds?.includes(category.id)
  );
  const systemSettingsData = useSelector(settingsData)
  const settings = systemSettingsData?.data

  return (
    <>
      {filteredCategories.map((tab1) => (
        <div className="col-md-6 col-lg-4 catDetails" key={tab1.id} onClick={() => handleCategoryTabClick(tab1)}>
          <div>
            <span className='imgWrapper'>
              <Image src={tab1?.image ? tab1?.image : settings?.placeholder_image} height={45} width={45} alt='categoryImg' onErrorCapture={placeholderImage} />
            </span>
            <span>{tab1.name}</span>
          </div>
          {tab1?.subcategories && tab1?.subcategories.length > 0 &&
            <span><FaAngleRight /></span>
          }
        </div>
      ))}
    </>
  );
}

export default ContentOne
