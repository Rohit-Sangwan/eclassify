import { Providers } from "@/redux/store/providers";
import "../../public/css/style.css";
import "bootstrap/dist/css/bootstrap.css";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import 'react-loading-skeleton/dist/skeleton.css'
import Layout from "@/components/Layout/Layout";
import { store } from "@/redux/store";


export default function RootLayout({ children }) {

  const settingsData = store.getState().Settings?.data
  const placeApiKey = settingsData?.data?.place_api_key
  const favicon = settingsData?.data?.favicon_icon


  return (
    <html lang="en" web-version={process.env.NEXT_PUBLIC_WEB_VERSION}>
      <Head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
        <script src="https://js.paystack.co/v1/inline.js"></script>
        <link rel="shortcut icon" href={favicon} sizes="32x32" type="image/png" />
        <meta property="og:image" content={favicon} />
        <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${placeApiKey}&libraries=places&loading=async`}></script>
      </Head>

      <body>
        {/* Google Adsence */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxxxxxx"
          crossorigin="anonymous"></script> */}
        <Providers >
          <Toaster position="top-center" reverseOrder={false} />
          <>
            <Layout>
              {children}
            </Layout>
          </>
        </Providers>
      </body>
    </html>
  );
}

