import ProductCard from "@/components/Cards/ProductCard"
import UserCard from "@/components/Cards/UserCard"


const User = () => {
    return (
        <div className="container user_top_space">
            <div className="row product_card_card_gap">
                <div className="col-sm-3 col-lg-4 col-sm-12">
                    <UserCard />
                </div>
                <div className="col-sm-9 col-lg-8 col-sm-12">
                    <div className="row product_card_card_gap">
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <ProductCard />
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <ProductCard />
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <ProductCard />
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <ProductCard />
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <ProductCard />
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <ProductCard />
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <ProductCard />
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <ProductCard />
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                            <ProductCard />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User