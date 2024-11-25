import ContactUs from "@/components/PagesComponent/ContactUs/ContactUs"

export const generateMetadata = async () => {
  try {
    const title = 'Contact Us';

    return {
      title: title,
      description: process.env.NEXT_PUBLIC_META_DESCRIPTION,
      openGraph: {
        images: [],
      },
      keywords: process.env.NEXT_PUBLIC_META_KEYWORDS
    };
  } catch (error) {
    console.error("Error fetching MetaData:", error);
    return null;
  }
};

const ContactUsPage = () => {
  return (
    <>
      {/* <SEO /> */}
      <ContactUs />
    </>
  )
}

export default ContactUsPage