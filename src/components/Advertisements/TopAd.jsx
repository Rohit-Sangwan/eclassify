'use client'
import Image from 'next/image'
import React from 'react'
import ad from '../../../public/assets/Ad 1.png';
import { placeholderImage } from '@/utils';

const TopAd = () => {
    return (
        <div className="advertisement_div">
            <Image width={0} height={0} src={ad} alt='ad_img' className='top_ad' onErrorCapture={placeholderImage} />
        </div>
    )
}

export default TopAd
