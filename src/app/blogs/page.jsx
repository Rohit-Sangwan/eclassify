import Blogs from '@/components/PagesComponent/Blogs/Blogs'
import axios from 'axios';


export const generateMetadata = async () => {
  try {
      const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}seo-settings?page=blogs`
      );
      const blogs = response?.data?.data[0]

      return {
          title: blogs?.title ? blogs?.title : process.env.NEXT_PUBLIC_META_TITLE,
          description: blogs?.description ? blogs?.description : process.env.NEXT_PUBLIC_META_DESCRIPTION,
          openGraph: {
              images: blogs?.image ? [blogs?.image] : [],
          },
          keywords: blogs?.keywords ? blogs?.keywords : process.env.NEXT_PUBLIC_META_kEYWORDS
      };
  } catch (error) {
      console.error("Error fetching MetaData:", error);
      return null;
  }
};


const page = () => {
  return (
    <div>
      <Blogs />
    </div>
  )
}

export default page
