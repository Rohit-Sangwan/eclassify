import SellerProfile from "@/components/PagesComponent/SellerProfile/SellerProfile"
import axios from "axios";


export const generateMetadata = async ({ params }) => {
    try {

        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}get-seller?id=${params?.id}`
        );

        const seller = response?.data.data?.seller
        const title = seller?.name
        const image = seller?.profile

        return {
            title: title ? title : process.env.NEXT_PUBLIC_META_TITLE,
            description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
            openGraph: {
                images: image ? [image] : [],
            },
            keywords: process.env.NEXT_PUBLIC_META_kEYWORDS
        };
    } catch (error) {
        console.error("Error fetching MetaData:", error);
        return null;
    }
};



const SellerProfilePage = ({ params }) => {

    return (
        <SellerProfile id={params?.id} />
    )
}

export default SellerProfilePage