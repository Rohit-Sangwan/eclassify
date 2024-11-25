import SEO from "@/components/SEO/SEO";
import dynamic from "next/dynamic";

const EditListing = dynamic(() => import("@/components/PagesComponent/EditListing/EditListing"))
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
const EditListingPage = ({ params }) => {
    return (
        <>
         {/* <SEO /> */}
        <EditListing id={params.slug} />
        </>
    )
}

export default EditListingPage;