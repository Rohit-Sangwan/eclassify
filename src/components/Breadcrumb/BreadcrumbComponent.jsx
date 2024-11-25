'use client'
import React from 'react'
import { Breadcrumb } from 'antd';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { BreadcrumbPathData } from '@/redux/reuducer/breadCrumbSlice';
import { t } from '@/utils';

const BreadcrumbComponent = ({ title2 }) => {

  const BreadcrumbPath = useSelector(BreadcrumbPathData);

  const items = [
    {
      title: <Link href="/">{t("home")}</Link>,
      key: 'home'
    },
    ...(title2
      ? [
        {
          title: title2,
          key: 'custom',
        },
      ]
      : BreadcrumbPath && BreadcrumbPath.length > 0
        ? BreadcrumbPath.map((crumb, index) => {
          const isLast = index === BreadcrumbPath.length - 1;
          return {
            title: isLast ? crumb.name : <Link href={crumb?.slug}>{crumb?.name}</Link>,
            key: index + 1,
          };
        })
        : []),
  ];


  return (
    <div className='main_breadcrumb'>
      <div className="container">
        <Breadcrumb separator={<MdKeyboardDoubleArrowRight size={18} />} items={items} />
      </div>
    </div>
  );
}

export default BreadcrumbComponent;
