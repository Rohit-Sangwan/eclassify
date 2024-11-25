'use client';
import ProductCard from "../Cards/ProductCard";
import { t } from "@/utils";
import Link from "next/link";
import { userSignUpData } from "@/redux/reuducer/authSlice";
import { useSelector } from "react-redux";



const FeaturedSections = ({ featuredData, setFeaturedData, allEmpty }) => {

    const userData = useSelector(userSignUpData);

    const handleLike = (id) => {
        const updatedData = featuredData.map(section => {
            const updatedSectionData = section.section_data.map(item => {
                if (item.id === id) {
                    return { ...item, is_liked: !item.is_liked };
                }
                return item;
            });
            return { ...section, section_data: updatedSectionData };
        });
        setFeaturedData(updatedData);
    };

   

    return (

        <div className="container">
            <div className="row product_card_card_gap">
                <div className="col-12">
                    <div className="all_sections">
                    {featuredData && !allEmpty && (
                            featuredData.map((ele, index) => (
                                ele?.section_data.length > 0 && (
                                    <div key={index} className="w-100">
                                        <div className="pop_categ_mrg_btm w-100">
                                            <h4 className="pop_cat_head">{ele?.title}</h4>
                                            {ele?.section_data.length > 4 &&
                                                <Link href={`/featured-sections/${ele?.slug}`} className="view_all_link" prefetch={false}>
                                                    <span className="view_all">{t('viewAll')}</span>
                                                </Link>
                                            }
                                        </div>
                                        <div className="row product_card_card_gap">
                                            {ele?.section_data.slice(0, 4).map((data, index) => (
                                                <div className="col-xxl-3 col-lg-4 col-6 card_col_gap" key={index}>
                                                    <Link href={userData?.id == data?.user_id ? `/my-listing/${data?.slug}` : `/product-details/${data.slug}`} prefetch={false}>
                                                        <ProductCard data={data} handleLike={handleLike} />
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedSections;
