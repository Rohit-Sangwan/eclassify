'use client'
import React from 'react'
import Err404 from "../../public/assets/no_data_found_illustrator.svg"
import Link from 'next/link'
import { placeholderImage, t } from '@/utils'
import { FaArrowLeft } from 'react-icons/fa6'

const NotFoundPage = ({ page }) => {
  return (
    <div className='err404'>
      <img loading="lazy" height={500} width={500} src={Err404} alt="404-Img" onErrorCapture={placeholderImage} />
      <Link href='/' prefetch={false}><button className='btn'><FaArrowLeft /> {t('back')}</button></Link>
    </div>
  )
}

export default NotFoundPage
