'use client'
import Image from 'next/image'
import { placeholderImage } from '@/utils'
import Link from 'next/link'

const PopularCategory = ({ data }) => {
    return (
        <Link href={`/category/${data?.slug}`} className='pop_cat_cont'>
            <div className="pop_cat_icon_cont">
                <Image src={data?.image} width={65} height={58.5} alt='Category Icon' className='pop_cat_icon' onErrorCapture={placeholderImage} />
            </div>
            <h6 className='pop_cat_name'>{data?.translated_name}</h6>
        </Link>
    )
}

export default PopularCategory