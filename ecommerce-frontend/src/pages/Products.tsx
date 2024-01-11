import { useAllProductsQuery } from '../redux/api/productAPI'
import { useSelector } from "react-redux"
import { RootState } from '../redux/store'
import { CustomError } from '../types/api-types'
import toast from 'react-hot-toast'
import { Skeleton } from "../components/Loader";
import ProductCard from '../components/ProductCard'
import { CartItem } from '../types/types'
import { addToCart } from '../redux/reducer/cartReducer'
import { useDispatch } from "react-redux"

const Products = () => {
    const { user } = useSelector((state: RootState) => state.userReducer)
    const dispatch = useDispatch()

    const { isLoading, isError, error, data } = useAllProductsQuery(user?._id!)
    console.log(isLoading)
    console.log(data?.products)
    
    if(isError){
        const err = error as CustomError 
        toast.error(err.data.message)
    }

    const addToCartHandler = (cartItem: CartItem) => {
        if(cartItem.stock < 1) return toast.error("Out of Stock")
        dispatch(addToCart(cartItem))
        toast.success("Item added to cart")
    }

    return (
        <div className="products">
            {isLoading ? (
                <Skeleton length={20} />
            ) : (
                <section> 
                    <h1>Products</h1>
                    <div className="products-list">
                        {data?.products.map((product) => (
                            <ProductCard key={product._id} productId={product._id} name={product.name}
                            category={product.category} price={product.price} stock={product.stock} handler={addToCartHandler} photo={product.photo} />
                        ))}
                    </div>
                </section>
            )}
        </div> 
    )
}

export default Products