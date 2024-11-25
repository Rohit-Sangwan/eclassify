'use client'
import OurBlogCard from "@/components/Cards/OurBlogCard"
import Tags from "@/components/OurBlogPage/Tags"
import Image from "next/image"
import { FaEye, FaRegCalendarCheck } from "react-icons/fa6"
import { formatDateMonth, placeholderImage, t, truncate } from "@/utils"
import { useParams, usePathname } from "next/navigation"
import { getBlogTagsApi, getBlogsApi } from "@/utils/api"
import { useEffect, useState } from "react"
import { store } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import { setBreadcrumbPath } from "@/redux/reuducer/breadCrumbSlice"
import BreadcrumbComponent from "@/components/Breadcrumb/BreadcrumbComponent"
import { CurrentLanguageData } from "@/redux/reuducer/languageSlice"
import { BiLink, BiLogoFacebook, BiLogoLinkedin, BiLogoWhatsapp } from "react-icons/bi"
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share"
import { RiTwitterXLine } from "react-icons/ri"
import toast from "react-hot-toast"


const SingleBlog = () => {

    const dispatch = useDispatch()
    const router = useParams()
    const blogSlug = router?.slug
    const settingsData = store.getState().Settings?.data
    const admin = settingsData?.data?.admin
    const path = usePathname()
    const currentUrl = `${process.env.NEXT_PUBLIC_WEB_URL}${path}`;
    const CompanyName = settingsData?.data?.company_name

    const CurrentLanguage = useSelector(CurrentLanguageData)
    const [blogData, setBlogData] = useState({})
    const [blogTags, setBlogTags] = useState([])
    const [relatedBlogs, setRelatedBlogs] = useState([])

    const getBlogsData = async () => {
        try {
            const res = await getBlogsApi.getBlogs({ slug: blogSlug })
            setBlogData(res?.data?.data?.data[0])
            const title = res?.data?.data?.data[0]?.title
            dispatch(setBreadcrumbPath([{
                name: t("ourBlogs"),
                slug: '/blogs'
            }, {
                name: truncate(title, 30)
            }]))
            setRelatedBlogs(res?.data?.other_blogs)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (blogSlug) {
            getBlogsData()
        }
    }, [blogSlug])
    const getBlogTagsData = async () => {
        try {
            const res = await getBlogTagsApi.getBlogs({})
            setBlogTags(res?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getBlogTagsData()
    }, [])

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            toast.success(t("copyToClipboard"));
        } catch (error) {
            console.error("Error copying to clipboard:", error);
        }
    };


    return (
        <>
            <BreadcrumbComponent />

            <div className="container singl_blog">
                <div className="row">
                    <div className="col-xl-8 col-lg-7 col-sm-12">
                        <div className="blog_content">
                            <h2 className="blog_heading">{blogData?.title}</h2>
                            <div className="admin_details">
                                <div className="admin_img_cont">
                                    <Image src={admin?.profile ? admin?.profile : settingsData?.data?.placeholder_image} width={28} height={28} alt="Admin" className="admin_img" onErrorCapture={placeholderImage} />
                                    <p>{admin?.name}</p>
                                </div>
                                <div className="vLine"></div>
                                {blogData?.views !== 0 &&
                                    <>
                                        <div className="date_of_blog_cont">
                                            <FaEye size={16} color="rgba(0, 0, 0, 0.64)" />
                                            <p className="date_of_blog">{t('views')}: {blogData?.views}</p>
                                        </div>
                                        <div className="vLine"></div>
                                    </>
                                }
                                <div className="date_of_blog_cont">
                                    <FaRegCalendarCheck size={16} color="rgba(0, 0, 0, 0.64)" />
                                    <p className="date_of_blog">{t('postedOn')}: {formatDateMonth(blogData?.created_at)}</p>
                                </div>
                            </div>
                            <Image src={blogData?.image} width={838} height={500} className="blog_main_img" alt="Blog Image" onErrorCapture={placeholderImage} />
                            <div dangerouslySetInnerHTML={{ __html: blogData?.description }}></div>
                            <div className="link_tag_cont">
                                <div className="share_cont">
                                    <p className="share_blog">{t('shareThis')}</p>
                                    <div className="share_icons_cont">
                                        <button onClick={handleCopyUrl} className="copyClipboardBtn">
                                            <BiLink size={24} color="#595B6C" />
                                        </button>

                                        <FacebookShareButton url={currentUrl} title={currentUrl + CompanyName} hashtag={CompanyName}>
                                            <BiLogoFacebook size={24} color="#595B6C" />
                                        </FacebookShareButton>


                                        <TwitterShareButton url={currentUrl}>
                                            <RiTwitterXLine size={21} color="#595B6C" />
                                        </TwitterShareButton>

                                        <WhatsappShareButton url={currentUrl} title={blogData?.title + "" + " - " + "" + CompanyName} hashtag={CompanyName}>
                                            <BiLogoWhatsapp size={24} color="#595B6C" />
                                        </WhatsappShareButton>
                                    </div>
                                </div>
                                {blogData?.tags &&
                                    <div className="tags_item_wrapper single_blog_tag_wrapper">
                                        {blogData?.tags?.map((e, index) => (
                                            <span key={index}>
                                                {e}
                                            </span>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-5 col-sm-12">
                        <div className="our_blog_rightbar_wrapper">
                            {/* <PopularPosts /> */}
                            {/* <Category /> */}
                            {blogTags && blogTags?.length > 0 &&
                                <Tags data={blogTags} />
                            }
                        </div>
                    </div>
                </div>
                {relatedBlogs && relatedBlogs.length > 0 &&
                    <>
                        <div className="row my_prop_title_spacing">
                            <h4 className="pop_cat_head">{t('relatedArticle')}</h4>
                        </div>
                        <div className="row blog_card_row_gap">
                            {relatedBlogs && relatedBlogs?.map((data, index) => (
                                <div className="col-xl-4 col-md-6 col-6" key={index}>
                                    <OurBlogCard data={data} />
                                </div>
                            ))}
                        </div>
                    </>
                }
            </div >
        </>
    )
}

export default SingleBlog