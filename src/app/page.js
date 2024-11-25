import HomePage from '@/components/Home';
import axios from 'axios';


export const generateMetadata = async () => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}seo-settings?page=home`
        );
        const home = response?.data?.data[0]

        return {
            title: home?.title ? home?.title : process.env.NEXT_PUBLIC_META_TITLE,
            description: home?.description ? home?.description : process.env.NEXT_PUBLIC_META_DESCRIPTION,
            openGraph: {
                images: home?.image ? [home?.image] : [],
            },
            keywords: home?.keywords ? home?.keywords : process.env.NEXT_PUBLIC_META_kEYWORDS
        };
    } catch (error) {
        console.error("Error fetching MetaData:", error);
        return null;
    }
};


const index = () => {

  return (
    <>
      {/* <SEO /> */}
      <HomePage />
    </>
  )
}

export default index

