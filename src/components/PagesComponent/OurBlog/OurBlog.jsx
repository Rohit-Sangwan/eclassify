'use client'
import OurBlogCard from "@/components/Cards/OurBlogCard"
import Category from "@/components/OurBlogPage/Category"
import PopularPosts from "@/components/OurBlogPage/PopularPosts"
import Tags from "@/components/OurBlogPage/Tags"
import { t } from "@/utils"
import { MdKeyboardArrowRight } from "react-icons/md"


const OurBlog = () => {
    return (
        <div className="container">
            <div className="row my_prop_title_spacing">
                <h4 className="pop_cat_head">{t('ourBlog')}</h4>
            </div>
            <div className="row">
                <div className="col-xl-8 col-lg-7 col-sm-12">

                    <div className="row blog_card_row_gap">
                        <div className="col-xl-6 col-lg-12 col-md-6">
                            <OurBlogCard />
                        </div>
                        <div className="col-xl-6 col-lg-12 col-md-6">
                            <OurBlogCard />
                        </div>
                        <div className="col-xl-6 col-lg-12 col-md-6">
                            <OurBlogCard />
                        </div>
                        <div className="col-xl-6 col-lg-12 col-md-6">
                            <OurBlogCard />
                        </div>
                        <div className="col-xl-6 col-lg-12 col-md-6">
                            <OurBlogCard />
                        </div>
                        <div className="col-xl-6 col-lg-12 col-md-6">
                            <OurBlogCard />
                        </div>

                    </div>

                    <div className="row top_distance">
                        <div className="pagi_arrows">
                            <div className="page_num active_page_num">
                                1
                            </div>
                            <div className="page_num">
                                2
                            </div>
                            <div className="page_num pagi_arrow">
                                <MdKeyboardArrowRight size={24} />
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-xl-4 col-lg-5 col-sm-12">

                    <div className="our_blog_rightbar_wrapper">
                        <Category />
                        <Tags />
                        <PopularPosts />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OurBlog