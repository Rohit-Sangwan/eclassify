import FAQS from '@/components/PagesComponent/FAQS/FAQS'
import axios from 'axios';
import React from 'react'

export const generateMetadata = async () => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}seo-settings?page=faqs`
        );
        const faqs = response?.data?.data[0]
  
        return {
            title: faqs?.title ? faqs?.title : process.env.NEXT_PUBLIC_META_TITLE,
            description: faqs?.description ? faqs?.description : process.env.NEXT_PUBLIC_META_DESCRIPTION,
            openGraph: {
                images: faqs?.image ? [faqs?.image] : [],
            },
            keywords: faqs?.keywords ? faqs?.keywords : process.env.NEXT_PUBLIC_META_kEYWORDS
        };
    } catch (error) {
        console.error("Error fetching MetaData:", error);
        return null;
    }
  };

const page = () => {
    return (
        <div>
            <FAQS />
        </div>
    )
}

export default page
