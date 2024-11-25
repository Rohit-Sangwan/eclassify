import Favourites from "@/components/PagesComponent/Favourites/Favourites"
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

const FavouritesPage = () => {
    return (
        <>
         {/* <SEO /> */}
            <Favourites />
        </>
    )
}

export default FavouritesPage