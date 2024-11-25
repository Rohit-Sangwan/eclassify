'use client'
import Image from "next/image"
import { placeholderImage, t, truncate } from "@/utils"
import Link from "next/link"

const PopularPosts = ({ data }) => {
    return (

        <div className="popular_posts">
            <h6 className="pop_post_title">{t('popularPosts')}</h6>
            <div className="popular_posts_item_wrapper">
            {data?.map((data, index) => (
                <Link href={`/blogs/${data?.slug}`} key={index}>
                <div className="popular_posts_item">
                    <Image src={data?.image} width={66} height={55} alt="Product" className="popular_posts_img" onErrorCapture={placeholderImage} />
                    <h6 className="popular_posts_title">{truncate(data?.title, 40)}</h6>
                </div>
                </Link>
            ))}
            </div>

        </div>
    )
}

export default PopularPosts