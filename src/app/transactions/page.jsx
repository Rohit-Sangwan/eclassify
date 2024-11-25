import Transactions from '@/components/PagesComponent/Transactions/Transactions'
import SEO from '@/components/SEO/SEO'
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
const TransactionsPage = () => {
    return (
        <>
        {/* <SEO /> */}
        <Transactions />
        </>
    )
}

export default TransactionsPage