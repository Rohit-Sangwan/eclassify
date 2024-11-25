import Chat from "@/components/PagesComponent/Chat/Chat"
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
const ChatPage = () => {
    return (
        <>
            {/* <SEO /> */}
            <Chat />
        </>
    )
}

export default ChatPage