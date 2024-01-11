import { Link } from "react-router-dom"
// import { useDispatch } from "react-redux"
import ProductCard from "../components/ProductCard"
import { useLatestProductsQuery } from "../redux/api/productAPI"
import { Skeleton } from "../components/Loader"
import toast from "react-hot-toast"
import { CartItem } from "../types/types"
import { useDispatch } from "react-redux"
import { addToCart } from "../redux/reducer/cartReducer"
// import { RootState } from "../redux/store"

const Home = () => {
    // const { cartItems, subtotal, tax, total, shippingCharges, discount } = useSelector((state: { cartReducer: CartReducerInitialState }) => state.cartReducer)
    
    const { data, isError, isLoading } = useLatestProductsQuery("")
    // console.log(data)
    // console.log(cartItems)

    const dispatch = useDispatch()

    const addToCartHandler = (cartItem: CartItem) => {
        if(cartItem.stock < 1) return toast.error("Out of Stock")
        dispatch(addToCart(cartItem))
        toast.success("Item added to cart")
    }

    if(isError){
        toast.error("Unable to fetch products")
    }

    return (
        <div className="home">
            <section>
                <img src="/background.png" />
            </section>
           

            <main>
                {isLoading ? (
                    <Skeleton width="80vw" />
                ) : (
                    <>
                    <h1>
                        Latest Products
                        <Link to={"/products"} className="findmore">
                            More
                        </Link>
                    </h1>
                    <div className="product-section">
                        {
                            data?.products.map((i) => (
                                <ProductCard key={i._id} productId={i._id} name={i.name} price={i.price}
                                category={i.category} stock={i.stock} handler={addToCartHandler} photo={i.photo} />
                            ))
                        }
                        {/* <ProductCard productId="55214" name="MacBook" 
                        price={4545} stock={425} handler={addToCartHandler} 
                        photo="https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/refurb-macbook-air-gold-m1-202010?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1634145607000" /> */}
                     
                    </div>
                    </>
                )} 
               
            </main>
        </div>
    )
}

export default Home