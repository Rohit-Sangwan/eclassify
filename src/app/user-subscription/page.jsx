import ProfileSubscription from "@/components/PagesComponent/Subscription/ProfileSubscription"
import SEO from "@/components/SEO/SEO"


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
const SubscriptionPage = () => {
    return (
        <>
            {/* <SEO /> */}
            <ProfileSubscription />
        </>
    )
}

export default SubscriptionPage