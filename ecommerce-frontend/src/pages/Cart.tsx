import { useEffect, useState } from "react"
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState, server } from "../redux/store";
import { CartItem } from "../types/types";
// import { CartReducerInitialState } from "../types/reducer-types"
import { addToCart, calculatePrice, discountApplied, removeCartItem } from "../redux/reducer/cartReducer";
import toast from "react-hot-toast";
import CartItemCard from "../components/CartItemCard"
import { FaSadTear } from "react-icons/fa"
import axios from "axios";

const Cart = () => {
    const { cartItems, subtotal, tax, total, shippingCharges, discount } = useSelector((state: RootState) => state.cartReducer)
    const dispatch = useDispatch()

    console.log(cartItems)
    console.log(discount)

    const [couponCode, setCouponCode] = useState<string>("")
    const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false)

    const incrementHandler = (cartItem: CartItem) => {
        if(cartItem.quantity < cartItem.stock) {
            dispatch(addToCart({...cartItem, quantity: cartItem.quantity + 1 }))
        } else{
            toast.error("Stock not available")
        }
    }

    const decrementHandler = (cartItem: CartItem) => {
        if(cartItem.quantity > 1){
            dispatch(addToCart({...cartItem, quantity: cartItem.quantity - 1 }))
        } else{
           return
        }
    }

    const removeHandler = (productId: string) => {
        dispatch(removeCartItem(productId))
    }

    // const cartItems = [
    //     {
    //         productId: "5542",
    //         photo: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/refurb-macbook-air-gold-m1-202010?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1634145607000",
    //         name: "MacBook Pro Air",
    //         price: 3000,
    //         quantity: 40,
    //         stock: 10
    //     }
    // ]
    // const subTotal = 4000
    // const tax = Math.round(subTotal * 0.18)
    // const shippingCharges = 200
    // const discount = 400
    // const total = subTotal + tax + shippingCharges

    useEffect(() => {
        const { token: cancelToken, cancel } = axios.CancelToken.source() 

        const timeOutID = setTimeout(() => {
            axios.get(`${server}/api/v1/payment/discount?coupon=${couponCode}`,{
                cancelToken
            }).then((res) => {
                dispatch(discountApplied(res.data.discount))
                setIsValidCouponCode(true)
                dispatch(calculatePrice())
            }).catch((error) => {
                console.log(error)
                dispatch(discountApplied(0))
                setIsValidCouponCode(false)
                dispatch(calculatePrice())
            }) 
        }, 1000)

        return () => {
            clearTimeout(timeOutID)
            cancel()
            setIsValidCouponCode(false)
        }
    }, [couponCode])

    useEffect(() => {
        dispatch(calculatePrice())
    }, [cartItems])


    return (
        <div className="cart">
            <main>
                <h1>Cart Items</h1>
                {cartItems.length > 0 ? cartItems?.map((item, idx) => (
                    <CartItemCard key={idx} cartItem={item} 
                    incrementHandler={incrementHandler} decrementHandler={decrementHandler} 
                    removeHandler={removeHandler}/>
                )) : (
                    <div className="no-items-section">
                        <FaSadTear size={90} />
                        <h1 className="no-items">No items added!</h1>
                    </div>
                )}
            </main>
            <aside>
                <h1>Prices</h1>
                <p>Subtotal: HK$ {subtotal} </p>
                <p>Shipping Charges: {cartItems?.length > 0 ? (
                    <>
                        HK$ {shippingCharges}
                    </>
                    ) : (
                    <>
                        HK$ 0
                    </>
                       
                    )}
                </p>
                <p>Tax: HK$ {tax}</p>
                <p>
                    Discount: <em className="red"> - HK${discount}</em>
                </p>
                <p>Total: {cartItems?.length > 0 ? (
                    <>
                        HK$ {total}
                    </>
                    ) : (
                    <>
                        HK$ 0
                    </>
                       
                    )}
                </p>
                <input type="text" placeholder="Coupon Code" value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)} />
                {couponCode && (
                    isValidCouponCode ? (
                        <span className="green">
                            ${discount} off using the <code>{couponCode}</code>
                        </span>
                    ) : (
                        <span className="red">
                            Invalid Coupon <VscError />
                        </span>
                    )
                )}
                {cartItems.length > 0 && <Link to='/shipping' className="checkout-btn">Checkout</Link>}
            </aside>
        </div>
    )
}

export default Cart