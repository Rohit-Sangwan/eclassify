import SingleBlog from '@/components/PagesComponent/SingleBlog/SingleBlog'
import { GET_BLOGS } from '@/utils/api';
import axios from 'axios';


export const generateMetadata = async ({ params }) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}blogs?slug=${params?.slug}`
        );
        const data = response?.data?.data?.data[0]
        const plainTextDescription = data?.description?.replace(/<\/?[^>]+(>|$)/g, "");
        return {
            title: data?.title ? data?.title : process.env.NEXT_PUBLIC_META_TITLE,
            description: plainTextDescription ? plainTextDescription : process.env.NEXT_PUBLIC_META_DESCRIPTION,
            openGraph: {
                images: data?.image ? [data?.image] : [],
            },
            keywords: data?.tags ? data?.tags : process.env.NEXT_PUBLIC_META_kEYWORDS
        };
    } catch (error) {
        console.error("Error fetching MetaData:", error);
        return null;
    }
};


const SingleBlogPage = ({ params }) => {

    return (
        <>
            <SingleBlog />
        </>
    )
}

export default SingleBlogPage