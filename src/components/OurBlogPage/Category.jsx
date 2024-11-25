import { t } from "@/utils"
import { MdKeyboardArrowRight } from "react-icons/md"


const Category = () => {
    return (
        <div className="category">
            <h6 className="category_title">{t('category')}</h6>
            <div className="category_item_wrapper">
                <div className="category_item">
                    <p>Electronics & Appliances</p>
                    <MdKeyboardArrowRight size={16} className="category_arrow" />
                </div>
                <div className="category_item">
                    <p>Cameras & Lenses</p>
                    <MdKeyboardArrowRight size={16} className="category_arrow" />
                </div>
                <div className="category_item">
                    <p>Fridges</p>
                    <MdKeyboardArrowRight size={16} className="category_arrow" />
                </div>
                <div className="category_item">
                    <p>Computer Accessories</p>
                    <MdKeyboardArrowRight size={16} className="category_arrow" />
                </div>
            </div>

        </div>
    )
}

export default Category