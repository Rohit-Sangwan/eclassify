'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa6'
import { placeholderImage, t } from '@/utils'

const OurBlogCard = ({ data }) => {

    const maxLength = 100;
    const stripHtmlAndTruncate = (html, maxLength) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        const text = div.innerText;
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (

        <div className='ourblog_card'>
            <Image src={data?.image} width={388} height={200} alt={data?.title} className='blog_card_img' onErrorCapture={placeholderImage} />
            <h5 className='ourblog_card_title'>
                {data?.title}
            </h5>
            <div className='ourblog_card_desc' dangerouslySetInnerHTML={{ __html: data?.description }} />
            <Link href={`/blogs/${data?.slug}`} className='read_article' >
                <span>
                    {t('readArticle')}
                </span>
                <span> <FaArrowRight size={20} className='read_icon' /></span>
            </Link>
        </div>

    )
}

export default OurBlogCard