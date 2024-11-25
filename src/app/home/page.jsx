
import LandingPage from "@/components/LandingPage"
import SEO from "@/components/SEO/SEO"
// import 
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
const HomePage = () => {
    return (
        <>
            {/* <SEO /> */}
            <LandingPage />
        </>
    )
}

export default HomePage