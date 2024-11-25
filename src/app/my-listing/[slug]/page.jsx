import SingleListing from '@/components/PagesComponent/SingleListing/SingleListing'
import React from 'react'
export const metadata = {
    title: process.env.NEXT_PUBLIC_META_TITLE,
    description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
    keywords: process.env.NEXT_PUBLIC_META_kEYWORDS,
    openGraph: {
        title: process.env.NEXT_PUBLIC_META_TITLE,
        description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
        keywords: process.env.NEXT_PUBLIC_META_kEYWORDS,
      },
}
const SingleListingPage = ({ params }) => {
    return (
        <>
            {/* <SEO /> */}
            <SingleListing slug={params.slug} />
        </>
    )
}

export default SingleListingPage